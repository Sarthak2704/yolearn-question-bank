import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedEmail = searchParams.get('email') || 'admin@yolearn.ai';

    let user = await prisma.user.findUnique({
      where: { email: requestedEmail },
    });

    if (!user) {
      user = await prisma.user.findFirst();
    }

    const allUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      currentUser: user,
      availableUsers: allUsers,
      roles: ['SUPER_ADMIN', 'QB_MANAGER', 'CONTENT_MANAGER', 'SME', 'REVIEWER', 'VIEWER'],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, name } = body;

    const updatedUser = await prisma.user.upsert({
      where: { email },
      update: { role, name },
      create: { email, role, name },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
