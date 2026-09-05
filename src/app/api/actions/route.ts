import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const actions = await prisma.dailyAction.findMany({
      orderBy: { code: 'asc' },
    });

    return NextResponse.json(actions);
  } catch (error: any) {
    console.error('[API /api/actions GET error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch actions' }, { status: 500 });
  }
}
