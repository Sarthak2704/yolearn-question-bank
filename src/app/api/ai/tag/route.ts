import { NextResponse } from 'next/server';
import { autoTagQuestion } from '@/lib/ai-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { statementText } = body;

    if (!statementText) {
      return NextResponse.json({ error: 'statementText is required' }, { status: 400 });
    }

    const tags = await autoTagQuestion(statementText);
    return NextResponse.json(tags);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
