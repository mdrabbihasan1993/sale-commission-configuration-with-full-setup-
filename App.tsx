
import React, { useState, useMemo } from 'react';
import { TargetSettings, Employee, FilterType, DateRange } from './types';
import { INITIAL_TARGETS, MOCK_EMPLOYEES } from './constants';
import SettingsPanel from './components/SettingsPanel';
import Dashboard from './components/Dashboard';
import TeamPerformance from './components/TeamPerformance';
import FilterBar from './components/FilterBar';

const App: React.FC = () => {
  const [globalTargets, setGlobalTargets] = useState<TargetSettings>(INITIAL_TARGETS);
  const [employees, setEmployees] = useState<Employee[]>(MOCK_EMPLOYEES);
  const [selectedId, setSelectedId] = useState<string | 'global'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'team' | 'org' | 'setup' | 'directory'>('team');
  const [directoryIntent, setDirectoryIntent] = useState<'stats' | 'setup'>('setup');
  const [toast, setToast] = useState<string | null>(null);
  
  const [activeFilter, setActiveFilter] = useState<FilterType>(FilterType.MONTHLY);
  const [customRange, setCustomRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const filteredEmployees = useMemo(() => 
    employees.filter(emp => emp.name.toLowerCase().includes(searchQuery.toLowerCase())), 
    [employees, searchQuery]
  );

  const selectedEmployee = useMemo(() => 
    employees.find(e => e.id === selectedId), 
    [employees, selectedId]
  );

  const activeTargets = useMemo(() => {
    if (selectedId === 'global') return globalTargets;
    return selectedEmployee?.individualSettings || globalTargets;
  }, [selectedId, globalTargets, selectedEmployee]);

  const handleUpdate = (newSettings: TargetSettings) => {
    if (selectedId === 'global') {
      setGlobalTargets(newSettings);
    } else {
      setEmployees(prev => prev.map(e => 
        e.id === selectedId ? { ...e, individualSettings: newSettings } : e
      ));
    }
  };

  const handleSave = () => {
    setToast('Configuration Saved');
    setTimeout(() => setToast(null), 2500);
  };

  const handleReset = () => {
    if (selectedId !== 'global') {
      setEmployees(prev => prev.map(e => 
        e.id === selectedId ? { ...e, individualSettings: null } : e
      ));
      setToast('Reverted to system defaults');
      setTimeout(() => setToast(null), 2500);
    }
  };

  const navigateToIndividualStats = () => {
    if (selectedId === 'global') {
      setDirectoryIntent('stats');
      setActiveView('directory');
    } else {
      setActiveView('org');
    }
  };

  const navigateToIndividualConfig = () => {
    if (selectedId === 'global') {
      setDirectoryIntent('setup');
      setActiveView('directory');
    } else {
      setActiveView('setup');
    }
  };

  const handleEmployeeSelect = (id: string) => {
    setSelectedId(id);
    setActiveView(directoryIntent === 'stats' ? 'org' : 'setup');
  };

  return (
    <div className="min-h-screen bg-slate-50/30 flex text-slate-900 font-sans selection:bg-brand-blue/10 selection:text-brand-blue">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-slate-200/60 bg-white flex flex-col h-screen shrink-0 sticky top-0 z-40 shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10 group cursor-default">
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center group-hover:bg-brand-blue transition-colors shadow-md shadow-slate-200">
               <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span className="font-extrabold tracking-tight text-xl text-slate-900">LogiSales</span>
          </div>

          <nav className="space-y-9">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 px-2">Analytics</p>
              <div className="space-y-1.5">
                <button 
                  onClick={() => { setActiveView('team'); setSelectedId('global'); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeView === 'team' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  Team Insights
                </button>
                <button 
                  onClick={() => { setActiveView('org'); setSelectedId('global'); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeView === 'org' && selectedId === 'global' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  Org Stats
                </button>
                <button 
                  onClick={navigateToIndividualStats}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeView === 'org' && selectedId !== 'global' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Individual Stats
                </button>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4 px-2">Settings</p>
              <div className="space-y-1.5">
                <button 
                  onClick={() => { setActiveView('setup'); setSelectedId('global'); }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeView === 'setup' && selectedId === 'global' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                  Global Baseline
                </button>
                <button 
                  onClick={navigateToIndividualConfig}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeView === 'setup' && selectedId !== 'global' ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' : activeView === 'directory' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                >
                  <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  Individual Config
                </button>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden relative">
        {/* TOAST SYSTEM */}
        {toast && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4">
             <div className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-3 border border-slate-800">
               <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                 <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
               </div>
               {toast}
             </div>
          </div>
        )}

        {/* HEADER */}
        <header className="h-20 border-b border-slate-200/60 px-10 flex items-center justify-between bg-white shrink-0 z-30">
          <div className="flex items-center gap-6">
            {(selectedId !== 'global' || activeView === 'directory') && (
              <button 
                onClick={() => { setSelectedId('global'); setActiveView('team'); }} 
                className="group text-slate-400 hover:text-slate-900 text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <div className="p-1 rounded-md bg-slate-50 group-hover:bg-slate-100 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                </div>
                Exit Context
              </button>
            )}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest">Active Scope</span>
              <div className="h-4 w-px bg-slate-200"></div>
              <h1 className="text-sm font-bold text-slate-700">
                {activeView === 'directory' ? 'Select Team Member' : 
                 selectedId === 'global' ? 'Global Organization' : `${selectedEmployee?.name}`}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">System Status</p>
                <p className="text-[11px] font-bold text-emerald-600">Syncing Active</p>
             </div>
             <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs border border-slate-200">AD</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-[#fcfcfd] custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            
            {activeView === 'directory' ? (
              <div className="animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                      {directoryIntent === 'stats' ? 'Individual Stats' : 'Individual Configuration'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Select a member to view their {directoryIntent}.</p>
                  </div>
                  <div className="relative group">
                    <input 
                      type="text" placeholder="Search team member..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-72 pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all shadow-sm"
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-brand-blue transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredEmployees.map(emp => (
                    <button 
                      key={emp.id} 
                      onClick={() => handleEmployeeSelect(emp.id)}
                      className="group p-6 text-left bg-white border border-slate-200/60 rounded-2xl hover:border-slate-400 hover:shadow-xl hover:shadow-slate-200/50 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{emp.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{emp.role}</p>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-slate-200 group-hover:text-slate-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700 pb-20">
                <div className="flex items-center justify-between mb-12">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                      {activeView === 'team' ? 'Team Overview' : 
                       activeView === 'org' ? (selectedId === 'global' ? 'Org Statistics' : 'Individual Statistics') : 
                       'Configuration Settings'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {activeView === 'setup' ? 'Define specific targets and incentive tiers.' : 'Real-time performance and achievement tracking.'}
                    </p>
                  </div>
                  {selectedId !== 'global' && activeView === 'setup' && selectedEmployee?.individualSettings && (
                    <button 
                      onClick={handleReset} 
                      className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-[0.15em] border border-slate-200 px-5 py-2.5 rounded-xl bg-white hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      Reset to Defaults
                    </button>
                  )}
                </div>

                {activeView === 'org' || activeView === 'team' ? (
                  <>
                    <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} customRange={customRange} onRangeChange={setCustomRange} />
                    {activeView === 'org' ? (
                      <Dashboard settings={activeTargets} title={selectedId === 'global' ? 'Global' : selectedEmployee?.name || ''} filter={activeFilter} customRange={customRange} />
                    ) : (
                      <TeamPerformance employees={employees} globalSettings={globalTargets} filter={activeFilter} customRange={customRange} />
                    )}
                  </>
                ) : (
                  <SettingsPanel settings={activeTargets} onUpdate={handleUpdate} onSave={handleSave} />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-top { from { transform: translate(-50%, -15px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        .animate-in { animation: fade-in 0.5s ease-out; }
        .slide-in-from-top-4 { animation: slide-in-top 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default App;
