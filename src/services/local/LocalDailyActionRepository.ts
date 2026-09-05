import { IDailyActionRepository } from '../contracts/IDailyActionRepository';
import { DailyAction } from '../../types/models';
import { INITIAL_ACTIONS } from '../../data/initialData';
import { appStorage } from '../../lib/storage';

const ACTIONS_STORAGE_KEY = 'dinamis_daily_actions';

export class LocalDailyActionRepository implements IDailyActionRepository {
  private getStore(): DailyAction[] {
    const saved = appStorage.getItem<DailyAction[]>(ACTIONS_STORAGE_KEY);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    const initial = JSON.parse(JSON.stringify(INITIAL_ACTIONS)) as DailyAction[];
    appStorage.setItem(ACTIONS_STORAGE_KEY, initial);
    return initial;
  }

  private saveStore(items: DailyAction[]) {
    appStorage.setItem(ACTIONS_STORAGE_KEY, items);
  }

  async getAll(userId = 'demo-user-01'): Promise<DailyAction[]> {
    return this.getStore().map((a) => ({ ...a, userId }));
  }

  async increment(actionId: string): Promise<DailyAction> {
    const list = this.getStore();
    const action = list.find((a) => a.id === actionId);
    if (!action) throw new Error(`Action ${actionId} not found`);

    if (action.completedCount < action.targetCount) {
      action.completedCount += 1;
      if (action.completedCount >= action.targetCount) {
        action.isCompleted = true;
      }
    }
    this.saveStore(list);
    return action;
  }

  async toggleCompleted(actionId: string): Promise<DailyAction> {
    const list = this.getStore();
    const action = list.find((a) => a.id === actionId);
    if (!action) throw new Error(`Action ${actionId} not found`);

    action.isCompleted = !action.isCompleted;
    if (action.isCompleted) {
      action.completedCount = action.targetCount;
    } else {
      action.completedCount = 0;
    }
    this.saveStore(list);
    return action;
  }

  async resetDaily(): Promise<DailyAction[]> {
    const initial = JSON.parse(JSON.stringify(INITIAL_ACTIONS)) as DailyAction[];
    this.saveStore(initial);
    return initial;
  }
}
