import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      action, // 'APPROVE' | 'REJECT' | 'REQUEST_CHANGES'
      comment,
      checklist,
      reviewerName = 'Reviewer',
      reviewerRole = 'SME',
    } = body;

    let newStatus = 'PENDING_REVIEW';
    if (action === 'APPROVE') newStatus = 'APPROVED';
    else if (action === 'REJECT') newStatus = 'REJECTED';
    else if (action === 'REQUEST_CHANGES') newStatus = 'CHANGES_REQUESTED';

    const question = await prisma.question.update({
      where: { id: params.id },
      data: { verificationStatus: newStatus },
    });

    const review = await prisma.questionReview.create({
      data: {
        questionId: question.id,
        reviewerName,
        reviewerRole,
        action,
        comment: comment || `Question marked as ${action} by ${reviewerName}`,
        checklistJson: checklist ? JSON.stringify(checklist) : undefined,
      },
    });

    return NextResponse.json({ success: true, question, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
