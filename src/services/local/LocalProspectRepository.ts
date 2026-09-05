import { IProspectRepository, ProspectFilter, CreateProspectInput } from '../contracts/IProspectRepository';
import { Prospect, ProspectActivity, ActivityType } from '../../types/models';
import { INITIAL_PROSPECTS } from '../../data/initialData';
import { appStorage } from '../../lib/storage';

const PROSPECTS_STORAGE_KEY = 'dinamis_prospects_list';

export class LocalProspectRepository implements IProspectRepository {
  private getStore(): Prospect[] {
    const saved = appStorage.getItem<Prospect[]>(PROSPECTS_STORAGE_KEY);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    const initial = JSON.parse(JSON.stringify(INITIAL_PROSPECTS)) as Prospect[];
    appStorage.setItem(PROSPECTS_STORAGE_KEY, initial);
    return initial;
  }

  private saveStore(items: Prospect[]) {
    appStorage.setItem(PROSPECTS_STORAGE_KEY, items);
  }

  async getAll(filter?: ProspectFilter): Promise<Prospect[]> {
    let list = this.getStore();

    if (filter) {
      if (filter.priority) {
        list = list.filter((p) => p.priority === filter.priority);
      }
      if (filter.status) {
        list = list.filter((p) => p.status === filter.status);
      }
      if (filter.isMoneyLeak !== undefined) {
        list = list.filter((p) => Boolean(p.isMoneyLeak) === filter.isMoneyLeak);
      }
      if (filter.searchQuery) {
        const q = filter.searchQuery.toLowerCase().trim();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.status.toLowerCase().includes(q) ||
            (p.notes && p.notes.toLowerCase().includes(q))
        );
      }
    }

    return list;
  }

  async getById(id: string): Promise<Prospect | null> {
    const list = this.getStore();
    return list.find((p) => p.id === id) || null;
  }

  async create(data: CreateProspectInput): Promise<Prospect> {
    const list = this.getStore();
    const newProspect: Prospect = {
      id: 'p-' + Date.now(),
      name: data.name,
      potential: data.potential,
      status: data.status,
      priority: data.priority,
      lastActivity: data.lastActivity || 'Baru ditambahkan',
      daysInactive: data.daysInactive || 0,
      nextRecommendation: data.nextRecommendation || 'Hubungi sekarang',
      phone: data.phone,
      notes: data.notes,
      timeline: data.timeline || [
        {
          id: 'act-' + Date.now(),
          prospectId: 'p-' + Date.now(),
          timeAgo: 'Baru saja',
          event: 'Ditambahkan ke Radar Prospek',
          type: 'NOTE',
          createdAt: new Date().toISOString(),
        },
      ],
      isMoneyLeak: data.isMoneyLeak || false,
      leakReason: data.leakReason,
      resolved: false,
      closed: false,
      createdAt: new Date().toISOString(),
    };

    const updated = [newProspect, ...list];
    this.saveStore(updated);
    return newProspect;
  }

  async update(id: string, updates: Partial<Prospect>): Promise<Prospect> {
    const list = this.getStore();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Prospect ${id} not found`);
    }

    const updated: Prospect = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    this.saveStore(list);
    return updated;
  }

  async addActivity(
    prospectId: string,
    activity: { event: string; timeAgo?: string; type?: ActivityType }
  ): Promise<ProspectActivity> {
    const list = this.getStore();
    const target = list.find((p) => p.id === prospectId);
    if (!target) {
      throw new Error(`Prospect ${prospectId} not found`);
    }

    const newAct: ProspectActivity = {
      id: 'act-' + Date.now(),
      prospectId,
      timeAgo: activity.timeAgo || 'Baru saja',
      event: activity.event,
      type: activity.type || 'NOTE',
      createdAt: new Date().toISOString(),
    };

    target.timeline = [newAct, ...(target.timeline || [])];
    target.lastActivity = activity.event;
    this.saveStore(list);
    return newAct;
  }

  async resolveLeak(id: string): Promise<void> {
    const list = this.getStore();
    const item = list.find((p) => p.id === id);
    if (item) {
      item.resolved = true;
      item.isMoneyLeak = false;
      this.saveStore(list);
    }
  }

  async markClosing(id: string, customerName: string, amount: number, profit: number): Promise<void> {
    const list = this.getStore();
    const item = list.find((p) => p.id === id);
    if (item) {
      item.closed = true;
      item.timeline.unshift({
        id: 'act-' + Date.now(),
        prospectId: id,
        timeAgo: 'Hari ini',
        event: `Deal Closing: Rp${amount.toLocaleString('id-ID')}`,
        type: 'STATUS_CHANGE',
      });
      this.saveStore(list);
    }
  }

  async resetToDemo(): Promise<void> {
    const initial = JSON.parse(JSON.stringify(INITIAL_PROSPECTS)) as Prospect[];
    this.saveStore(initial);
  }
}
