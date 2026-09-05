import { IProspectRepository } from './contracts/IProspectRepository';
import { ISalesTargetRepository } from './contracts/ISalesTargetRepository';
import { IBusinessRepository } from './contracts/IBusinessRepository';
import { IDailyActionRepository } from './contracts/IDailyActionRepository';
import { IClosingRepository } from './contracts/IClosingRepository';
import { IStrategyRepository } from './contracts/IStrategyRepository';
import { IAIService } from './contracts/IAIService';
import { IAuthService } from './contracts/IAuthService';

import { LocalProspectRepository } from './local/LocalProspectRepository';
import { LocalSalesTargetRepository } from './local/LocalSalesTargetRepository';
import { LocalBusinessRepository } from './local/LocalBusinessRepository';
import { LocalDailyActionRepository } from './local/LocalDailyActionRepository';
import { LocalClosingRepository } from './local/LocalClosingRepository';
import { LocalStrategyRepository } from './local/LocalStrategyRepository';

import { SupabaseProspectRepository } from './supabase/SupabaseProspectRepository';
import { SupabaseSalesTargetRepository } from './supabase/SupabaseSalesTargetRepository';
import { SupabaseBusinessRepository } from './supabase/SupabaseBusinessRepository';
import { SupabaseDailyActionRepository } from './supabase/SupabaseDailyActionRepository';
import { SupabaseClosingRepository } from './supabase/SupabaseClosingRepository';
import { SupabaseStrategyRepository } from './supabase/SupabaseStrategyRepository';

import { aiService, AIService } from './ai/AIService';
import { authService, AuthService } from './auth/AuthService';
import { isSupabaseConfigured } from '../lib/supabaseClient';
import { DataSourceType } from '../types/models';

// Determine default data source based on environment
const envDataSource =
  ((process.env.NEXT_PUBLIC_DATA_SOURCE ||
    process.env.VITE_DATA_SOURCE) as DataSourceType) ||
  (isSupabaseConfigured ? 'supabase' : 'demo');

let currentDataSource: DataSourceType = envDataSource;

// Local singletons
const localProspectRepo = new LocalProspectRepository();
const localSalesTargetRepo = new LocalSalesTargetRepository();
const localBusinessRepo = new LocalBusinessRepository();
const localDailyActionRepo = new LocalDailyActionRepository();
const localClosingRepo = new LocalClosingRepository();
const localStrategyRepo = new LocalStrategyRepository();

// Supabase singletons
const supabaseProspectRepo = new SupabaseProspectRepository();
const supabaseSalesTargetRepo = new SupabaseSalesTargetRepository();
const supabaseBusinessRepo = new SupabaseBusinessRepository();
const supabaseDailyActionRepo = new SupabaseDailyActionRepository();
const supabaseClosingRepo = new SupabaseClosingRepository();
const supabaseStrategyRepo = new SupabaseStrategyRepository();

// Proxy Repositories that dynamically delegate based on currentDataSource
export const prospectRepository: IProspectRepository = {
  getAll: (f) => (currentDataSource === 'supabase' ? supabaseProspectRepo.getAll(f) : localProspectRepo.getAll(f)),
  getById: (id) => (currentDataSource === 'supabase' ? supabaseProspectRepo.getById(id) : localProspectRepo.getById(id)),
  create: (data) => (currentDataSource === 'supabase' ? supabaseProspectRepo.create(data) : localProspectRepo.create(data)),
  update: (id, u) => (currentDataSource === 'supabase' ? supabaseProspectRepo.update(id, u) : localProspectRepo.update(id, u)),
  addActivity: (id, a) => (currentDataSource === 'supabase' ? supabaseProspectRepo.addActivity(id, a) : localProspectRepo.addActivity(id, a)),
  resolveLeak: (id) => (currentDataSource === 'supabase' ? supabaseProspectRepo.resolveLeak(id) : localProspectRepo.resolveLeak(id)),
  markClosing: (id, name, amt, prof) => (currentDataSource === 'supabase' ? supabaseProspectRepo.markClosing(id, name, amt, prof) : localProspectRepo.markClosing(id, name, amt, prof)),
  resetToDemo: () => (currentDataSource === 'supabase' ? supabaseProspectRepo.resetToDemo() : localProspectRepo.resetToDemo()),
};

export const salesTargetRepository: ISalesTargetRepository = {
  getTarget: (u, m) => (currentDataSource === 'supabase' ? supabaseSalesTargetRepo.getTarget(u, m) : localSalesTargetRepo.getTarget(u, m)),
  saveTarget: (t) => (currentDataSource === 'supabase' ? supabaseSalesTargetRepo.saveTarget(t) : localSalesTargetRepo.saveTarget(t)),
  updateAchieved: (amt, u) => (currentDataSource === 'supabase' ? supabaseSalesTargetRepo.updateAchieved(amt, u) : localSalesTargetRepo.updateAchieved(amt, u)),
};

export const businessRepository: IBusinessRepository = {
  getProfile: (u) => (currentDataSource === 'supabase' ? supabaseBusinessRepo.getProfile(u) : localBusinessRepo.getProfile(u)),
  saveProfile: (p) => (currentDataSource === 'supabase' ? supabaseBusinessRepo.saveProfile(p) : localBusinessRepo.saveProfile(p)),
};

export const dailyActionRepository: IDailyActionRepository = {
  getAll: (u) => (currentDataSource === 'supabase' ? supabaseDailyActionRepo.getAll(u) : localDailyActionRepo.getAll(u)),
  increment: (id) => (currentDataSource === 'supabase' ? supabaseDailyActionRepo.increment(id) : localDailyActionRepo.increment(id)),
  toggleCompleted: (id) => (currentDataSource === 'supabase' ? supabaseDailyActionRepo.toggleCompleted(id) : localDailyActionRepo.toggleCompleted(id)),
  resetDaily: () => (currentDataSource === 'supabase' ? supabaseDailyActionRepo.resetDaily() : localDailyActionRepo.resetDaily()),
};

export const closingRepository: IClosingRepository = {
  getAll: (u) => (currentDataSource === 'supabase' ? supabaseClosingRepo.getAll(u) : localClosingRepo.getAll(u)),
  create: (c) => (currentDataSource === 'supabase' ? supabaseClosingRepo.create(c) : localClosingRepo.create(c)),
};

export const strategyRepository: IStrategyRepository = {
  getStrategies: () => (currentDataSource === 'supabase' ? supabaseStrategyRepo.getStrategies() : localStrategyRepo.getStrategies()),
};

export { aiService, authService };

export function getDataSource(): DataSourceType {
  return currentDataSource;
}

export function setDataSource(source: DataSourceType) {
  currentDataSource = source;
}

// Re-export contracts
export * from './contracts/IAuthService';
export * from './contracts/IBusinessRepository';
export * from './contracts/ISalesTargetRepository';
export * from './contracts/IProspectRepository';
export * from './contracts/IDailyActionRepository';
export * from './contracts/IClosingRepository';
export * from './contracts/IStrategyRepository';
export * from './contracts/IAIService';
