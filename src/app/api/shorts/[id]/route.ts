import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const short = await prisma.yoShort.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
      include: {
        subject: true,
        centralTopic: {
          include: {
            chapter: {
              include: {
                subject: true,
              },
            },
          },
        },
        bookMappings: {
          include: {
            book: true,
            chapter: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!short) {
      return NextResponse.json({ error: 'YoShort not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, short });
  } catch (error: any) {
    console.error('Error fetching YoShort detail:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch YoShort' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    const updated = await prisma.yoShort.update({
      where: { id },
      data,
      include: {
        subject: true,
        centralTopic: true,
        bookMappings: {
          include: {
            book: true,
            chapter: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, short: updated });
  } catch (error: any) {
    console.error('Error updating YoShort:', error);
    return NextResponse.json({ error: error.message || 'Failed to update YoShort' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, reviewerName = 'Reviewer', comment } = body;

    // action: APPROVE, REJECT, REQUEST_CHANGES, REGENERATE
    let newStatus = 'PENDING_REVIEW';
    if (action === 'APPROVE') newStatus = 'APPROVED';
    if (action === 'REJECT') newStatus = 'REJECTED';
    if (action === 'REQUEST_CHANGES') newStatus = 'CHANGES_REQUESTED';

    const short = await prisma.yoShort.update({
      where: { id },
      data: {
        verificationStatus: newStatus,
        publishingStatus: action === 'APPROVE' ? 'PUBLISHED' : 'UNPUBLISHED',
      },
    });

    await prisma.yoShortReview.create({
      data: {
        yoShortId: id,
        reviewerName,
        action,
        comment,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: `YOSHORT_${action}`,
        entityType: 'YOSHORT',
        entityId: id,
        userName: reviewerName,
        detailsJson: JSON.stringify({ action, comment }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `YoShort updated with review action: ${action}`,
      short,
    });
  } catch (error: any) {
    console.error('Error processing YoShort review action:', error);
    return NextResponse.json({ error: error.message || 'Review action failed' }, { status: 500 });
  }
}
