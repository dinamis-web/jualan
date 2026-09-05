import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { completedCount, isCompleted, increment } = body;

    const action = await prisma.dailyAction.findUnique({
      where: { id },
    });

    if (!action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    let nextCount = action.completedCount;
    let nextCompleted = action.isCompleted;

    if (increment) {
      nextCount = Math.min(action.completedCount + 1, action.targetCount);
      nextCompleted = nextCount >= action.targetCount;
    } else {
      if (completedCount !== undefined) {
        nextCount = Math.min(Math.max(Number(completedCount), 0), action.targetCount);
        nextCompleted = nextCount >= action.targetCount;
      }
      if (isCompleted !== undefined) {
        nextCompleted = Boolean(isCompleted);
        nextCount = nextCompleted ? action.targetCount : Math.max(action.completedCount - 1, 0);
      }
    }

    const updated = await prisma.dailyAction.update({
      where: { id },
      data: {
        completedCount: nextCount,
        isCompleted: nextCompleted,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[API /api/actions/[id] PUT error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update action' }, { status: 500 });
  }
}
