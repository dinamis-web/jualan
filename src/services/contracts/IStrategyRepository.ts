import { Strategy } from '../../types/models';

export interface IStrategyRepository {
  getStrategies(): Promise<Strategy[]>;
}
