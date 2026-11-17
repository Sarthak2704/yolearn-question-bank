import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'all';

    const [segments, boards, exams, classes, subjects, chapters, topics, tags] = await Promise.all([
      prisma.educationSegment.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.board.findMany({ orderBy: { name: 'asc' } }),
      prisma.exam.findMany({ orderBy: { name: 'asc' } }),
      prisma.academicClass.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.subject.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { chapters: true, taxonomyMappings: true } },
        },
      }),
      prisma.chapter.findMany({
        orderBy: { chapterNumber: 'asc' },
        include: {
          subject: true,
          class: true,
          topics: {
            include: {
              subtopics: {
                include: { concepts: true },
              },
            },
          },
          _count: { select: { taxonomyMappings: true } },
        },
      }),
      prisma.topic.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          subtopics: {
            include: { concepts: true },
          },
        },
      }),
      prisma.questionTag.findMany({ orderBy: { name: 'asc' } }),
    ]);

    return NextResponse.json({
      segments,
      boards,
      exams,
      classes,
      subjects,
      chapters,
      topics,
      tags,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { level, data } = body;

    let created: any;

    switch (level) {
      case 'subject':
        created = await prisma.subject.create({
          data: {
            name: data.name,
            code: data.code.toUpperCase(),
            icon: data.icon || 'BookOpen',
          },
        });
        break;

      case 'chapter':
        created = await prisma.chapter.create({
          data: {
            name: data.name,
            subjectId: data.subjectId,
            classId: data.classId || undefined,
            chapterNumber: parseInt(data.chapterNumber) || 1,
          },
        });
        break;

      case 'topic':
        created = await prisma.topic.create({
          data: {
            name: data.name,
            chapterId: data.chapterId,
            sortOrder: parseInt(data.sortOrder) || 1,
          },
        });
        break;

      case 'subtopic':
        created = await prisma.subtopic.create({
          data: {
            name: data.name,
            topicId: data.topicId,
            sortOrder: parseInt(data.sortOrder) || 1,
          },
        });
        break;

      case 'concept':
        created = await prisma.concept.create({
          data: {
            name: data.name,
            subtopicId: data.subtopicId,
            code: data.code,
          },
        });
        break;

      case 'board':
        created = await prisma.board.create({
          data: {
            name: data.name,
            code: data.code.toUpperCase(),
            educationSegmentId: data.educationSegmentId,
          },
        });
        break;

      case 'exam':
        created = await prisma.exam.create({
          data: {
            name: data.name,
            code: data.code.toUpperCase(),
            educationSegmentId: data.educationSegmentId,
          },
        });
        break;

      default:
        return NextResponse.json({ error: `Unsupported taxonomy level: ${level}` }, { status: 400 });
    }

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level');
    const id = searchParams.get('id');

    if (!id || !level) {
      return NextResponse.json({ error: 'Missing level or id' }, { status: 400 });
    }

    switch (level) {
      case 'subject':
        await prisma.subject.delete({ where: { id } });
        break;
      case 'chapter':
        await prisma.chapter.delete({ where: { id } });
        break;
      case 'topic':
        await prisma.topic.delete({ where: { id } });
        break;
      case 'subtopic':
        await prisma.subtopic.delete({ where: { id } });
        break;
      case 'concept':
        await prisma.concept.delete({ where: { id } });
        break;
      case 'exam':
        await prisma.exam.delete({ where: { id } });
        break;
      case 'board':
        await prisma.board.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ error: `Unsupported level: ${level}` }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
