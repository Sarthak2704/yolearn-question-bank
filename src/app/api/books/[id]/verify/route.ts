import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      level = 'BOOK', // BOOK, CHAPTER, TOPIC, PAGE, BLOCK
      targetId,       // ID of chapter, topic, or page if level != 'BOOK'
      status = 'VERIFIED', // VERIFIED, APPROVED, CHANGES_REQUESTED, REJECTED
      reviewerName = 'Dr. Priya Sharma (SME Reviewer)',
      notes,
    } = body;

    let result: any = null;

    if (level === 'BOOK') {
      result = await prisma.book.update({
        where: { id },
        data: {
          status,
          verificationLevel: 'BOOK',
        },
      });
    } else if (level === 'CHAPTER' && targetId) {
      result = await prisma.bookChapter.update({
        where: { id: targetId },
        data: {
          status,
          verifiedBy: reviewerName,
          verifiedAt: new Date(),
        },
      });
    } else if (level === 'TOPIC' && targetId) {
      result = await prisma.bookTopic.update({
        where: { id: targetId },
        data: {
          status,
        },
      });
    } else if (level === 'PAGE' && targetId) {
      result = await prisma.bookPage.update({
        where: { id: targetId },
        data: {
          isVerified: status === 'VERIFIED' || status === 'APPROVED',
        },
      });
    }

    // Log the verification audit
    await prisma.auditLog.create({
      data: {
        action: `BOOK_${level}_${status}`,
        entityType: 'BOOK',
        entityId: id,
        userName: reviewerName,
        detailsJson: JSON.stringify({ level, targetId, status, notes }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully verified at ${level} level as ${status}`,
      result,
    });
  } catch (error: any) {
    console.error('Error verifying book content:', error);
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
