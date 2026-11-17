import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeHash, normalizeText, checkQuestionDuplicates } from '@/lib/dedup-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const skip = (page - 1) * limit;

    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const cognitiveLevel = searchParams.get('cognitiveLevel');
    const verificationStatus = searchParams.get('verificationStatus');
    const publishingStatus = searchParams.get('publishingStatus');
    const subjectId = searchParams.get('subjectId');
    const examId = searchParams.get('examId');
    const chapterId = searchParams.get('chapterId');
    const classId = searchParams.get('classId');
    const sourceType = searchParams.get('sourceType');
    const tagId = searchParams.get('tagId');

    const where: any = {};

    if (search) {
      where.OR = [
        { code: { contains: search } },
        { statementText: { contains: search } },
        { source: { sourceName: { contains: search } } },
        { source: { examName: { contains: search } } },
      ];
    }

    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;
    if (cognitiveLevel) where.cognitiveLevel = cognitiveLevel;
    if (verificationStatus) where.verificationStatus = verificationStatus;
    if (publishingStatus) where.publishingStatus = publishingStatus;

    if (sourceType) {
      where.source = { sourceType };
    }

    if (tagId) {
      where.tagMappings = { some: { tagId } };
    }

    // Taxonomy filtering
    if (subjectId || examId || chapterId || classId) {
      where.taxonomyMappings = {
        some: {
          ...(subjectId ? { subjectId } : {}),
          ...(examId ? { examId } : {}),
          ...(chapterId ? { chapterId } : {}),
          ...(classId ? { classId } : {}),
        },
      };
    }

    const [total, questions] = await Promise.all([
      prisma.question.count({ where }),
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          source: true,
          parentGroup: {
            select: { id: true, title: true, groupType: true },
          },
          taxonomyMappings: {
            include: {
              subject: true,
              chapter: true,
              topic: true,
              exam: true,
              board: true,
              class: true,
              educationSegment: true,
            },
          },
          tagMappings: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: { versions: true, reviews: true },
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: questions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      subtype,
      difficulty = 'MEDIUM',
      cognitiveLevel = 'UNDERSTAND',
      questionNature = 'CONCEPTUAL',
      questionStyle = 'DIRECT',
      positiveMarks = 4.0,
      negativeMarks = -1.0,
      estimatedTimeSeconds = 120,
      language = 'English',
      verificationStatus = 'PENDING_REVIEW',
      contentJson,
      optionsJson,
      answerJson,
      solutionJson,
      mediaJson,
      statementText,
      sourceData,
      taxonomyData,
      tagIds = [],
      parentGroupId,
      createdByName = 'Admin User',
    } = body;

    const rawStatement =
      statementText ||
      (contentJson ? JSON.parse(contentJson).statement : '') ||
      '';

    const cleanStatement = rawStatement.replace(/<[^>]+>/g, '');
    const normText = normalizeText(cleanStatement);
    const contentHash = computeHash(cleanStatement);

    // Auto-generate unique readable Question Code e.g. QB-PHY-000123
    const subjectPrefix = taxonomyData?.subjectCode || 'GEN';
    const count = await prisma.question.count();
    const code = `QB-${subjectPrefix.toUpperCase()}-${String(count + 1).padStart(6, '0')}`;

    // 1. Create or reuse Question Source
    let sourceId = undefined;
    if (sourceData && sourceData.sourceName) {
      const src = await prisma.questionSource.create({
        data: {
          sourceType: sourceData.sourceType || 'MANUAL',
          sourceName: sourceData.sourceName,
          bookName: sourceData.bookName,
          author: sourceData.author,
          publisher: sourceData.publisher,
          examName: sourceData.examName,
          examYear: sourceData.examYear ? parseInt(sourceData.examYear) : undefined,
          examDate: sourceData.examDate,
          shift: sourceData.shift,
          paperCode: sourceData.paperCode,
          questionNumber: sourceData.questionNumber,
          pageNumber: sourceData.pageNumber,
          sourceUrl: sourceData.sourceUrl,
          copyrightInfo: sourceData.copyrightInfo,
        },
      });
      sourceId = src.id;
    }

    // 2. Create Question
    const question = await prisma.question.create({
      data: {
        code,
        type: type || 'MCQ',
        subtype,
        difficulty,
        cognitiveLevel,
        questionNature,
        questionStyle,
        positiveMarks: parseFloat(positiveMarks) || 4.0,
        negativeMarks: parseFloat(negativeMarks) || -1.0,
        estimatedTimeSeconds: parseInt(estimatedTimeSeconds) || 120,
        language,
        verificationStatus,
        publishingStatus: 'UNPUBLISHED',
        contentJson: typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson || {}),
        statementText: cleanStatement,
        optionsJson: typeof optionsJson === 'string' ? optionsJson : JSON.stringify(optionsJson || []),
        answerJson: typeof answerJson === 'string' ? answerJson : JSON.stringify(answerJson || {}),
        solutionJson: typeof solutionJson === 'string' ? solutionJson : JSON.stringify(solutionJson || {}),
        mediaJson: typeof mediaJson === 'string' ? mediaJson : JSON.stringify(mediaJson || []),
        contentHash,
        normalisedText: normText,
        sourceId,
        parentGroupId: parentGroupId || undefined,
      },
    });

    // 3. Create Taxonomy Mapping if provided
    if (taxonomyData) {
      await prisma.questionTaxonomyMapping.create({
        data: {
          questionId: question.id,
          educationSegmentId: taxonomyData.educationSegmentId || undefined,
          boardId: taxonomyData.boardId || undefined,
          examId: taxonomyData.examId || undefined,
          classId: taxonomyData.classId || undefined,
          subjectId: taxonomyData.subjectId || undefined,
          chapterId: taxonomyData.chapterId || undefined,
          topicId: taxonomyData.topicId || undefined,
          subtopicId: taxonomyData.subtopicId || undefined,
          conceptId: taxonomyData.conceptId || undefined,
          isPrimary: true,
        },
      });
    }

    // 4. Create Tag Mappings
    if (tagIds.length > 0) {
      for (const tId of tagIds) {
        await prisma.questionTagMapping.create({
          data: {
            questionId: question.id,
            tagId: tId,
          },
        });
      }
    }

    // 5. Create Initial Version Snapshot (Version 1)
    await prisma.questionVersion.create({
      data: {
        questionId: question.id,
        versionNumber: 1,
        contentSnapshotJson: JSON.stringify({
          code: question.code,
          statementText: cleanStatement,
          contentJson: question.contentJson,
          optionsJson: question.optionsJson,
          answerJson: question.answerJson,
          solutionJson: question.solutionJson,
          type: question.type,
          difficulty: question.difficulty,
        }),
        changedBy: createdByName,
        changeReason: 'Initial question creation',
      },
    });

    // 6. Asynchronously run duplicate detection & record any matches
    const duplicates = await checkQuestionDuplicates(cleanStatement, question.id);
    for (const d of duplicates) {
      await prisma.questionDuplicate.create({
        data: {
          originalQuestionId: d.existingQuestionId,
          duplicateQuestionId: question.id,
          similarityScore: d.similarityScore,
          matchType: d.matchType,
          status: 'PENDING',
          resolutionNotes: `Detected ${d.matchType} similarity (${Math.round(d.similarityScore * 100)}%) with ${d.existingQuestionCode}`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      question,
      duplicatesFound: duplicates.length,
    });
  } catch (error: any) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
