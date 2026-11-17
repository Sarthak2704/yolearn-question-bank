import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, questionIds, payload, performedBy = 'Admin User' } = body;

    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return NextResponse.json({ error: 'No questionIds provided' }, { status: 400 });
    }

    let updatedCount = 0;

    switch (action) {
      case 'APPROVE':
        const approveRes = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { verificationStatus: 'APPROVED' },
        });
        updatedCount = approveRes.count;
        for (const qId of questionIds) {
          await prisma.questionReview.create({
            data: {
              questionId: qId,
              reviewerName: performedBy,
              reviewerRole: 'SUPER_ADMIN',
              action: 'APPROVE',
              comment: payload?.comment || 'Bulk approved by administrator',
            },
          });
        }
        break;

      case 'REJECT':
        const rejectRes = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { verificationStatus: 'REJECTED' },
        });
        updatedCount = rejectRes.count;
        for (const qId of questionIds) {
          await prisma.questionReview.create({
            data: {
              questionId: qId,
              reviewerName: performedBy,
              reviewerRole: 'SUPER_ADMIN',
              action: 'REJECT',
              comment: payload?.comment || 'Bulk rejected by administrator',
            },
          });
        }
        break;

      case 'ARCHIVE':
        const archiveRes = await prisma.question.updateMany({
          where: { id: { in: questionIds } },
          data: { verificationStatus: 'ARCHIVED', publishingStatus: 'ARCHIVED' },
        });
        updatedCount = archiveRes.count;
        break;

      case 'CHANGE_DIFFICULTY':
        if (payload?.difficulty) {
          const diffRes = await prisma.question.updateMany({
            where: { id: { in: questionIds } },
            data: { difficulty: payload.difficulty },
          });
          updatedCount = diffRes.count;
        }
        break;

      case 'ADD_TAG':
        if (payload?.tagId) {
          for (const qId of questionIds) {
            await prisma.questionTagMapping.upsert({
              where: { id: `${qId}_${payload.tagId}` },
              update: {},
              create: {
                id: `${qId}_${payload.tagId}`,
                questionId: qId,
                tagId: payload.tagId,
              },
            }).catch(() => {});
          }
          updatedCount = questionIds.length;
        }
        break;

      default:
        return NextResponse.json({ error: `Unsupported bulk action: ${action}` }, { status: 400 });
    }

    // Write audit log
    await prisma.auditLog.create({
      data: {
        userName: performedBy,
        action: `BULK_${action}`,
        entityType: 'QUESTION',
        detailsJson: JSON.stringify({ questionIds, payload, updatedCount }),
      },
    });

    return NextResponse.json({ success: true, action, updatedCount });
  } catch (error: any) {
    console.error('Error in bulk action:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
