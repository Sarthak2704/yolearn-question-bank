import { NextResponse } from 'next/server';
import { generateQuestionWithAi } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject = 'Physics', chapter = 'Rotational Motion', topic = 'Moment of Inertia', type = 'MCQ', difficulty = 'MEDIUM', exam = 'JEE Advanced' } = body;

    const result = await generateQuestionWithAi({
      subject,
      chapter,
      topic,
      type,
      difficulty,
      exam,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
