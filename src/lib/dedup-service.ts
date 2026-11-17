import crypto from 'crypto';
import { prisma } from './prisma';

export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/\\(frac|sqrt|cdot|int|sum|alpha|beta|gamma|theta|pi|omega|Delta|nu|mu|lambda)/g, ' ')
    .replace(/[\$\{\}\\\_\^\(\)\[\]\+\-\=\/\*]/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function computeHash(text: string): string {
  return crypto.createHash('sha256').update(text.trim()).digest('hex');
}

export function calculateJaccardSimilarity(textA: string, textB: string): number {
  const normA = normalizeText(textA);
  const normB = normalizeText(textB);

  const tokensA = new Set(normA.split(' ').filter((w) => w.length > 2));
  const tokensB = new Set(normB.split(' ').filter((w) => w.length > 2));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  const arrA = Array.from(tokensA);
  const arrB = Array.from(tokensB);
  const intersection = new Set(arrA.filter((x) => tokensB.has(x)));
  const union = new Set(arrA.concat(arrB));

  return intersection.size / union.size;
}

export async function checkQuestionDuplicates(statementText: string, currentQuestionId?: string) {
  const normText = normalizeText(statementText);
  const textHash = computeHash(statementText);
  const normHash = computeHash(normText);

  // Retrieve existing questions to compare
  const existingQuestions = await prisma.question.findMany({
    where: currentQuestionId ? { id: { not: currentQuestionId } } : undefined,
    select: {
      id: true,
      code: true,
      statementText: true,
      contentHash: true,
      normalisedText: true,
      type: true,
      verificationStatus: true,
      source: {
        select: {
          sourceName: true,
          examName: true,
          examYear: true,
        },
      },
    },
    take: 100, // sample window for comparison
  });

  const matches: Array<{
    existingQuestionId: string;
    existingQuestionCode: string;
    similarityScore: number;
    matchType: 'EXACT' | 'NORMALISED' | 'SEMANTIC';
    sourceName?: string;
  }> = [];

  for (const eq of existingQuestions) {
    if (eq.contentHash === textHash) {
      matches.push({
        existingQuestionId: eq.id,
        existingQuestionCode: eq.code,
        similarityScore: 1.0,
        matchType: 'EXACT',
        sourceName: eq.source?.sourceName,
      });
      continue;
    }

    const eqNorm = eq.normalisedText || normalizeText(eq.statementText || '');
    if (computeHash(eqNorm) === normHash) {
      matches.push({
        existingQuestionId: eq.id,
        existingQuestionCode: eq.code,
        similarityScore: 0.98,
        matchType: 'NORMALISED',
        sourceName: eq.source?.sourceName,
      });
      continue;
    }

    const similarity = calculateJaccardSimilarity(statementText, eq.statementText || '');
    if (similarity >= 0.70) {
      matches.push({
        existingQuestionId: eq.id,
        existingQuestionCode: eq.code,
        similarityScore: parseFloat(similarity.toFixed(2)),
        matchType: 'SEMANTIC',
        sourceName: eq.source?.sourceName,
      });
    }
  }

  return matches;
}
