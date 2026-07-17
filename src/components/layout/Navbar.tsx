import React from 'react';
import { Bell, Search, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store';

export const Navbar: React.FC = () => {
  const {
    activeWorkspace,
    isSearchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    isCopilotOpen,
    setCopilotOpen,
    showNotifications,
    setShowNotifications,
    notifications,
    userEmail,
    activeProject,
    activeDataset,
    trainedModel,
    isTraining,
    trainingProgress,
    cleaningStatus
  } = useUIStore();

  // Dynamic pipeline status calculations
  let pipelineStatus = 'Awaiting Ingestion';
  if (activeDataset) {
    if (cleaningStatus === 'Completed') {
      if (trainedModel) {
        pipelineStatus = 'Model Deployed';
      } else {
        pipelineStatus = 'Prepared / Ready';
      }
    } else {
      pipelineStatus = 'Ingested / Profiling';
    }
  }

  return (
    <header className="glass-nav sticky top-0 z-30 px-8 py-4 flex items-center justify-between">
      {/* Left Breadcrumb path & Pipeline Indicators */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">WS:</span>
          <span className="text-zinc-200 font-bold uppercase">
            {activeWorkspace ? activeWorkspace.name : 'UNASSIGNED'}
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-500">PROJ:</span>
          <span className="text-zinc-200 font-bold uppercase truncate max-w-[140px]" title={activeProject?.name || ''}>
            {activeProject ? activeProject.name : 'UNASSIGNED'}
          </span>
        </div>

        {/* Dynamic status chips */}
        <div className="hidden lg:flex items-center gap-2 border-l border-white/10 pl-4 py-1">
          {/* Dataset Status */}
          <div className="bg-white/[0.02] border border-white/5 rounded px-2 py-1 text-[9px] text-zinc-400">
            DATASET: <span className={activeDataset ? "text-emerald-400 font-semibold" : "text-zinc-500"}>
              {activeDataset ? activeDataset.name : 'NO DATASET'}
            </span>
          </div>

          {/* Training Status */}
          <div className="bg-white/[0.02] border border-white/5 rounded px-2 py-1 text-[9px] text-zinc-400">
            TRAINING: <span className={trainedModel ? "text-purple-400 font-semibold animate-pulse" : "text-zinc-500"}>
              {trainedModel ? `SAVED (${((trainedModel.accuracy ?? 0) * 100).toFixed(1)}%)` : (isTraining ? `TRAINING ${trainingProgress}%` : 'OFFLINE')}
            </span>
          </div>

          {/* Pipeline Status */}
          <div className="bg-white/[0.02] border border-white/5 rounded px-2 py-1 text-[9px] text-zinc-400">
            PIPELINE: <span className={`font-semibold ${activeDataset ? 'text-blue-400' : 'text-zinc-500'}`}>
              {pipelineStatus.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Right Global Action Controls */}
      <div className="flex items-center gap-4">
        {/* Search query box wrapper */}
        <div className="relative">
          <button
            onClick={() => setSearchOpen(!isSearchOpen)}
            className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all text-zinc-400 hover:text-white"
          >
            <Search className="w-4 h-4" />
          </button>
          {isSearchOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl glass-card p-2 border border-white/10 z-50 shadow-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets, models, columns..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-brand-accent/50"
              />
            </div>
          )}
        </div>

        {/* Grounded Copilot trigger button */}
        <button
          onClick={() => setCopilotOpen(!isCopilotOpen)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 uppercase ${
            isCopilotOpen
              ? 'bg-brand-intel text-white shadow-lg shadow-blue-500/20'
              : 'bg-white/[0.03] border border-white/10 text-brand-intel hover:bg-white/[0.08]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Copilot Chat
        </button>

        {/* Notifications trigger bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all text-zinc-400 hover:text-white relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl glass-card p-4 border border-white/10 z-50 shadow-2xl text-left">
              <p className="text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">System Log Notifications</p>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="border-b border-white/5 pb-2 last:border-b-0">
                    <p className="text-xs font-bold text-zinc-200">{n.title}</p>
                    <p className="text-[10px] text-zinc-400">{n.description}</p>
                    <p className="text-[9px] text-zinc-600 font-mono mt-0.5">{n.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Account Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-accent to-brand-success flex items-center justify-center font-display font-bold text-xs">
            IA
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold">Principal Analyst</p>
            <p className="text-[9px] text-zinc-500 font-mono">{userEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
