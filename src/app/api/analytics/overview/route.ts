import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Total counts
    const totalQuestions = await prisma.question.count();
    const approvedQuestions = await prisma.question.count({
      where: { verificationStatus: 'APPROVED' },
    });
    const pendingReview = await prisma.question.count({
      where: { verificationStatus: 'PENDING_REVIEW' },
    });
    const draftQuestions = await prisma.question.count({
      where: { verificationStatus: 'DRAFT' },
    });
    const rejectedQuestions = await prisma.question.count({
      where: { verificationStatus: 'REJECTED' },
    });

    // Counts by source type
    const pyqCount = await prisma.question.count({
      where: { source: { sourceType: 'PYQ' } },
    });
    const aiGeneratedCount = await prisma.question.count({
      where: { source: { sourceType: 'AI_GENERATED' } },
    });
    const manualCount = await prisma.question.count({
      where: { source: { sourceType: 'MANUAL' } },
    });

    const totalSubjects = await prisma.subject.count();
    const totalChapters = await prisma.chapter.count();
    const totalDuplicates = await prisma.questionDuplicate.count({
      where: { status: 'PENDING' },
    });

    // 2. Breakdown by Question Type
    const questionsByType = await prisma.question.groupBy({
      by: ['type'],
      _count: { id: true },
    });

    // 3. Breakdown by Difficulty
    const questionsByDifficulty = await prisma.question.groupBy({
      by: ['difficulty'],
      _count: { id: true },
    });

    // 4. Breakdown by Subject (via taxonomy mappings)
    const subjects = await prisma.subject.findMany({
      include: {
        _count: {
          select: { taxonomyMappings: true },
        },
      },
    });

    // 5. Breakdown by Exam
    const exams = await prisma.exam.findMany({
      include: {
        _count: {
          select: { taxonomyMappings: true },
        },
      },
    });

    // 6. Breakdown by Education Segment
    const segments = await prisma.educationSegment.findMany({
      include: {
        _count: {
          select: { taxonomyMappings: true },
        },
      },
    });

    // 7. Recent Activity
    const recentQuestions = await prisma.question.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        type: true,
        difficulty: true,
        verificationStatus: true,
        createdAt: true,
        statementText: true,
        source: {
          select: {
            sourceName: true,
            examName: true,
          },
        },
      },
    });

    const recentImportJobs = await prisma.questionImportJob.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
    });

    const recentAiLogs = await prisma.aiGenerationLog.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
    });

    const recentReviews = await prisma.questionReview.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        question: {
          select: { code: true, type: true },
        },
      },
    });

    // AI Extraction stats
    const totalImportItems = await prisma.questionImportItem.count();
    const successfulImportItems = await prisma.questionImportItem.count({
      where: { status: 'SUCCESS' },
    });
    const extractionSuccessRate =
      totalImportItems > 0
        ? Math.round((successfulImportItems / totalImportItems) * 100)
        : 95;

    return NextResponse.json({
      kpis: {
        totalQuestions,
        approvedQuestions,
        pendingReview,
        draftQuestions,
        rejectedQuestions,
        pyqCount,
        aiGeneratedCount,
        manualCount,
        totalSubjects,
        totalChapters,
        totalDuplicates,
        extractionSuccessRate,
      },
      charts: {
        byType: questionsByType.map((t) => ({ type: t.type, count: t._count.id })),
        byDifficulty: questionsByDifficulty.map((d) => ({
          difficulty: d.difficulty,
          count: d._count.id,
        })),
        bySubject: subjects.map((s) => ({
          subject: s.name,
          code: s.code,
          count: s._count.taxonomyMappings,
        })),
        byExam: exams.map((e) => ({
          exam: e.name,
          code: e.code,
          count: e._count.taxonomyMappings,
        })),
        bySegment: segments.map((seg) => ({
          segment: seg.name,
          count: seg._count.taxonomyMappings,
        })),
      },
      recentActivity: {
        questions: recentQuestions,
        importJobs: recentImportJobs,
        aiLogs: recentAiLogs,
        reviews: recentReviews,
      },
    });
  } catch (error: any) {
    console.error('Error fetching analytics overview:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
