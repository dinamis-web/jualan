import { ISalesTargetRepository } from '../contracts/ISalesTargetRepository';
import { SalesTarget } from '../../types/models';
import { INITIAL_TARGET } from '../../data/initialData';
import { appStorage } from '../../lib/storage';

const TARGET_STORAGE_KEY = 'dinamis_sales_target';

export class LocalSalesTargetRepository implements ISalesTargetRepository {
  async getTarget(userId = 'demo-user-01', monthName = 'September'): Promise<SalesTarget | null> {
    const saved = appStorage.getItem<SalesTarget>(TARGET_STORAGE_KEY);
    if (saved) return saved;

    const initial: SalesTarget = {
      id: 'target-01',
      userId,
      ...INITIAL_TARGET,
      monthName: monthName || INITIAL_TARGET.monthName,
      createdAt: new Date().toISOString(),
    };
    appStorage.setItem(TARGET_STORAGE_KEY, initial);
    return initial;
  }

  async saveTarget(target: Omit<SalesTarget, 'id'> & { id?: string }): Promise<SalesTarget> {
    const current = await this.getTarget(target.userId, target.monthName);
    const updated: SalesTarget = {
      id: target.id || current?.id || 'target-01',
      userId: target.userId || 'demo-user-01',
      monthName: target.monthName,
      targetAmount: target.targetAmount,
      achievedAmount: target.achievedAmount,
      avgCommission: target.avgCommission,
      updatedAt: new Date().toISOString(),
    };
    appStorage.setItem(TARGET_STORAGE_KEY, updated);
    return updated;
  }

  async updateAchieved(amountToAdd: number, userId = 'demo-user-01'): Promise<SalesTarget> {
    const current = (await this.getTarget(userId)) || {
      id: 'target-01',
      userId,
      monthName: 'September',
      targetAmount: 5000000,
      achievedAmount: 0,
      avgCommission: 100000,
    };
    const updated: SalesTarget = {
      ...current,
      achievedAmount: current.achievedAmount + amountToAdd,
      updatedAt: new Date().toISOString(),
    };
    appStorage.setItem(TARGET_STORAGE_KEY, updated);
    return updated;
  }
}
