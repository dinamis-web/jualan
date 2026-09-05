import { Prospect, ProspectActivity, PriorityTier, ProspectStatus } from '../../types/models';

export interface ProspectFilter {
  priority?: PriorityTier;
  status?: ProspectStatus;
  searchQuery?: string;
  isMoneyLeak?: boolean;
}

export type CreateProspectInput = Partial<Prospect> & {
  name: string;
  potential: number;
  status: ProspectStatus;
  priority: PriorityTier;
};

export interface IProspectRepository {
  getAll(filter?: ProspectFilter): Promise<Prospect[]>;
  getById(id: string): Promise<Prospect | null>;
  create(prospect: CreateProspectInput): Promise<Prospect>;
  update(id: string, updates: Partial<Prospect>): Promise<Prospect>;
  addActivity(prospectId: string, activity: { event: string; timeAgo?: string; type?: ProspectActivity['type'] }): Promise<ProspectActivity>;
  resolveLeak(id: string): Promise<void>;
  markClosing(id: string, customerName: string, amount: number, profit: number): Promise<void>;
  resetToDemo(): Promise<void>;
}
