import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Palette,
  Copy,
  FolderOpen,
  Save,
  Check,
  ChevronDown
} from 'lucide-react';
import { Dashboard, DashboardThemeType } from '../../types/dashboard';

interface LayoutToolbarProps {
  activeDashboard: Dashboard | null;
  dashboards: Dashboard[];
  onSelectDashboard: (id: string) => void;
  onDuplicate: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onChangeZoom: (val: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onChangeTheme: (theme: DashboardThemeType) => void;
  onSaveSnapshot: (label: string) => void;
}

export const LayoutToolbar: React.FC<LayoutToolbarProps> = ({
  activeDashboard,
  dashboards,
  onSelectDashboard,
  onDuplicate,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onChangeZoom,
  isFullscreen,
  onToggleFullscreen,
  onChangeTheme,
  onSaveSnapshot
}) => {
  const [showThemeDrop, setShowThemeDrop] = useState(false);
  const [showVerModal, setShowVerModal] = useState(false);
  const [verLabel, setVerLabel] = useState('');

  const themesList: Array<{ id: DashboardThemeType; name: string; color: string }> = [
    { id: 'glass', name: 'Cosmic Glass', color: 'bg-zinc-800' },
    { id: 'midnight', name: 'Midnight Deep', color: 'bg-blue-900' },
    { id: 'cyberpunk', name: 'Cyberpunk Neon', color: 'bg-fuchsia-950' },
    { id: 'emerald', name: 'Forest Emerald', color: 'bg-emerald-950' },
    { id: 'nordic-light', name: 'Clean Light', color: 'bg-zinc-200' }
  ];

  const handleSaveVer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verLabel.trim()) return;
    onSaveSnapshot(verLabel.trim());
    setVerLabel('');
    setShowVerModal(false);
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-between p-3.5 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl gap-3 z-30">
      {/* Selector of active dashboards */}
      <div className="flex items-center space-x-2">
        <FolderOpen className="w-4 h-4 text-purple-400" />
        <select
          value={activeDashboard?.id || ''}
          onChange={(e) => onSelectDashboard(e.target.value)}
          className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer border-b border-transparent hover:border-purple-500 pb-0.5 pr-2"
        >
          {dashboards.map((d) => (
            <option key={d.id} value={d.id} className="bg-zinc-950 text-white">
              {d.name}
            </option>
          ))}
        </select>

        {/* Quick Duplicate helper */}
        <button
          onClick={onDuplicate}
          className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          title="Duplicate active dashboard template"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Undo/Redo & Zoom utilities */}
      <div className="flex items-center space-x-4">
        {/* Undo Redo step */}
        <div className="flex items-center space-x-1.5 border-r border-white/5 pr-4">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded bg-white/[0.01] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-35 transition-all cursor-pointer"
            title="Undo layout modification"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded bg-white/[0.01] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-35 transition-all cursor-pointer"
            title="Redo layout modification"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom adjustment triggers */}
        <div className="flex items-center space-x-1 border-r border-white/5 pr-4 font-mono text-[11px] text-zinc-400 font-medium">
          <button
            onClick={() => onChangeZoom(Math.max(60, zoom - 10))}
            className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center select-none">{zoom}%</span>
          <button
            onClick={() => onChangeZoom(Math.min(120, zoom + 10))}
            className="p-1.5 rounded hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fullscreen view switcher */}
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 rounded bg-white/[0.01] border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          title="Toggle Fullscreen display"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Themes and Save snapshot buttons */}
      <div className="flex items-center space-x-2.5 relative">
        {/* Dynamic Theme skin select dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemeDrop(!showThemeDrop)}
            className="flex items-center space-x-1.5 bg-white/[0.01] border border-white/5 hover:border-purple-500/40 rounded-lg px-2.5 py-1.5 text-zinc-300 hover:text-white text-[11px] font-semibold transition-all cursor-pointer"
          >
            <Palette className="w-3.5 h-3.5 text-purple-400" />
            <span>Aesthetics skin</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showThemeDrop && (
            <div className="absolute right-0 mt-2 w-44 bg-zinc-950 border border-white/10 rounded-xl p-1.5 shadow-xl z-50 animate-fade-in space-y-0.5">
              {themesList.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    onChangeTheme(t.id);
                    setShowThemeDrop(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-left hover:bg-white/5 text-[11px] font-medium text-zinc-300 hover:text-white transition-colors`}
                >
                  <div className={`w-3 h-3 rounded-full border border-white/10 ${t.color}`} />
                  <span>{t.name}</span>
                  {activeDashboard?.theme === t.id && <Check className="w-3.5 h-3.5 ml-auto text-purple-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create Snapshot Version trigger */}
        <button
          onClick={() => setShowVerModal(true)}
          className="flex items-center space-x-1.5 bg-purple-500 hover:bg-purple-600 active:scale-95 text-white rounded-lg px-3 py-1.5 text-[11px] font-semibold shadow-md transition-all cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Version</span>
        </button>

        {/* Inline save version Modal */}
        {showVerModal && (
          <div className="absolute right-0 top-11 w-64 bg-zinc-950 border border-white/10 rounded-2xl p-4 shadow-2xl z-50 space-y-3 animate-fade-in">
            <h5 className="font-bold text-white text-xs uppercase tracking-wide">Record Layout Snapshot</h5>
            <p className="text-[10px] text-zinc-500 leading-normal">
              Freeze current coordinates and datasets. You can review and restore back to this snapshot anytime.
            </p>
            <form onSubmit={handleSaveVer} className="space-y-3">
              <input
                type="text"
                placeholder="v1.2 - Release configuration"
                value={verLabel}
                onChange={(e) => setVerLabel(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-md px-2.5 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-purple-500"
                required
              />
              <div className="flex justify-end space-x-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowVerModal(false)}
                  className="px-2.5 py-1 rounded bg-white/5 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default LayoutToolbar;
