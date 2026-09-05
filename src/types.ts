export * from './types/models';

import {
  ProspectActivity,
  DailyAction,
  SalesTarget,
  Business,
  Closing,
} from './types/models';

// Backward-compatible type aliases for UI components
export type TimelineItem = ProspectActivity;
export type ActionItem = DailyAction;
export type TargetSettings = SalesTarget;
export type BusinessProfile = Business;
export type ClosingRecord = Closing;

export type MainTab = 'home' | 'radar' | 'action' | 'result';

export type ActiveScreen =
  | 'landing'
  | 'target-setup'
  | 'business-scan'
  | 'money-plan'
  | 'main' // tabbed screens (home, radar, action, result)
  | 'money-leak'
  | 'prospect-detail'
  | 'closing-celebration';
