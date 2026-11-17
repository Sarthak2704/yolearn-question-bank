import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const groups = await prisma.questionGroup.findMany({
      include: {
        questions: {
          select: {
            id: true,
            code: true,
            type: true,
            difficulty: true,
            statementText: true,
          },
        },
        _count: { select: { questions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ groups });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, groupType = 'PASSAGE', instruction, sharedPassage, sharedMediaJson } = body;

    const group = await prisma.questionGroup.create({
      data: {
        title,
        groupType,
        instruction,
        sharedPassage,
        sharedMediaJson: typeof sharedMediaJson === 'string' ? sharedMediaJson : JSON.stringify(sharedMediaJson || []),
      },
    });

    return NextResponse.json({ success: true, group });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
