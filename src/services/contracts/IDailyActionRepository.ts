import { DailyAction } from '../../types/models';

export interface IDailyActionRepository {
  getAll(userId?: string): Promise<DailyAction[]>;
  increment(actionId: string): Promise<DailyAction>;
  toggleCompleted(actionId: string): Promise<DailyAction>;
  resetDaily(): Promise<DailyAction[]>;
}
