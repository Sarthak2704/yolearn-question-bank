import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractQuestionFromText, autoTagQuestion } from '@/lib/ai-service';

export async function GET() {
  try {
    const jobs = await prisma.questionImportJob.findMany({
      include: {
        items: {
          take: 20,
          orderBy: { itemIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ jobs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fileName = 'Import_Batch_' + Date.now() + '.pdf',
      fileType = 'PDF',
      fileSize = 2500000,
      totalPages = 5,
      rawContent,
    } = body;

    // 1. Create the import job
    const job = await prisma.questionImportJob.create({
      data: {
        fileName,
        fileType,
        fileSize,
        totalPages: parseInt(totalPages) || 1,
        totalDetected: 0,
        successfullyExtracted: 0,
        failedCount: 0,
        pendingReviewCount: 0,
        status: 'PROCESSING',
      },
    });

    // 2. Sample extracted questions to simulate realistic parsing of multi-question document
    const sampleItems = [
      {
        pageNumber: 1,
        itemIndex: 1,
        rawContent:
          rawContent ||
          'Q1. In a photoelectric experiment with light of frequency 1.5 times the threshold frequency, if frequency is halved and intensity is doubled, find the photocurrent.\n(A) Zero\n(B) Doubled\n(C) Halved\n(D) Quadrupled',
      },
      {
        pageNumber: 2,
        itemIndex: 2,
        rawContent:
          'Q2. The rate constant of a first-order chemical reaction is k = 2.303 x 10^-3 s^-1. Determine the time required for 75% completion of the reaction in seconds.\n(A) 600 s\n(B) 300 s\n(C) 1200 s\n(D) 150 s',
      },
      {
        pageNumber: 3,
        itemIndex: 3,
        rawContent:
          'Q3. Find the value of real parameter alpha such that the vectors a = 2i - j + k and b = i + 2j - 3k are orthogonal to c = 3i + alpha j + 5k.',
      },
    ];

    let successCount = 0;
    let failedCount = 0;

    for (const item of sampleItems) {
      try {
        const extraction = await extractQuestionFromText(item.rawContent);
        const tagging = await autoTagQuestion(extraction.statement);

        // Find or map subject
        const subject = await prisma.subject.findFirst({
          where: { name: { contains: tagging.suggestedSubject.name } },
        });

        // Create imported question in DRAFT status
        const count = await prisma.question.count();
        const subCode = subject?.code || 'IMP';
        const qCode = `QB-${subCode}-${String(count + 1).padStart(6, '0')}`;

        const question = await prisma.question.create({
          data: {
            code: qCode,
            type: extraction.type || 'MCQ',
            difficulty: tagging.suggestedDifficulty.value,
            cognitiveLevel: tagging.suggestedCognitiveLevel.value,
            questionNature: tagging.suggestedNature.value,
            questionStyle: tagging.suggestedStyle.value,
            verificationStatus: 'DRAFT',
            publishingStatus: 'UNPUBLISHED',
            statementText: extraction.statement,
            contentJson: JSON.stringify({ statement: extraction.statement }),
            optionsJson: JSON.stringify(extraction.options || []),
            answerJson: JSON.stringify(extraction.answer || {}),
            solutionJson: JSON.stringify(extraction.solution || {}),
          },
        });

        // Record successful item
        await prisma.questionImportItem.create({
          data: {
            jobId: job.id,
            pageNumber: item.pageNumber,
            itemIndex: item.itemIndex,
            rawContent: item.rawContent,
            extractedDataJson: JSON.stringify({ extraction, tagging }),
            status: 'SUCCESS',
            questionId: question.id,
          },
        });

        successCount++;
      } catch (err: any) {
        failedCount++;
        await prisma.questionImportItem.create({
          data: {
            jobId: job.id,
            pageNumber: item.pageNumber,
            itemIndex: item.itemIndex,
            rawContent: item.rawContent,
            status: 'ERROR',
            errorMessage: err.message,
          },
        });
      }
    }

    // Update job final status
    const updatedJob = await prisma.questionImportJob.update({
      where: { id: job.id },
      data: {
        totalDetected: sampleItems.length,
        successfullyExtracted: successCount,
        failedCount,
        pendingReviewCount: successCount,
        status: failedCount > 0 ? 'PARTIALLY_FAILED' : 'EXTRACTION_COMPLETED',
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, job: updatedJob });
  } catch (error: any) {
    console.error('Error processing bulk upload:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
