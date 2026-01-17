
import React, { useMemo } from 'react';
import { Employee, TargetSettings, CommissionType, PerformanceSnapshot, FilterType, DateRange } from '../types';
import { MOCK_PERFORMANCE } from '../constants';

interface TeamPerformanceProps {
  employees: Employee[];
  globalSettings: TargetSettings;
  filter: FilterType;
  customRange: DateRange;
}

const TeamPerformance: React.FC<TeamPerformanceProps> = ({ employees, globalSettings, filter, customRange }) => {
  
  const adjustedGlobalTargets = useMemo(() => {
    let multiplier = 1;
    if (filter === FilterType.DAILY) multiplier = 1/30;
    if (filter === FilterType.WEEKLY) multiplier = 1/4;
    
    return {
      merchants: Math.max(1, Math.round(globalSettings.merchantOnboard * multiplier)),
      parcels: Math.max(10, Math.round(globalSettings.totalParcels * multiplier)),
      revenue: Math.max(1000, Math.round(globalSettings.totalRevenue * multiplier)),
    };
  }, [globalSettings, filter]);

  const getEmployeePerformance = (index: number): PerformanceSnapshot => {
    const base = MOCK_PERFORMANCE[MOCK_PERFORMANCE.length - 1];
    let multiplier = 1;
    if (filter === FilterType.DAILY) multiplier = 0.05;
    if (filter === FilterType.WEEKLY) multiplier = 0.25;
    
    const variance = (0.7 + (index % 5) * 0.15) * multiplier; 
    return {
      date: base.date,
      merchants: Math.round(base.merchants * variance),
      parcels: Math.round(base.parcels * variance),
      revenue: Math.round(base.revenue * variance),
    };
  };

  const calculateCommissionBreakdown = (snapshot: PerformanceSnapshot, settings: TargetSettings) => {
    let individual = 0;
    let reference = 0;

    if (settings.commissionType === CommissionType.FLAT) {
      individual = snapshot.parcels * settings.commissionValue;
      reference = snapshot.parcels * settings.referenceValue;
    } else if (settings.commissionType === CommissionType.PERCENTAGE) {
      individual = (snapshot.revenue * settings.commissionValue) / 100;
      reference = (snapshot.revenue * settings.referenceValue) / 100;
    } else {
      settings.tiers.forEach(tier => {
        const applicableVolume = Math.max(0, Math.min(snapshot.parcels, tier.to) - tier.from);
        if (applicableVolume > 0) {
          if (tier.type === CommissionType.FLAT) {
            individual += applicableVolume * tier.rate;
            reference += applicableVolume * (tier.referenceRate || 0);
          } else {
            const revenueShare = (applicableVolume / snapshot.parcels) * snapshot.revenue;
            individual += (revenueShare * tier.rate) / 100;
            reference += (revenueShare * (tier.referenceRate || 0)) / 100;
          }
        }
      });
    }

    return { individual, reference, total: individual + reference };
  };

  const teamStats = useMemo(() => {
    return employees.map((emp, idx) => {
      const perf = getEmployeePerformance(idx);
      const settings = emp.individualSettings || globalSettings;
      
      const targets = emp.individualSettings ? {
        merchants: Math.max(1, Math.round(emp.individualSettings.merchantOnboard * (filter === FilterType.DAILY ? 1/30 : filter === FilterType.WEEKLY ? 1/4 : 1))),
        parcels: Math.max(10, Math.round(emp.individualSettings.totalParcels * (filter === FilterType.DAILY ? 1/30 : filter === FilterType.WEEKLY ? 1/4 : 1))),
        revenue: Math.max(1000, Math.round(emp.individualSettings.totalRevenue * (filter === FilterType.DAILY ? 1/30 : filter === FilterType.WEEKLY ? 1/4 : 1)))
      } : adjustedGlobalTargets;

      const merchantAchievement = (perf.merchants / targets.merchants) * 100;
      const parcelAchievement = (perf.parcels / targets.parcels) * 100;
      const revenueAchievement = (perf.revenue / targets.revenue) * 100;
      const averageAchievement = (merchantAchievement + parcelAchievement + revenueAchievement) / 3;
      const breakdown = calculateCommissionBreakdown(perf, settings);

      return {
        ...emp,
        perf,
        targets,
        achievements: {
          merchants: merchantAchievement,
          parcels: parcelAchievement,
          revenue: revenueAchievement,
          average: averageAchievement
        },
        commBreakdown: breakdown
      };
    }).sort((a, b) => b.achievements.average - a.achievements.average);
  }, [employees, globalSettings, adjustedGlobalTargets, filter]);

  const aggregateData = useMemo(() => {
    return {
      totalRevenue: teamStats.reduce((sum, item) => sum + item.perf.revenue, 0),
      totalParcels: teamStats.reduce((sum, item) => sum + item.perf.parcels, 0),
      totalMerchants: teamStats.reduce((sum, item) => sum + item.perf.merchants, 0),
      totalCommission: teamStats.reduce((sum, item) => sum + item.commBreakdown.total, 0),
      totalIndividual: teamStats.reduce((sum, item) => sum + item.commBreakdown.individual, 0),
      totalReference: teamStats.reduce((sum, item) => sum + item.commBreakdown.reference, 0),
    };
  }, [teamStats]);

  return (
    <div className="space-y-8">
      {/* Team Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Team Payout</p>
          <h3 className="text-2xl font-black text-slate-900">৳{aggregateData.totalCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
          <div className="flex gap-4 mt-3 pt-3 border-t border-slate-50">
             <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Individual</p>
                <p className="text-xs font-bold text-slate-700">৳{aggregateData.totalIndividual.toLocaleString(0)}</p>
             </div>
             <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase">2nd Reference</p>
                <p className="text-xs font-bold text-brand-orange">৳{aggregateData.totalReference.toLocaleString(0)}</p>
             </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Aggregate Volume</p>
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-black text-slate-800">{aggregateData.totalParcels.toLocaleString()}</h3>
            <span className="text-[10px] font-bold text-slate-400">PARCELS</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Network Revenue</p>
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-black text-emerald-600">৳{(aggregateData.totalRevenue / 1000).toFixed(0)}k</h3>
            <span className="text-[10px] font-bold text-slate-400">TOTAL</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
          <div>
            <h3 className="text-lg font-black text-slate-900">Commission Leaderboard</h3>
            <p className="text-slate-400 text-xs font-medium">Detailed breakdown of individual vs reference earnings</p>
          </div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">Live</span>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse table-auto min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">Name</th>
                <th className="px-4 py-4 text-center">Merchants</th>
                <th className="px-4 py-4 text-center">Parcels</th>
                <th className="px-6 py-4 text-right">Individual Comm</th>
                <th className="px-6 py-4 text-right">2nd Ref Comm</th>
                <th className="px-6 py-4 text-right">Total Payout</th>
                <th className="px-6 py-4 text-center">Achievement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {teamStats.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-lg shrink-0 shadow-sm ${
                        idx === 0 ? 'bg-slate-900 text-white' : 'text-slate-400 bg-slate-100'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-slate-800 group-hover:text-brand-blue truncate max-w-[140px]">{item.name}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{item.role}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 text-center font-bold text-slate-600 text-xs">{item.perf.merchants}</td>
                  <td className="px-4 py-4 text-center font-bold text-slate-600 text-xs">{item.perf.parcels.toLocaleString()}</td>

                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-bold text-slate-700">
                      ৳{item.commBreakdown.individual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="text-xs font-bold text-brand-orange">
                      ৳{item.commBreakdown.reference.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-lg">
                      ৳{item.commBreakdown.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-black whitespace-nowrap ${
                      item.achievements.average >= 100 ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {item.achievements.average.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamPerformance;
