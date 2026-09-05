import { SalesTarget } from '../../types/models';

export interface ISalesTargetRepository {
  getTarget(userId?: string, monthName?: string): Promise<SalesTarget | null>;
  saveTarget(target: Omit<SalesTarget, 'id'> & { id?: string }): Promise<SalesTarget>;
  updateAchieved(amountToAdd: number, userId?: string): Promise<SalesTarget>;
}
