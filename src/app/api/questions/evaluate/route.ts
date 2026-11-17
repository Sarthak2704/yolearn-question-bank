import { NextResponse } from 'next/server';
import { evaluateStudentResponse } from '@/lib/evaluation-engine';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { questionType, studentResponse, correctAnswer, positiveMarks = 4.0, negativeMarks = -1.0, partialMarkingConfig } = body;

    const evaluation = evaluateStudentResponse({
      questionType,
      studentResponse,
      correctAnswer,
      positiveMarks: parseFloat(positiveMarks),
      negativeMarks: parseFloat(negativeMarks),
      partialMarkingConfig,
    });

    return NextResponse.json(evaluation);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
