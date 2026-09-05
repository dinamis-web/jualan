import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const updated = await prisma.prospect.update({
      where: { id },
      data: {
        resolved: true,
        isMoneyLeak: false,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[API /api/prospects/[id]/resolve-leak POST error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to resolve leak' }, { status: 500 });
  }
}
