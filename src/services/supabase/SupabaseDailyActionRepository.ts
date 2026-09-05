import { IDailyActionRepository } from '../contracts/IDailyActionRepository';
import { DailyAction } from '../../types/models';
import { LocalDailyActionRepository } from '../local/LocalDailyActionRepository';

export class SupabaseDailyActionRepository implements IDailyActionRepository {
  private fallback = new LocalDailyActionRepository();

  async getAll(userId?: string): Promise<DailyAction[]> {
    try {
      const res = await fetch('/api/actions');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            userId: d.userId,
            code: d.code,
            title: d.title,
            label: d.label,
            completedCount: Number(d.completedCount || 0),
            targetCount: Number(d.targetCount || 5),
            isCompleted: Boolean(d.isCompleted),
            detailTitle: d.detailTitle || d.title,
            detailDesc: d.detailDesc || '',
            suggestedTemplate: d.suggestedTemplate || '',
            defaultCustomerName: d.defaultCustomerName,
            date: d.date || 'Hari ini',
          }));
        }
      }
    } catch (err) {
      console.warn('[SupabaseDailyActionRepository] getAll error:', err);
    }
    return this.fallback.getAll(userId);
  }

  async increment(id: string): Promise<DailyAction> {
    try {
      const res = await fetch(`/api/actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ increment: true }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SupabaseDailyActionRepository] increment error:', err);
    }
    return this.fallback.increment(id);
  }

  async toggleCompleted(id: string): Promise<DailyAction> {
    try {
      const all = await this.getAll();
      const current = all.find((a) => a.id === id);
      const isNowCompleted = !current?.isCompleted;

      const res = await fetch(`/api/actions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: isNowCompleted }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SupabaseDailyActionRepository] toggleCompleted error:', err);
    }
    return this.fallback.toggleCompleted(id);
  }

  async resetDaily(): Promise<DailyAction[]> {
    try {
      const res = await fetch('/api/actions/reset', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SupabaseDailyActionRepository] resetDaily error:', err);
    }
    return this.fallback.resetDaily();
  }
}
