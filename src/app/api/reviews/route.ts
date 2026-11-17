import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING_REVIEW';

    const questions = await prisma.question.findMany({
      where: status !== 'ALL' ? { verificationStatus: status } : undefined,
      include: {
        source: true,
        taxonomyMappings: {
          include: {
            subject: true,
            chapter: true,
            exam: true,
          },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
