
import React from 'react';
import { TargetSettings, CommissionType, CommissionTier } from '../types';

interface SettingsPanelProps {
  settings: TargetSettings;
  onUpdate: (newSettings: TargetSettings) => void;
  onSave?: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, onSave }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({
      ...settings,
      [name]: name === 'commissionType' ? value : Number(value)
    });
  };

  const addTier = () => {
    const lastTier = settings.tiers[settings.tiers.length - 1];
    const newFrom = lastTier ? lastTier.to + 1 : 0;
    const newTier: CommissionTier = {
      id: Math.random().toString(36).substr(2, 9),
      from: newFrom,
      to: newFrom + 1000,
      rate: 0,
      referenceRate: 0,
      type: CommissionType.FLAT
    };
    onUpdate({
      ...settings,
      tiers: [...settings.tiers, newTier]
    });
  };

  const updateTier = (id: string, field: keyof CommissionTier, value: any) => {
    onUpdate({
      ...settings,
      tiers: settings.tiers.map(t => t.id === id ? { ...t, [field]: value } : t)
    });
  };

  const removeTier = (id: string) => {
    onUpdate({
      ...settings,
      tiers: settings.tiers.filter(t => t.id !== id)
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in duration-700">
      
      {/* HEADER ACTION */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Configuration Suite</h2>
          <p className="text-slate-500 text-sm">Define targets and incentive structures in one place.</p>
        </div>
        <button 
          onClick={onSave}
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-blue transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          Save All Changes
        </button>
      </div>

      {/* PERFORMANCE TARGETS SECTION */}
      <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">1. Performance Benchmarking</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Merchant Onboarding</label>
            <div className="relative">
              <input 
                type="number" name="merchantOnboard" value={settings.merchantOnboard} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 uppercase">Units</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Total Parcel Volume</label>
            <div className="relative">
              <input 
                type="number" name="totalParcels" value={settings.totalParcels} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 uppercase">Items</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Revenue Target</label>
            <div className="relative">
              <input 
                type="number" name="totalRevenue" value={settings.totalRevenue} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300">৳</span>
            </div>
          </div>
        </div>
      </section>

      {/* REWARD STRUCTURE SECTION */}
      <section className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">2. Reward Structure Setup</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Payout Strategy</label>
            <select 
              name="commissionType" value={settings.commissionType} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all cursor-pointer appearance-none"
            >
              <option value={CommissionType.FLAT}>Flat Fee Per Unit</option>
              <option value={CommissionType.PERCENTAGE}>Revenue Share (%)</option>
              <option value={CommissionType.TIERED}>Tiered Volume Bracket</option>
            </select>
          </div>

          {settings.commissionType !== CommissionType.TIERED && (
            <>
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">Individual Rate</label>
                <div className="relative">
                  <input 
                    type="number" name="commissionValue" value={settings.commissionValue} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    {settings.commissionType === CommissionType.PERCENTAGE ? '%' : '৳'}
                  </span>
                </div>
              </div>
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block ml-1">2nd Ref Rate</label>
                <div className="relative">
                  <input 
                    type="number" name="referenceValue" value={settings.referenceValue} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    {settings.commissionType === CommissionType.PERCENTAGE ? '%' : '৳'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {settings.commissionType === CommissionType.TIERED && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <p className="text-sm text-slate-500 font-medium">Defined volume brackets with multi-level commission rates.</p>
              <button 
                onClick={addTier}
                className="text-xs font-bold text-brand-blue hover:text-slate-900 transition-colors flex items-center gap-1 bg-brand-blue/5 px-3 py-1.5 rounded-lg"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                Add Bracket
              </button>
            </div>
            
            <div className="space-y-3">
              {settings.tiers.map((tier) => (
                <div key={tier.id} className="grid grid-cols-12 gap-3 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all group">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">From</label>
                    <input type="number" value={tier.from} onChange={(e) => updateTier(tier.id, 'from', Number(e.target.value))} className="w-full bg-white border border-slate-200 px-3 py-2 text-[11px] font-bold rounded-lg focus:border-brand-blue outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">To</label>
                    <input type="number" value={tier.to} onChange={(e) => updateTier(tier.id, 'to', Number(e.target.value))} className="w-full bg-white border border-slate-200 px-3 py-2 text-[11px] font-bold rounded-lg focus:border-brand-blue outline-none" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mode</label>
                    <select value={tier.type} onChange={(e) => updateTier(tier.id, 'type', e.target.value)} className="w-full bg-white border border-slate-200 px-2 py-2 text-[10px] font-bold rounded-lg focus:border-brand-blue outline-none cursor-pointer">
                      <option value={CommissionType.FLAT}>৳ (Fixed)</option>
                      <option value={CommissionType.PERCENTAGE}>% (Share)</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Indiv Rate</label>
                    <div className="relative">
                      <input type="number" value={tier.rate} onChange={(e) => updateTier(tier.id, 'rate', Number(e.target.value))} className="w-full bg-white border border-slate-200 px-3 py-2 text-[11px] font-bold rounded-lg focus:border-brand-blue outline-none" />
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-300">{tier.type === CommissionType.PERCENTAGE ? '%' : '৳'}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ref Rate</label>
                    <div className="relative">
                      <input type="number" value={tier.referenceRate} onChange={(e) => updateTier(tier.id, 'referenceRate', Number(e.target.value))} className="w-full bg-white border border-slate-200 px-3 py-2 text-[11px] font-bold rounded-lg focus:border-brand-blue outline-none" />
                      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-300">{tier.type === CommissionType.PERCENTAGE ? '%' : '৳'}</span>
                    </div>
                  </div>
                  <div className="col-span-2 text-right flex justify-end">
                    <button onClick={() => removeTier(tier.id)} className="text-slate-300 hover:text-red-500 p-2 mt-4 hover:bg-red-50 rounded-lg transition-all">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
              {settings.tiers.length === 0 && (
                <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <p className="text-sm text-slate-400 font-medium">No tiered brackets defined. Click "Add Bracket" to start.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SettingsPanel;
