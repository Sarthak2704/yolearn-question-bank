import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get('contentType') || 'ALL'; // ALL, BOOK, QUESTION, YOSHORT
    const statusFilter = searchParams.get('status') || 'PENDING'; // PENDING, ALL, APPROVED, CHANGES_REQUESTED

    // 1. Fetch pending/reviewable Books
    const bookWhere: any = {};
    if (statusFilter === 'PENDING') {
      bookWhere.status = { in: ['UPLOADED', 'PROCESSING', 'EXTRACTION_COMPLETED', 'PENDING_REVIEW', 'UNDER_REVIEW'] };
    }
    const books = contentType === 'ALL' || contentType === 'BOOK'
      ? await prisma.book.findMany({
          where: bookWhere,
          include: { subject: true },
          orderBy: { updatedAt: 'desc' },
          take: 20,
        })
      : [];

    // 2. Fetch pending Questions
    const questionWhere: any = {};
    if (statusFilter === 'PENDING') {
      questionWhere.verificationStatus = { in: ['DRAFT', 'PENDING_REVIEW', 'CHANGES_REQUESTED'] };
    }
    const questions = contentType === 'ALL' || contentType === 'QUESTION'
      ? await prisma.question.findMany({
          where: questionWhere,
          include: {
            source: true,
            taxonomyMappings: {
              include: { subject: true, chapter: true, topic: true, exam: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 25,
        })
      : [];

    // 3. Fetch pending YoShorts
    const shortWhere: any = {};
    if (statusFilter === 'PENDING') {
      shortWhere.verificationStatus = { in: ['PENDING_REVIEW', 'CHANGES_REQUESTED'] };
    }
    const shorts = contentType === 'ALL' || contentType === 'YOSHORT'
      ? await prisma.yoShort.findMany({
          where: shortWhere,
          include: {
            subject: true,
            centralTopic: true,
            bookMappings: { include: { book: true, chapter: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        })
      : [];

    // Transform into unified review items
    const unifiedQueue = [
      ...books.map((b) => ({
        id: b.id,
        contentType: 'BOOK' as const,
        title: b.title,
        subtitle: `${b.curriculum} • Grade ${b.grade} • ${b.subject?.name || 'General'}`,
        status: b.status,
        priority: b.status === 'EXTRACTION_COMPLETED' ? 'HIGH' : 'MEDIUM',
        assignedReviewer: 'SME Reviewer Pool',
        submittedAt: b.updatedAt,
        actionUrl: `/books/${b.id}`,
        pendingAction: 'Verify OCR extracted chapters and formulas',
        metadata: {
          code: b.code,
          totalPages: b.totalPages,
          totalChapters: b.totalChapters,
          confidence: '96%',
        },
      })),
      ...questions.map((q) => {
        const primaryTax = q.taxonomyMappings[0];
        return {
          id: q.id,
          contentType: 'QUESTION' as const,
          title: q.statementText ? q.statementText.slice(0, 90) + '...' : `Question ${q.code}`,
          subtitle: `${primaryTax?.exam?.name || primaryTax?.subject?.name || 'Question'} • ${q.type} • ${q.difficulty}`,
          status: q.verificationStatus,
          priority: q.difficulty === 'HARD' ? 'HIGH' : 'MEDIUM',
          assignedReviewer: 'Dr. Rajesh Verma (SME)',
          submittedAt: q.createdAt,
          actionUrl: `/questions/${q.id}`,
          pendingAction: 'Verify mathematical equations and answer key',
          metadata: {
            code: q.code,
            type: q.type,
            positiveMarks: q.positiveMarks,
          },
        };
      }),
      ...shorts.map((s) => ({
        id: s.id,
        contentType: 'YOSHORT' as const,
        title: s.title,
        subtitle: `${s.curriculum || 'CBSE'} • Grade ${s.grade || 10} • ${s.subject?.name || 'Science'} (${s.durationSeconds}s)`,
        status: s.verificationStatus,
        priority: s.verificationStatus === 'CHANGES_REQUESTED' ? 'HIGH' : 'LOW',
        assignedReviewer: 'Video Production SME',
        submittedAt: s.createdAt,
        actionUrl: `/shorts/${s.id}`,
        pendingAction: 'Review educational script and visual synchronization',
        metadata: {
          code: s.code,
          duration: `${s.durationSeconds}s`,
          videoUrl: s.videoUrl,
        },
      })),
    ];

    // Sort by submission date descending
    unifiedQueue.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json({
      success: true,
      queue: unifiedQueue,
      counts: {
        total: unifiedQueue.length,
        books: books.length,
        questions: questions.length,
        shorts: shorts.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching unified review queue:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch review queue' }, { status: 500 });
  }
}
