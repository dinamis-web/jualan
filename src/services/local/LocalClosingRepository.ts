import { IClosingRepository } from '../contracts/IClosingRepository';
import { Closing } from '../../types/models';
import { INITIAL_CLOSINGS } from '../../data/initialData';
import { appStorage } from '../../lib/storage';

const CLOSINGS_STORAGE_KEY = 'dinamis_closings_history';

export class LocalClosingRepository implements IClosingRepository {
  private getStore(): Closing[] {
    const saved = appStorage.getItem<Closing[]>(CLOSINGS_STORAGE_KEY);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    const initial = JSON.parse(JSON.stringify(INITIAL_CLOSINGS)) as Closing[];
    appStorage.setItem(CLOSINGS_STORAGE_KEY, initial);
    return initial;
  }

  private saveStore(items: Closing[]) {
    appStorage.setItem(CLOSINGS_STORAGE_KEY, items);
  }

  async getAll(userId = 'demo-user-01'): Promise<Closing[]> {
    return this.getStore().map((c) => ({ ...c, userId }));
  }

  async create(data: Omit<Closing, 'id'>): Promise<Closing> {
    const list = this.getStore();
    const newRecord: Closing = {
      id: 'cl-' + Date.now(),
      userId: data.userId || 'demo-user-01',
      customerName: data.customerName,
      saleAmount: data.saleAmount,
      profitCommission: data.profitCommission,
      source: data.source,
      date: data.date || 'Hari ini',
      prospectId: data.prospectId,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRecord, ...list];
    this.saveStore(updated);
    return newRecord;
  }
}
