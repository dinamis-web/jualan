import { ISalesTargetRepository } from '../contracts/ISalesTargetRepository';
import { SalesTarget } from '../../types/models';
import { LocalSalesTargetRepository } from '../local/LocalSalesTargetRepository';

export class SupabaseSalesTargetRepository implements ISalesTargetRepository {
  private fallback = new LocalSalesTargetRepository();

  async getTarget(userId?: string, monthName?: string): Promise<SalesTarget | null> {
    try {
      const res = await fetch('/api/targets');
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return {
            id: data.id,
            userId: data.userId,
            monthName: data.monthName || 'September',
            targetAmount: Number(data.targetAmount || 0),
            achievedAmount: Number(data.achievedAmount || 0),
            avgCommission: Number(data.avgCommission || 100000),
          };
        }
      }
    } catch (err) {
      console.warn('[SupabaseSalesTargetRepository] getTarget error:', err);
    }
    return this.fallback.getTarget(userId, monthName);
  }

  async saveTarget(target: Omit<SalesTarget, 'id' | 'userId'> & { id?: string }): Promise<SalesTarget> {
    try {
      const res = await fetch('/api/targets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(target),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SupabaseSalesTargetRepository] saveTarget error:', err);
    }
    return this.fallback.saveTarget(target);
  }

  async updateAchieved(amount: number, userId?: string): Promise<SalesTarget> {
    try {
      const current = await this.getTarget(userId);
      const nextAchieved = (current?.achievedAmount || 0) + amount;
      return this.saveTarget({
        monthName: current?.monthName || 'September',
        targetAmount: current?.targetAmount || 5000000,
        avgCommission: current?.avgCommission || 100000,
        achievedAmount: nextAchieved,
        ...(current?.id ? { id: current.id } : {}),
      });
    } catch (err) {
      console.warn('[SupabaseSalesTargetRepository] updateAchieved error:', err);
    }
    return this.fallback.updateAchieved(amount, userId);
  }
}
