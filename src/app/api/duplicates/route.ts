import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const duplicates = await prisma.questionDuplicate.findMany({
      orderBy: { similarityScore: 'desc' },
    });

    const enriched = await Promise.all(
      duplicates.map(async (dup) => {
        const [orig, duplicate] = await Promise.all([
          prisma.question.findUnique({
            where: { id: dup.originalQuestionId },
            include: { source: true, taxonomyMappings: { include: { subject: true, chapter: true } } },
          }),
          prisma.question.findUnique({
            where: { id: dup.duplicateQuestionId },
            include: { source: true, taxonomyMappings: { include: { subject: true, chapter: true } } },
          }),
        ]);
        return {
          ...dup,
          originalQuestion: orig,
          duplicateQuestion: duplicate,
        };
      })
    );

    return NextResponse.json({ duplicates: enriched });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
