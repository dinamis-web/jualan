import { IBusinessRepository } from '../contracts/IBusinessRepository';
import { Business } from '../../types/models';
import { LocalBusinessRepository } from '../local/LocalBusinessRepository';

export class SupabaseBusinessRepository implements IBusinessRepository {
  private fallback = new LocalBusinessRepository();

  async getProfile(userId?: string): Promise<Business | null> {
    try {
      const res = await fetch('/api/business');
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return {
            id: data.id,
            userId: data.userId,
            productOrService: data.productOrService || 'Jasa cuci AC',
            avgSalePrice: Number(data.avgSalePrice || 100000),
            buyerPersona: data.buyerPersona || ['Rumah tangga', 'Perusahaan'],
            salesChannels: data.salesChannels || ['WhatsApp', 'Customer lama', 'Referral'],
          };
        }
      }
    } catch (err) {
      console.warn('[SupabaseBusinessRepository] getProfile error:', err);
    }
    return this.fallback.getProfile(userId);
  }

  async saveProfile(profile: Omit<Business, 'id' | 'userId'> & { id?: string }): Promise<Business> {
    try {
      const res = await fetch('/api/business', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SupabaseBusinessRepository] saveProfile error:', err);
    }
    return this.fallback.saveProfile(profile);
  }
}
