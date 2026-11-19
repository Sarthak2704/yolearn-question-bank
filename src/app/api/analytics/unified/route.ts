import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [
      totalBooks,
      booksProcessing,
      booksPendingReview,
      booksVerified,
      booksPublished,
      totalChapters,

      totalQuestions,
      questionsPending,
      questionsApproved,
      questionsPublished,
      totalDuplicates,

      totalShorts,
      shortsPending,
      shortsApproved,
      shortsPublished,

      totalSubjects,
      totalTaxonomyChapters,
      totalTopics,
    ] = await Promise.all([
      prisma.book.count(),
      prisma.book.count({ where: { status: 'PROCESSING' } }),
      prisma.book.count({ where: { status: { in: ['EXTRACTION_COMPLETED', 'PENDING_REVIEW', 'UNDER_REVIEW'] } } }),
      prisma.book.count({ where: { status: 'VERIFIED' } }),
      prisma.book.count({ where: { status: 'PUBLISHED' } }),
      prisma.bookChapter.count(),

      prisma.question.count(),
      prisma.question.count({ where: { verificationStatus: { in: ['DRAFT', 'PENDING_REVIEW'] } } }),
      prisma.question.count({ where: { verificationStatus: 'APPROVED' } }),
      prisma.question.count({ where: { publishingStatus: 'PUBLISHED' } }),
      prisma.questionDuplicate.count({ where: { status: 'PENDING' } }),

      prisma.yoShort.count(),
      prisma.yoShort.count({ where: { verificationStatus: 'PENDING_REVIEW' } }),
      prisma.yoShort.count({ where: { verificationStatus: 'APPROVED' } }),
      prisma.yoShort.count({ where: { publishingStatus: 'PUBLISHED' } }),

      prisma.subject.count(),
      prisma.chapter.count(),
      prisma.topic.count(),
    ]);

    // Calculate content completeness by subject
    const subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: {
            books: true,
            chapters: true,
            yoShorts: true,
          },
        },
      },
    });

    const subjectCompleteness = subjects.map((sub) => {
      const hasBooks = sub._count.books > 0;
      const hasShorts = sub._count.yoShorts > 0;
      const score = (hasBooks ? 50 : 10) + (hasShorts ? 30 : 10) + Math.min(20, sub._count.chapters * 5);
      return {
        id: sub.id,
        name: sub.name,
        code: sub.code,
        booksCount: sub._count.books,
        chaptersCount: sub._count.chapters,
        shortsCount: sub._count.yoShorts,
        score: Math.min(100, score),
      };
    });

    return NextResponse.json({
      success: true,
      books: {
        total: totalBooks,
        processing: booksProcessing,
        pendingReview: booksPendingReview,
        verified: booksVerified,
        published: booksPublished,
        chaptersCount: totalChapters,
      },
      questions: {
        total: totalQuestions,
        pending: questionsPending,
        approved: questionsApproved,
        published: questionsPublished,
        duplicates: totalDuplicates,
        readyForProduction: questionsApproved,
      },
      shorts: {
        total: totalShorts,
        pendingReview: shortsPending,
        approved: shortsApproved,
        published: shortsPublished,
      },
      taxonomyHealth: {
        totalSubjects,
        totalChapters: totalTaxonomyChapters,
        totalTopics,
        unmappedContent: 0,
        pendingReviewsTotal: booksPendingReview + questionsPending + shortsPending,
        subjectCompleteness,
      },
    });
  } catch (error: any) {
    console.error('Error fetching unified analytics:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch analytics' }, { status: 500 });
  }
}
