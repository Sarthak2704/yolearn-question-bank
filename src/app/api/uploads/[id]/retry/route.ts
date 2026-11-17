import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractQuestionFromText } from '@/lib/ai-service';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const job = await prisma.questionImportJob.findUnique({
      where: { id: params.id },
      include: { items: { where: { status: { not: 'SUCCESS' } } } },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    let retriedSuccess = 0;

    for (const item of job.items) {
      try {
        const extraction = await extractQuestionFromText(item.rawContent);
        const count = await prisma.question.count();
        const qCode = `QB-RETRY-${String(count + 1).padStart(6, '0')}`;

        const question = await prisma.question.create({
          data: {
            code: qCode,
            type: extraction.type || 'MCQ',
            difficulty: 'MEDIUM',
            verificationStatus: 'DRAFT',
            publishingStatus: 'UNPUBLISHED',
            statementText: extraction.statement,
            contentJson: JSON.stringify({ statement: extraction.statement }),
            optionsJson: JSON.stringify(extraction.options || []),
            answerJson: JSON.stringify(extraction.answer || {}),
            solutionJson: JSON.stringify(extraction.solution || {}),
          },
        });

        await prisma.questionImportItem.update({
          where: { id: item.id },
          data: {
            status: 'SUCCESS',
            errorMessage: null,
            extractedDataJson: JSON.stringify(extraction),
            questionId: question.id,
          },
        });

        retriedSuccess++;
      } catch (e: any) {
        // still failed
      }
    }

    const updatedJob = await prisma.questionImportJob.update({
      where: { id: job.id },
      data: {
        successfullyExtracted: job.successfullyExtracted + retriedSuccess,
        failedCount: Math.max(0, job.failedCount - retriedSuccess),
        status: job.failedCount - retriedSuccess === 0 ? 'COMPLETED' : 'PARTIALLY_FAILED',
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, retriedSuccess, job: updatedJob });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
