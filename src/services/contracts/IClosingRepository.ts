import { Closing } from '../../types/models';

export interface IClosingRepository {
  getAll(userId?: string): Promise<Closing[]>;
  create(closing: Omit<Closing, 'id'>): Promise<Closing>;
}
