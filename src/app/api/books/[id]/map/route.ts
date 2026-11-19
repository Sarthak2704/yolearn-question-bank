import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { bookTopicId, centralTopicId } = body;

    if (!bookTopicId || !centralTopicId) {
      return NextResponse.json(
        { error: 'bookTopicId and centralTopicId are required' },
        { status: 400 }
      );
    }

    // Verify central topic exists
    const centralTopic = await prisma.topic.findUnique({
      where: { id: centralTopicId },
      include: { chapter: { include: { subject: true } } },
    });

    if (!centralTopic) {
      return NextResponse.json({ error: 'Central taxonomy topic not found' }, { status: 404 });
    }

    const updated = await prisma.bookTopic.update({
      where: { id: bookTopicId },
      data: {
        centralTopicId,
      },
      include: {
        centralTopic: {
          include: {
            chapter: true,
          },
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'BOOK_TOPIC_MAPPED_TO_TAXONOMY',
        entityType: 'BOOK',
        entityId: id,
        detailsJson: JSON.stringify({
          bookTopicId,
          centralTopicId,
          centralTopicName: centralTopic.name,
          chapterName: centralTopic.chapter.name,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Successfully mapped book topic to Central Topic: ${centralTopic.name}`,
      bookTopic: updated,
    });
  } catch (error: any) {
    console.error('Error mapping book topic to taxonomy:', error);
    return NextResponse.json({ error: error.message || 'Mapping failed' }, { status: 500 });
  }
}
