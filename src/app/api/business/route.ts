import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let business = await prisma.business.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!business) {
      business = await prisma.business.create({
        data: {
          productOrService: 'Jasa cuci AC',
          avgSalePrice: 100000,
          buyerPersona: ['Rumah tangga', 'Perusahaan'],
          salesChannels: ['WhatsApp', 'Customer lama', 'Referral'],
        },
      });
    }

    return NextResponse.json(business);
  } catch (error: any) {
    console.error('[API /api/business GET error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to fetch business profile' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { productOrService, avgSalePrice, buyerPersona, salesChannels } = body;

    let business = await prisma.business.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (business) {
      business = await prisma.business.update({
        where: { id: business.id },
        data: {
          ...(productOrService !== undefined && { productOrService }),
          ...(avgSalePrice !== undefined && { avgSalePrice: Number(avgSalePrice) }),
          ...(buyerPersona !== undefined && { buyerPersona }),
          ...(salesChannels !== undefined && { salesChannels }),
        },
      });
    } else {
      business = await prisma.business.create({
        data: {
          productOrService: productOrService || 'Jasa cuci AC',
          avgSalePrice: Number(avgSalePrice) || 100000,
          buyerPersona: buyerPersona || ['Rumah tangga'],
          salesChannels: salesChannels || ['WhatsApp'],
        },
      });
    }

    return NextResponse.json(business);
  } catch (error: any) {
    console.error('[API /api/business PUT error]:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update business profile' }, { status: 500 });
  }
}
