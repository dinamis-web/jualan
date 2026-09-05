export type ProspectStatus =
  | 'Baru dikenal'
  | 'Sudah dihubungi'
  | 'Tertarik'
  | 'Tanya harga'
  | 'Minta penawaran'
  | 'Proposal terkirim'
  | 'Minta dihubungi lagi';

export type PriorityTier = 'HOT' | 'WARM' | 'COLD';

export type ActivityType =
  | 'NOTE'
  | 'CALL'
  | 'WHATSAPP'
  | 'PROPOSAL'
  | 'STATUS_CHANGE'
  | 'MEETING';

export interface User {
  id: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  isDemo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Business {
  id?: string;
  userId?: string;
  productOrService: string;
  avgSalePrice: number;
  buyerPersona: string[];
  salesChannels: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesTarget {
  id?: string;
  userId?: string;
  monthName: string;
  targetAmount: number;
  achievedAmount: number;
  avgCommission: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProspectActivity {
  id: string;
  prospectId?: string;
  userId?: string;
  timeAgo?: string;
  event: string;
  type?: ActivityType;
  createdAt?: string;
}

export interface Prospect {
  id: string;
  userId?: string;
  name: string;
  potential: number;
  status: ProspectStatus;
  priority: PriorityTier;
  lastActivity: string;
  daysInactive: number;
  nextRecommendation: string;
  phone?: string;
  notes?: string;
  timeline: ProspectActivity[];
  isMoneyLeak?: boolean;
  leakReason?: string;
  resolved?: boolean;
  closed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface DailyAction {
  id: string;
  userId?: string;
  code: string;
  title: string;
  label: string;
  completedCount: number;
  targetCount: number;
  isCompleted: boolean;
  detailTitle: string;
  detailDesc: string;
  suggestedTemplate: string;
  defaultCustomerName?: string;
  date?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Closing {
  id: string;
  userId?: string;
  customerName: string;
  saleAmount: number;
  profitCommission: number;
  source: string;
  date: string;
  prospectId?: string;
  createdAt?: string;
}

export interface Strategy {
  id: string;
  rank: number;
  title: string;
  label: string;
  labelColor: string;
  description: string;
  iconKey: 'users' | 'user-plus' | 'message-circle' | 'map-pin';
  iconColor: string;
}

export type DataSourceType = 'demo' | 'supabase';
