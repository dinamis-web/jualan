import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prospect = await prisma.prospect.findUnique({
      where: { id },
      include: {
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 });
    }

    return NextResponse.json(prospect);
  } catch (error: any) {
    console.error('[API /api/prospects/[id] GET error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch prospect' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await req.json();

    const cleanUpdates: any = {};
    const allowedFields = [
      'name',
      'potential',
      'status',
      'priority',
      'lastActivity',
      'daysInactive',
      'nextRecommendation',
      'phone',
      'notes',
      'isMoneyLeak',
      'leakReason',
      'resolved',
      'closed',
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        if (field === 'potential' || field === 'daysInactive') {
          cleanUpdates[field] = Number(updates[field]);
        } else {
          cleanUpdates[field] = updates[field];
        }
      }
    }

    const updated = await prisma.prospect.update({
      where: { id },
      data: cleanUpdates,
      include: {
        timeline: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[API /api/prospects/[id] PUT error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update prospect' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.prospect.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[API /api/prospects/[id] DELETE error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to delete prospect' }, { status: 500 });
  }
}
