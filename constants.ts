
import { CommissionType, TargetSettings, Employee, PerformanceSnapshot } from './types';

export const INITIAL_TARGETS: TargetSettings = {
  merchantOnboard: 50,
  totalParcels: 5000,
  totalRevenue: 250000,
  commissionType: CommissionType.TIERED,
  commissionValue: 5,
  referenceValue: 2,
  tiers: [
    { id: '1', from: 0, to: 1000, rate: 0, referenceRate: 0, type: CommissionType.FLAT },
    { id: '2', from: 1001, to: 2000, rate: 1, referenceRate: 0.5, type: CommissionType.FLAT },
    { id: '3', from: 2001, to: 5000, rate: 5, referenceRate: 1.5, type: CommissionType.PERCENTAGE },
  ],
};

export const MOCK_EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Rahat Islam', role: 'Senior Sales Executive', individualSettings: null },
  { id: 'e2', name: 'Nusrat Jahan', role: 'Business Development Manager', individualSettings: null },
  { id: 'e3', name: 'Tanvir Ahmed', role: 'Sales Associate', individualSettings: null },
  { id: 'e4', name: 'Sumi Akter', role: 'Regional Lead', individualSettings: null },
  { id: 'e5', name: 'Arif Hossain', role: 'Sales Executive', individualSettings: null },
  { id: 'e6', name: 'Farhana Yeasmin', role: 'Account Manager', individualSettings: null },
  { id: 'e7', name: 'Kamrul Hasan', role: 'Territory Officer', individualSettings: null },
  { id: 'e8', name: 'Mitu Rahman', role: 'Sales Support', individualSettings: null },
  { id: 'e9', name: 'Zahid Hasan', role: 'Key Account Lead', individualSettings: null },
  { id: 'e10', name: 'Sabina Yasmin', role: 'Field Executive', individualSettings: null },
  { id: 'e11', name: 'Mamunur Rashid', role: 'Sales Associate', individualSettings: null },
  { id: 'e12', name: 'Rokeya Begum', role: 'Regional Coordinator', individualSettings: null },
];

export const MOCK_PERFORMANCE: PerformanceSnapshot[] = [
  { date: '2024-01', merchants: 12, parcels: 800, revenue: 45000 },
  { date: '2024-02', merchants: 18, parcels: 1200, revenue: 62000 },
  { date: '2024-03', merchants: 25, parcels: 1900, revenue: 98000 },
  { date: '2024-04', merchants: 32, parcels: 2800, revenue: 145000 },
  { date: '2024-05', merchants: 40, parcels: 3900, revenue: 198000 },
  { date: '2024-06', merchants: 48, parcels: 4850, revenue: 242000 },
];
