import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const curriculum = searchParams.get('curriculum');
    const grade = searchParams.get('grade');
    const subjectId = searchParams.get('subjectId');
    const status = searchParams.get('status');

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { code: { contains: search } },
        { transcript: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (curriculum) where.curriculum = curriculum;
    if (grade) where.grade = parseInt(grade, 10);
    if (subjectId) where.subjectId = subjectId;
    if (status) where.verificationStatus = status;

    const shorts = await prisma.yoShort.findMany({
      where,
      include: {
        subject: true,
        centralTopic: {
          include: {
            chapter: true,
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
          take: 3,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      shorts,
      total: shorts.length,
    });
  } catch (error: any) {
    console.error('Error fetching YoShorts:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch YoShorts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      transcript,
      curriculum = 'CBSE',
      grade = 10,
      subjectId,
      centralTopicId,
      bookId,
      chapterId,
      language = 'English',
      source = 'YoLearn Studio',
    } = body;

    if (!title || !transcript) {
      return NextResponse.json(
        { error: 'title and transcript are required to generate a YoShort video' },
        { status: 400 }
      );
    }

    // Generate unique code e.g. YS-GEN-001
    const count = await prisma.yoShort.count();
    const shortCode = `YS-${(curriculum || 'CBSE').slice(0, 3).toUpperCase()}-${String(count + 1).padStart(3, '0')}`;

    // Estimate duration based on word count (~140 words per minute)
    const wordCount = transcript.trim().split(/\s+/).length;
    const estimatedDuration = Math.max(30, Math.min(180, Math.round((wordCount / 140) * 60)));

    // Video generation mock asset pools
    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    ];
    const sampleThumbnails = [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
      'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
      'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400',
    ];
    const pickedVideo = sampleVideos[count % sampleVideos.length];
    const pickedThumb = sampleThumbnails[count % sampleThumbnails.length];

    const short = await prisma.yoShort.create({
      data: {
        code: shortCode,
        title,
        description: description || `Educational micro-learning short on ${title}.`,
        transcript,
        videoUrl: pickedVideo,
        thumbnailUrl: pickedThumb,
        durationSeconds: estimatedDuration,
        language,
        curriculum,
        grade: parseInt(String(grade), 10) || 10,
        subjectId: subjectId || null,
        centralTopicId: centralTopicId || null,
        generationStatus: 'GENERATED',
        generationStage: 'READY',
        verificationStatus: 'PENDING_REVIEW',
        publishingStatus: 'UNPUBLISHED',
        source,
      },
    });

    // If bookId is provided, create the Book mapping!
    if (bookId) {
      await prisma.yoShortBookMapping.create({
        data: {
          yoShortId: short.id,
          bookId,
          chapterId: chapterId || null,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'YOSHORT_GENERATED',
        entityType: 'YOSHORT',
        entityId: short.id,
        detailsJson: JSON.stringify({ code: short.code, title: short.title, wordCount, estimatedDuration }),
      },
    });

    return NextResponse.json({
      success: true,
      short,
      message: 'YoShort generated from transcript and sent for review',
    });
  } catch (error: any) {
    console.error('Error creating YoShort:', error);
    return NextResponse.json({ error: error.message || 'Failed to create YoShort' }, { status: 500 });
  }
}
