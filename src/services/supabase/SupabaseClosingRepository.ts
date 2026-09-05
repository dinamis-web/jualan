import { IClosingRepository } from '../contracts/IClosingRepository';
import { Closing } from '../../types/models';
import { LocalClosingRepository } from '../local/LocalClosingRepository';

export class SupabaseClosingRepository implements IClosingRepository {
  private fallback = new LocalClosingRepository();

  async getAll(userId?: string): Promise<Closing[]> {
    try {
      const res = await fetch('/api/closings');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.userId,
            customerName: d.customerName,
            saleAmount: Number(d.saleAmount || 0),
            profitCommission: Number(d.profitCommission || 0),
            source: d.source || 'Customer lama',
            date: d.date || 'Hari ini',
            prospectId: d.prospectId,
            createdAt: d.createdAt,
          }));
        }
      }
    } catch (err) {
      console.warn('[SupabaseClosingRepository] getAll error:', err);
    }
    return this.fallback.getAll(userId);
  }

  async create(closing: Omit<Closing, 'id'>): Promise<Closing> {
    try {
      const res = await fetch('/api/closings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(closing),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SupabaseClosingRepository] create error:', err);
    }
    return this.fallback.create(closing);
  }
}
