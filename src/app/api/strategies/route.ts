import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const strategies = await prisma.strategy.findMany({
      orderBy: { rank: 'asc' },
    });

    return NextResponse.json(strategies);
  } catch (error: any) {
    console.error('[API /api/strategies GET error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch strategies' }, { status: 500 });
  }
}
