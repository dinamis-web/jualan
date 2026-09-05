import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let target = await prisma.salesTarget.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!target) {
      target = await prisma.salesTarget.create({
        data: {
          monthName: 'September',
          targetAmount: 5000000,
          achievedAmount: 1500000,
          avgCommission: 100000,
        },
      });
    }

    return NextResponse.json(target);
  } catch (error: any) {
    console.error('[API /api/targets GET error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch targets' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { monthName, targetAmount, achievedAmount, avgCommission } = body;

    let target = await prisma.salesTarget.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (target) {
      target = await prisma.salesTarget.update({
        where: { id: target.id },
        data: {
          ...(monthName !== undefined && { monthName }),
          ...(targetAmount !== undefined && { targetAmount: Number(targetAmount) }),
          ...(achievedAmount !== undefined && { achievedAmount: Number(achievedAmount) }),
          ...(avgCommission !== undefined && { avgCommission: Number(avgCommission) }),
        },
      });
    } else {
      target = await prisma.salesTarget.create({
        data: {
          monthName: monthName || 'September',
          targetAmount: Number(targetAmount) || 5000000,
          achievedAmount: Number(achievedAmount) || 0,
          avgCommission: Number(avgCommission) || 100000,
        },
      });
    }

    return NextResponse.json(target);
  } catch (error: any) {
    console.error('[API /api/targets PUT error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update target' }, { status: 500 });
  }
}
