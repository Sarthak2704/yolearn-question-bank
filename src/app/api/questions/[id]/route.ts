import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { computeHash, normalizeText } from '@/lib/dedup-service';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const question = await prisma.question.findUnique({
      where: { id: params.id },
      include: {
        source: true,
        parentGroup: true,
        taxonomyMappings: {
          include: {
            educationSegment: true,
            board: true,
            exam: true,
            class: true,
            subject: true,
            chapter: true,
            topic: true,
            subtopic: true,
            concept: true,
          },
        },
        tagMappings: {
          include: { tag: true },
        },
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
        bookMappings: {
          include: {
            book: true,
            chapter: true,
            bookTopic: true,
          },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Also look up any duplicate records involving this question
    const duplicates = await prisma.questionDuplicate.findMany({
      where: {
        OR: [
          { originalQuestionId: question.id },
          { duplicateQuestionId: question.id },
        ],
      },
    });

    return NextResponse.json({ question, duplicates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const existing = await prisma.question.findUnique({
      where: { id: params.id },
      include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const {
      type,
      subtype,
      difficulty,
      cognitiveLevel,
      questionNature,
      questionStyle,
      positiveMarks,
      negativeMarks,
      estimatedTimeSeconds,
      language,
      verificationStatus,
      publishingStatus,
      contentJson,
      optionsJson,
      answerJson,
      solutionJson,
      mediaJson,
      statementText,
      changeReason = 'Updated question content and parameters',
      changedBy = 'Editor User',
    } = body;

    const rawStatement =
      statementText ||
      (contentJson ? JSON.parse(contentJson).statement : '') ||
      existing.statementText;
    const cleanStatement = rawStatement.replace(/<[^>]+>/g, '');
    const normText = normalizeText(cleanStatement);
    const contentHash = computeHash(cleanStatement);

    const latestVersionNum = existing.versions[0]?.versionNumber || 1;
    const nextVersionNum = latestVersionNum + 1;

    // Update question
    const updatedQuestion = await prisma.question.update({
      where: { id: params.id },
      data: {
        type: type !== undefined ? type : existing.type,
        subtype: subtype !== undefined ? subtype : existing.subtype,
        difficulty: difficulty !== undefined ? difficulty : existing.difficulty,
        cognitiveLevel: cognitiveLevel !== undefined ? cognitiveLevel : existing.cognitiveLevel,
        questionNature: questionNature !== undefined ? questionNature : existing.questionNature,
        questionStyle: questionStyle !== undefined ? questionStyle : existing.questionStyle,
        positiveMarks: positiveMarks !== undefined ? parseFloat(positiveMarks) : existing.positiveMarks,
        negativeMarks: negativeMarks !== undefined ? parseFloat(negativeMarks) : existing.negativeMarks,
        estimatedTimeSeconds:
          estimatedTimeSeconds !== undefined ? parseInt(estimatedTimeSeconds) : existing.estimatedTimeSeconds,
        language: language !== undefined ? language : existing.language,
        verificationStatus: verificationStatus !== undefined ? verificationStatus : existing.verificationStatus,
        publishingStatus: publishingStatus !== undefined ? publishingStatus : existing.publishingStatus,
        contentJson: contentJson !== undefined ? (typeof contentJson === 'string' ? contentJson : JSON.stringify(contentJson)) : existing.contentJson,
        statementText: cleanStatement,
        optionsJson: optionsJson !== undefined ? (typeof optionsJson === 'string' ? optionsJson : JSON.stringify(optionsJson)) : existing.optionsJson,
        answerJson: answerJson !== undefined ? (typeof answerJson === 'string' ? answerJson : JSON.stringify(answerJson)) : existing.answerJson,
        solutionJson: solutionJson !== undefined ? (typeof solutionJson === 'string' ? solutionJson : JSON.stringify(solutionJson)) : existing.solutionJson,
        mediaJson: mediaJson !== undefined ? (typeof mediaJson === 'string' ? mediaJson : JSON.stringify(mediaJson)) : existing.mediaJson,
        contentHash,
        normalisedText: normText,
      },
    });

    // Create new version snapshot (Module 10 Question Versioning)
    await prisma.questionVersion.create({
      data: {
        questionId: existing.id,
        versionNumber: nextVersionNum,
        contentSnapshotJson: JSON.stringify({
          code: updatedQuestion.code,
          statementText: cleanStatement,
          contentJson: updatedQuestion.contentJson,
          optionsJson: updatedQuestion.optionsJson,
          answerJson: updatedQuestion.answerJson,
          solutionJson: updatedQuestion.solutionJson,
          type: updatedQuestion.type,
          difficulty: updatedQuestion.difficulty,
          verificationStatus: updatedQuestion.verificationStatus,
        }),
        changedBy,
        changeReason,
      },
    });

    return NextResponse.json({ success: true, question: updatedQuestion, versionNumber: nextVersionNum });
  } catch (error: any) {
    console.error('Error updating question:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updated = await prisma.question.update({
      where: { id: params.id },
      data: { verificationStatus: 'ARCHIVED', publishingStatus: 'ARCHIVED' },
    });
    return NextResponse.json({ success: true, archived: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
