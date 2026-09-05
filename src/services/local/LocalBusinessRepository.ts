import { IBusinessRepository } from '../contracts/IBusinessRepository';
import { Business } from '../../types/models';
import { INITIAL_BUSINESS } from '../../data/initialData';
import { appStorage } from '../../lib/storage';

const BUSINESS_STORAGE_KEY = 'dinamis_business_profile';

export class LocalBusinessRepository implements IBusinessRepository {
  async getProfile(userId = 'demo-user-01'): Promise<Business | null> {
    const saved = appStorage.getItem<Business>(BUSINESS_STORAGE_KEY);
    if (saved) return saved;

    const initial: Business = {
      id: 'biz-01',
      userId,
      ...INITIAL_BUSINESS,
      createdAt: new Date().toISOString(),
    };
    appStorage.setItem(BUSINESS_STORAGE_KEY, initial);
    return initial;
  }

  async saveProfile(profile: Omit<Business, 'id'> & { id?: string }): Promise<Business> {
    const updated: Business = {
      id: profile.id || 'biz-01',
      userId: profile.userId || 'demo-user-01',
      productOrService: profile.productOrService,
      avgSalePrice: profile.avgSalePrice,
      buyerPersona: profile.buyerPersona,
      salesChannels: profile.salesChannels,
      updatedAt: new Date().toISOString(),
    };
    appStorage.setItem(BUSINESS_STORAGE_KEY, updated);
    return updated;
  }
}
