import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const topic = await prisma.topic.findUnique({
      where: { id },
      include: {
        chapter: {
          include: {
            subject: true,
            class: true,
          },
        },
        subtopics: {
          include: {
            concepts: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
        bookTopics: {
          include: {
            chapter: {
              include: {
                book: true,
                pages: true,
              },
            },
          },
        },
        yoShorts: {
          include: {
            reviews: { take: 1 },
          },
        },
        taxonomyMappings: {
          include: {
            question: {
              include: {
                source: true,
                bookMappings: {
                  include: {
                    book: true,
                    chapter: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: 'Academic Topic not found' }, { status: 404 });
    }

    // Extract deduplicated questions mapped to this topic
    const questions = topic.taxonomyMappings
      .map((tm) => tm.question)
      .filter(Boolean);

    // Also find questions mapped via bookTopics
    const bookTopicIds = topic.bookTopics.map((bt) => bt.id);
    const bookMappedQuestions = await prisma.questionBookMapping.findMany({
      where: {
        bookTopicId: { in: bookTopicIds },
      },
      include: {
        question: {
          include: {
            source: true,
          },
        },
        book: true,
        chapter: true,
      },
    });

    // Content completeness calculation (Target: at least 1 verified book chapter, 5 questions, 1 YoShort)
    const hasBook = topic.bookTopics.length > 0;
    const hasQuestions = questions.length >= 3;
    const hasShorts = topic.yoShorts.length >= 1;
    const completenessScore = Math.round(
      (hasBook ? 35 : topic.bookTopics.length > 0 ? 20 : 0) +
      Math.min(45, (questions.length / 3) * 45) +
      (hasShorts ? 20 : 0)
    );

    return NextResponse.json({
      success: true,
      topic,
      relatedContent: {
        books: topic.bookTopics.map((bt) => ({
          bookTopicId: bt.id,
          bookTopicTitle: bt.title,
          status: bt.status,
          confidence: bt.extractionConfidence,
          chapter: bt.chapter,
          book: bt.chapter.book,
        })),
        questions,
        bookMappedQuestions,
        yoShorts: topic.yoShorts,
      },
      completeness: {
        score: completenessScore,
        hasBook,
        questionCount: questions.length,
        shortCount: topic.yoShorts.length,
        status: completenessScore >= 80 ? 'EXCELLENT' : completenessScore >= 50 ? 'MODERATE' : 'INCOMPLETE',
      },
    });
  } catch (error: any) {
    console.error('Error fetching topic relationship:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch relationships' }, { status: 500 });
  }
}
