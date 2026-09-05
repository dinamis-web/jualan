import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const closings = await prisma.closing.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(closings);
  } catch (error: any) {
    console.error('[API /api/closings GET error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch closings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, saleAmount, profitCommission, source, date, prospectId } = body;

    const saleVal = Number(saleAmount) || 0;
    const profitVal = Number(profitCommission) || 0;
    const addedToTarget = profitVal > 0 ? profitVal : saleVal;

    // 1. Create Closing
    const newClosing = await prisma.closing.create({
      data: {
        customerName,
        saleAmount: saleVal,
        profitCommission: profitVal,
        source: source || 'Customer lama',
        date: date || 'Hari ini',
        prospectId: prospectId || null,
      },
    });

    // 2. Increment Target Achieved
    const target = await prisma.salesTarget.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (target) {
      await prisma.salesTarget.update({
        where: { id: target.id },
        data: {
          achievedAmount: target.achievedAmount + addedToTarget,
        },
      });
    }

    // 3. Mark Prospect Closed if linked
    if (prospectId) {
      try {
        await prisma.prospect.update({
          where: { id: prospectId },
          data: {
            closed: true,
            lastActivity: 'Closing berhasil',
            daysInactive: 0,
          },
        });

        await prisma.prospectActivity.create({
          data: {
            prospectId,
            timeAgo: 'Hari ini',
            event: `Deal Closing: Rp${saleVal.toLocaleString('id-ID')}`,
            type: 'STATUS_CHANGE',
          },
        });
      } catch (prospectErr) {
        console.warn('[API /api/closings] Linked prospect update failed:', prospectErr);
      }
    }

    return NextResponse.json(newClosing);
  } catch (error: any) {
    console.error('[API /api/closings POST error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to record closing' }, { status: 500 });
  }
}
