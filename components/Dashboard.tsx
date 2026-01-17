
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, LabelList
} from 'recharts';
import { TargetSettings, PerformanceSnapshot, CommissionType, FilterType, DateRange } from '../types';
import { MOCK_PERFORMANCE } from '../constants';

interface DashboardProps {
  settings: TargetSettings;
  title: string;
  filter: FilterType;
  customRange: DateRange;
}

const Dashboard: React.FC<DashboardProps> = ({ settings, title, filter, customRange }) => {
  
  // Filter and aggregate data based on selection
  const filteredData = useMemo(() => {
    if (filter === FilterType.DAILY) {
      return [MOCK_PERFORMANCE[MOCK_PERFORMANCE.length - 1]];
    }
    if (filter === FilterType.WEEKLY) {
      return MOCK_PERFORMANCE.slice(-2);
    }
    if (filter === FilterType.CUSTOM) {
      return MOCK_PERFORMANCE.slice(1, 4);
    }
    return MOCK_PERFORMANCE;
  }, [filter, customRange]);

  const latestPerformance = useMemo(() => {
    const merchants = filteredData.reduce((sum, d) => sum + d.merchants, 0);
    const parcels = filteredData.reduce((sum, d) => sum + d.parcels, 0);
    const revenue = filteredData.reduce((sum, d) => sum + d.revenue, 0);
    return { merchants, parcels, revenue, date: 'Current Period' };
  }, [filteredData]);

  const adjustedTargets = useMemo(() => {
    let multiplier = 1;
    if (filter === FilterType.DAILY) multiplier = 1/30;
    if (filter === FilterType.WEEKLY) multiplier = 1/4;
    
    return {
      merchants: Math.max(1, Math.round(settings.merchantOnboard * multiplier)),
      parcels: Math.max(10, Math.round(settings.totalParcels * multiplier)),
      revenue: Math.max(1000, Math.round(settings.totalRevenue * multiplier)),
    };
  }, [settings, filter]);

  const calculateCommissionBreakdown = (snapshot: PerformanceSnapshot) => {
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
            reference += applicableVolume * tier.referenceRate;
          } else {
            const revenueShare = (applicableVolume / snapshot.parcels) * snapshot.revenue;
            individual += (revenueShare * tier.rate) / 100;
            reference += (revenueShare * tier.referenceRate) / 100;
          }
        }
      });
    }

    return { individual, reference, total: individual + reference };
  };

  const commBreakdown = calculateCommissionBreakdown(latestPerformance);
  
  const completionRates = [
    { name: 'Merchants', value: (latestPerformance.merchants / adjustedTargets.merchants) * 100, target: adjustedTargets.merchants, current: latestPerformance.merchants },
    { name: 'Parcels', value: (latestPerformance.parcels / adjustedTargets.parcels) * 100, target: adjustedTargets.parcels, current: latestPerformance.parcels },
    { name: 'Revenue', value: (latestPerformance.revenue / adjustedTargets.revenue) * 100, target: adjustedTargets.revenue, current: latestPerformance.revenue },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Expansion</p>
            <h3 className="text-3xl font-black text-slate-900">{latestPerformance.merchants} <span className="text-sm text-slate-300">/ {adjustedTargets.merchants}</span></h3>
          </div>
          <div className="mt-6 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-1000" 
              style={{ width: `${Math.min(100, (latestPerformance.merchants / adjustedTargets.merchants) * 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Throughput</p>
            <h3 className="text-3xl font-black text-slate-900">{latestPerformance.parcels.toLocaleString()}</h3>
          </div>
          <div className="mt-6">
            <div className="bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000" 
                style={{ width: `${Math.min(100, (latestPerformance.parcels / adjustedTargets.parcels) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase">Period Target: {adjustedTargets.parcels.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Financials</p>
            <h3 className="text-3xl font-black text-slate-900">৳{latestPerformance.revenue.toLocaleString()}</h3>
          </div>
          <div className="mt-6">
            <div className="bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000" 
                style={{ width: `${Math.min(100, (latestPerformance.revenue / adjustedTargets.revenue) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-brand-orange font-bold uppercase">Period Goal: ৳{adjustedTargets.revenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col justify-between transform hover:-translate-y-1 transition-all border border-slate-800">
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Commission</p>
            <h3 className="text-3xl font-black text-white mb-3">৳{commBreakdown.total.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
            
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-white/50 uppercase">Individual</span>
                <span className="text-[11px] font-bold text-white">৳{commBreakdown.individual.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-white/50 uppercase">2nd Reference</span>
                <span className="text-[11px] font-bold text-brand-orange">৳{commBreakdown.reference.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 py-1 px-2.5 bg-white/5 rounded-lg text-[8px] text-white/60 font-black inline-block w-fit uppercase tracking-[0.15em] border border-white/5">
            {settings.commissionType} MODE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="text-xl font-black text-slate-900 tracking-tight">Period Velocity</h4>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Performance tracking for {filter.toLowerCase()} view</p>
            </div>
            <div className="flex gap-4 text-[10px] uppercase font-black tracking-widest">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span> Revenue</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-brand-orange"></span> Parcels</span>
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} dx={-5} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                    padding: '12px'
                  }}
                  itemStyle={{ fontWeight: 'bold', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="parcels" stroke="#ff751f" strokeWidth={3} fill="none" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="mb-8">
            <h4 className="text-xl font-black text-slate-900 tracking-tight">Success Score</h4>
            <p className="text-slate-400 text-xs font-medium mt-0.5">Achievement against period targets</p>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completionRates} layout="vertical" margin={{ right: 40, left: 0 }}>
                <XAxis type="number" hide domain={[0, 115]} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 11, fontWeight: '700', fill: '#64748b'}} 
                  width={80}
                />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px', fontSize: '10px' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={28}>
                  {completionRates.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 100 ? '#0f172a' : '#1e293b'} />
                  ))}
                  <LabelList 
                    dataKey="value" 
                    position="right" 
                    formatter={(val: number) => `${val.toFixed(0)}%`}
                    style={{ fill: '#475569', fontSize: '11px', fontWeight: '800' }}
                    dx={5}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {completionRates.map((rate) => (
              <div key={rate.name} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider">{rate.name}</span>
                <span className={`text-[11px] font-black ${rate.value >= 100 ? 'text-emerald-600' : 'text-slate-900'}`}>{rate.current.toLocaleString()} / {rate.target.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
