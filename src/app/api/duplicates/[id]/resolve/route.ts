import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { action, notes } = body;
    // action: 'KEEP_BOTH' | 'MARK_DUPLICATE' | 'MERGE_SOURCES'

    const dupRecord = await prisma.questionDuplicate.findUnique({
      where: { id: params.id },
    });

    if (!dupRecord) {
      return NextResponse.json({ error: 'Duplicate record not found' }, { status: 404 });
    }

    if (action === 'MARK_DUPLICATE') {
      // Archive duplicate question
      await prisma.question.update({
        where: { id: dupRecord.duplicateQuestionId },
        data: { verificationStatus: 'ARCHIVED', publishingStatus: 'ARCHIVED' },
      });
    }

    const updated = await prisma.questionDuplicate.update({
      where: { id: params.id },
      data: {
        status: `RESOLVED_${action}`,
        resolutionNotes: notes || `Resolved as ${action}`,
      },
    });

    return NextResponse.json({ success: true, duplicate: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
