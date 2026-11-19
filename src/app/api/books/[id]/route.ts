import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const book = await prisma.book.findFirst({
      where: {
        OR: [{ id }, { code: id }],
      },
      include: {
        subject: true,
        chapters: {
          include: {
            topics: {
              include: {
                centralTopic: {
                  include: {
                    chapter: true,
                  },
                },
              },
              orderBy: { sortOrder: 'asc' },
            },
            pages: {
              orderBy: { pageNumber: 'asc' },
            },
          },
          orderBy: { chapterNumber: 'asc' },
        },
        questionMappings: {
          include: {
            question: true,
          },
        },
        shortsMappings: {
          include: {
            yoShort: true,
          },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, book });
  } catch (error: any) {
    console.error('Error fetching book detail:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch book detail' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();

    const updated = await prisma.book.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, book: updated });
  } catch (error: any) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: error.message || 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.book.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Book deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete book' }, { status: 500 });
  }
}
