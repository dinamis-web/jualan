import { IProspectRepository, ProspectFilter, CreateProspectInput } from '../contracts/IProspectRepository';
import { Prospect, ProspectActivity } from '../../types/models';
import { LocalProspectRepository } from '../local/LocalProspectRepository';

export class SupabaseProspectRepository implements IProspectRepository {
  private fallback = new LocalProspectRepository();

  async getAll(filter?: ProspectFilter): Promise<Prospect[]> {
    try {
      const params = new URLSearchParams();
      if (filter?.priority) params.set('priority', filter.priority);
      if (filter?.status) params.set('status', filter.status);
      if (filter?.isMoneyLeak !== undefined) params.set('isMoneyLeak', String(filter.isMoneyLeak));
      if (filter?.searchQuery) params.set('searchQuery', filter.searchQuery);

      const qs = params.toString();
      const res = await fetch(`/api/prospects${qs ? `?${qs}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SupabaseProspectRepository] fetch error, falling back:', err);
    }
    return this.fallback.getAll(filter);
  }

  async getById(id: string): Promise<Prospect | null> {
    try {
      const res = await fetch(`/api/prospects/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SupabaseProspectRepository] getById error:', err);
    }
    return this.fallback.getById(id);
  }

  async create(data: CreateProspectInput): Promise<Prospect> {
    try {
      const res = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const created = await res.json();
        if (created && !created.error) {
          return created;
        }
      }
    } catch (err) {
      console.warn('[SupabaseProspectRepository] create error:', err);
    }
    return this.fallback.create(data);
  }

  async update(id: string, updates: Partial<Prospect>): Promise<Prospect> {
    try {
      const res = await fetch(`/api/prospects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        if (updated && !updated.error) {
          return updated;
        }
      }
    } catch (err) {
      console.warn('[SupabaseProspectRepository] update error:', err);
    }
    return this.fallback.update(id, updates);
  }

  async addActivity(
    prospectId: string,
    activity: { event: string; timeAgo?: string; type?: ProspectActivity['type'] }
  ): Promise<ProspectActivity> {
    try {
      const res = await fetch(`/api/prospects/${prospectId}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          return data;
        }
      }
    } catch (err) {
      console.warn('[SupabaseProspectRepository] addActivity error:', err);
    }
    return this.fallback.addActivity(prospectId, activity);
  }

  async resolveLeak(id: string): Promise<void> {
    try {
      await fetch(`/api/prospects/${id}/resolve-leak`, {
        method: 'POST',
      });
    } catch (err) {
      console.warn('[SupabaseProspectRepository] resolveLeak error:', err);
    }
    await this.fallback.resolveLeak(id);
  }

  async markClosing(id: string, customerName: string, amount: number, profit: number): Promise<void> {
    try {
      await fetch('/api/closings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          saleAmount: amount,
          profitCommission: profit,
          source: 'Radar Prospek',
          prospectId: id,
        }),
      });
    } catch (err) {
      console.warn('[SupabaseProspectRepository] markClosing error:', err);
    }
    await this.fallback.markClosing(id, customerName, amount, profit);
  }

  async resetToDemo(): Promise<void> {
    try {
      await fetch('/api/prospects/reset-demo', {
        method: 'POST',
      });
    } catch (err) {
      console.warn('[SupabaseProspectRepository] resetToDemo error:', err);
    }
    await this.fallback.resetToDemo();
  }
}
