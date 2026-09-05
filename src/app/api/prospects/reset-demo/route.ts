import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_PROSPECTS, INITIAL_ACTIONS, INITIAL_CLOSINGS, INITIAL_TARGET, INITIAL_BUSINESS } from '@/data/initialData';

export async function POST() {
  try {
    // 1. Reset Prospects
    await prisma.prospectActivity.deleteMany({});
    await prisma.closing.deleteMany({});
    await prisma.prospect.deleteMany({});

    for (const p of INITIAL_PROSPECTS) {
      await prisma.prospect.create({
        data: {
          name: p.name,
          potential: p.potential,
          status: p.status,
          priority: p.priority,
          lastActivity: p.lastActivity,
          daysInactive: p.daysInactive,
          nextRecommendation: p.nextRecommendation,
          phone: p.phone,
          notes: p.notes,
          isMoneyLeak: Boolean(p.isMoneyLeak),
          leakReason: p.leakReason,
          resolved: false,
          closed: false,
          timeline: {
            create: p.timeline.map((t) => ({
              timeAgo: t.timeAgo,
              event: t.event,
              type: 'NOTE',
            })),
          },
        },
      });
    }

    // 2. Reset Actions
    await prisma.dailyAction.deleteMany({});
    for (const act of INITIAL_ACTIONS) {
      await prisma.dailyAction.create({
        data: {
          code: act.code,
          title: act.title,
          label: act.label,
          completedCount: act.completedCount,
          targetCount: act.targetCount,
          isCompleted: act.isCompleted,
          detailTitle: act.detailTitle,
          detailDesc: act.detailDesc,
          suggestedTemplate: act.suggestedTemplate,
          defaultCustomerName: act.defaultCustomerName,
          date: 'Hari ini',
        },
      });
    }

    // 3. Reset Closings
    for (const cl of INITIAL_CLOSINGS) {
      await prisma.closing.create({
        data: {
          customerName: cl.customerName,
          saleAmount: cl.saleAmount,
          profitCommission: cl.profitCommission,
          source: cl.source,
          date: cl.date,
        },
      });
    }

    // 4. Reset Target
    await prisma.salesTarget.deleteMany({});
    await prisma.salesTarget.create({
      data: {
        monthName: INITIAL_TARGET.monthName,
        targetAmount: INITIAL_TARGET.targetAmount,
        achievedAmount: INITIAL_TARGET.achievedAmount,
        avgCommission: INITIAL_TARGET.avgCommission,
      },
    });

    // 5. Reset Business Profile
    await prisma.business.deleteMany({});
    await prisma.business.create({
      data: {
        productOrService: INITIAL_BUSINESS.productOrService,
        avgSalePrice: INITIAL_BUSINESS.avgSalePrice,
        buyerPersona: INITIAL_BUSINESS.buyerPersona,
        salesChannels: INITIAL_BUSINESS.salesChannels,
      },
    });

    return NextResponse.json({ success: true, message: 'Reset to demo state successful' });
  } catch (error: any) {
    console.error('[API /api/prospects/reset-demo POST error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to reset demo data' }, { status: 500 });
  }
}
