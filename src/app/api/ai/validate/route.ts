import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { statement, options, answer, solution } = body;

    const issues: string[] = [];
    let isValid = true;

    if (!statement || statement.trim().length < 10) {
      issues.push('Question statement is too short or empty.');
      isValid = false;
    }

    if (options && Array.isArray(options)) {
      const correctOpts = options.filter((o) => o.isCorrect);
      if (correctOpts.length === 0) {
        issues.push('No correct option marked.');
        isValid = false;
      }
    }

    const latexCheck = (statement || '').match(/\$[^\$]*$/);
    if (latexCheck) {
      issues.push('Unbalanced LaTeX dollar signs detected in statement.');
      isValid = false;
    }

    return NextResponse.json({
      isValid,
      validationScore: isValid ? 0.98 : 0.65,
      issues,
      recommendation: isValid ? 'Approved for publishing' : 'Manual correction required',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
