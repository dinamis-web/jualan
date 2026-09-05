import { Business } from '../../types/models';

export interface IBusinessRepository {
  getProfile(userId?: string): Promise<Business | null>;
  saveProfile(profile: Omit<Business, 'id'> & { id?: string }): Promise<Business>;
}
