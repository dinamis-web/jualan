import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    await prisma.dailyAction.updateMany({
      data: {
        completedCount: 0,
        isCompleted: false,
      },
    });

    const resetActions = await prisma.dailyAction.findMany({
      orderBy: { code: 'asc' },
    });

    return NextResponse.json(resetActions);
  } catch (error: any) {
    console.error('[API /api/actions/reset POST error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to reset actions' }, { status: 500 });
  }
}
