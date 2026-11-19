import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    if (!q) {
      return NextResponse.json({
        success: true,
        results: { books: [], questions: [], shorts: [], topics: [] },
        total: 0,
      });
    }

    const [books, questions, shorts, topics] = await Promise.all([
      // 1. Search Books
      prisma.book.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { code: { contains: q } },
            { rawChapterNames: { contains: q } },
            { publisher: { contains: q } },
          ],
        },
        include: { subject: true },
        take: 5,
      }),

      // 2. Search Questions
      prisma.question.findMany({
        where: {
          OR: [
            { code: { contains: q } },
            { statementText: { contains: q } },
          ],
        },
        include: {
          source: true,
          taxonomyMappings: { include: { subject: true, chapter: true } },
        },
        take: 8,
      }),

      // 3. Search YoShorts
      prisma.yoShort.findMany({
        where: {
          OR: [
            { title: { contains: q } },
            { code: { contains: q } },
            { transcript: { contains: q } },
          ],
        },
        include: { subject: true, centralTopic: true },
        take: 5,
      }),

      // 4. Search Topics
      prisma.topic.findMany({
        where: {
          name: { contains: q },
        },
        include: {
          chapter: {
            include: { subject: true },
          },
        },
        take: 5,
      }),
    ]);

    const total = books.length + questions.length + shorts.length + topics.length;

    return NextResponse.json({
      success: true,
      query: q,
      total,
      results: {
        books: books.map((b) => ({
          id: b.id,
          type: 'BOOK',
          title: b.title,
          code: b.code,
          details: `${b.curriculum} • Grade ${b.grade} • ${b.subject?.name || ''}`,
          url: `/books/${b.id}`,
        })),
        questions: questions.map((qn) => ({
          id: qn.id,
          type: 'QUESTION',
          title: qn.statementText.slice(0, 80) + '...',
          code: qn.code,
          details: `${qn.type} • ${qn.difficulty} • ${qn.positiveMarks} Marks`,
          url: `/questions/${qn.id}`,
        })),
        shorts: shorts.map((s) => ({
          id: s.id,
          type: 'YOSHORT',
          title: s.title,
          code: s.code,
          details: `${s.durationSeconds}s • ${s.curriculum || 'CBSE'} Grade ${s.grade || 10}`,
          url: `/shorts/${s.id}`,
        })),
        topics: topics.map((t) => ({
          id: t.id,
          type: 'TOPIC',
          title: t.name,
          details: `${t.chapter?.subject?.name || ''} → ${t.chapter?.name || ''}`,
          url: `/taxonomy/topics/${t.id}`,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error in global search:', error);
    return NextResponse.json({ error: error.message || 'Global search failed' }, { status: 500 });
  }
}
