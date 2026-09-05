import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const priority = searchParams.get('priority');
    const status = searchParams.get('status');
    const isMoneyLeak = searchParams.get('isMoneyLeak');
    const searchQuery = searchParams.get('searchQuery');

    const where: any = {};
    if (priority) where.priority = priority;
    if (status) where.status = status;
    if (isMoneyLeak !== null && isMoneyLeak !== undefined) {
      where.isMoneyLeak = isMoneyLeak === 'true';
    }
    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { status: { contains: searchQuery, mode: 'insensitive' } },
        { notes: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    const prospects = await prisma.prospect.findMany({
      where,
      include: {
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(prospects);
  } catch (error: any) {
    console.error('[API /api/prospects GET error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch prospects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      potential,
      status,
      priority,
      lastActivity,
      daysInactive,
      nextRecommendation,
      phone,
      notes,
      timeline,
      isMoneyLeak,
      leakReason,
    } = body;

    const initialTimeline = timeline && Array.isArray(timeline) && timeline.length > 0
      ? timeline.map((t: any) => ({
          timeAgo: t.timeAgo || 'Baru saja',
          event: t.event || 'Ditambahkan ke Radar Prospek',
          type: t.type || 'NOTE',
        }))
      : [
          {
            timeAgo: 'Baru saja',
            event: 'Ditambahkan ke Radar Prospek',
            type: 'NOTE',
          },
        ];

    const newProspect = await prisma.prospect.create({
      data: {
        name,
        potential: Number(potential) || 0,
        status: status || 'Baru dikenal',
        priority: priority || 'WARM',
        lastActivity: lastActivity || `${status || 'Baru dikenal'} (Hari ini)`,
        daysInactive: Number(daysInactive) || 0,
        nextRecommendation: nextRecommendation || 'Hubungi sekarang',
        phone,
        notes,
        isMoneyLeak: Boolean(isMoneyLeak),
        leakReason,
        resolved: false,
        closed: false,
        timeline: {
          create: initialTimeline,
        },
      },
      include: {
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(newProspect);
  } catch (error: any) {
    console.error('[API /api/prospects POST error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to create prospect' }, { status: 500 });
  }
}
