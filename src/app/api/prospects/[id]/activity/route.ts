import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { event, timeAgo, type } = body;

    const activity = await prisma.prospectActivity.create({
      data: {
        prospectId: id,
        event,
        timeAgo: timeAgo || 'Hari ini',
        type: type || 'NOTE',
      },
    });

    // Update lastActivity on prospect
    await prisma.prospect.update({
      where: { id },
      data: {
        lastActivity: event,
        daysInactive: 0,
      },
    });

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error('[API /api/prospects/[id]/activity POST error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to add activity' }, { status: 500 });
  }
}
