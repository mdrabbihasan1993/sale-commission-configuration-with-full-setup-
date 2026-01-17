
export enum CommissionType {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE',
  TIERED = 'TIERED'
}

export enum FilterType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM'
}

export interface DateRange {
  from: string;
  to: string;
}

export interface CommissionTier {
  id: string;
  from: number;
  to: number;
  rate: number;
  referenceRate: number; // Added for 2nd reference breakdown
  type: CommissionType.FLAT | CommissionType.PERCENTAGE;
}

export interface TargetSettings {
  merchantOnboard: number;
  totalParcels: number;
  totalRevenue: number;
  commissionType: CommissionType;
  commissionValue: number; // Used for FLAT and PERCENTAGE
  referenceValue: number; // Added for 2nd reference FLAT and PERCENTAGE
  tiers: CommissionTier[]; // Used for TIERED
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  individualSettings: TargetSettings | null; // null means uses global default
}

export interface PerformanceSnapshot {
  date: string;
  merchants: number;
  parcels: number;
  revenue: number;
}

export interface SalesPerformance {
  employeeId: string;
  history: PerformanceSnapshot[];
}
