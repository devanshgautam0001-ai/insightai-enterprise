import React, { useState } from 'react';
import {
  LayoutGrid,
  Download,
  Trash2,
  Plus,
  Tv
} from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { useWidgets } from '../../hooks/useWidgets';
import { GridCanvas } from '../../components/dashboardbuilder/GridCanvas';
import { WidgetLibrary } from './WidgetLibrary';
import { PropertyPanel } from '../../components/dashboardbuilder/PropertyPanel';
import { LayoutToolbar } from '../../components/dashboardbuilder/LayoutToolbar';
import { FilterPanel } from '../../components/dashboardbuilder/FilterPanel';
import { WidgetSettings } from '../../components/dashboardbuilder/WidgetSettings';
import { DashboardPreview } from '../../components/dashboardbuilder/DashboardPreview';
import { VersionHistory } from '../../components/dashboardbuilder/VersionHistory';
import { CommentPanel } from '../../components/dashboardbuilder/CommentPanel';
import { ActivityTimeline } from '../../components/dashboardbuilder/ActivityTimeline';
import { LayoutManager } from './LayoutManager';
import { ThemeManager } from './ThemeManager';
import { ShareDashboard } from './ShareDashboard';

export const DashboardBuilder: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'collaboration' | 'presets'>('canvas');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [exportDrop, setExportDrop] = useState(false);
  const [showNewDbModal, setShowNewDbModal] = useState(false);
  const [newDbName, setNewDbName] = useState('');
  const [newDbDesc, setNewDbDesc] = useState('');

  // Primary hook orchestrators
  const {
    dashboard,
    dashboards,
    versions,
    comments,
    activities,
    zoom,
    isFullscreen,
    selectedWidgetId,
    setZoom,
    setIsFullscreen,
    setSelectedWidgetId,
    selectDashboard,
    createNewDashboard,
    duplicateActiveDashboard,
    deleteActiveDashboard,
    undo,
    redo,
    canUndo,
    canRedo,
    updateWidgetLayout,
    updateWidgetProperties,
    updateWidgetStyle,
    addWidget,
    deleteWidget,
    changeTheme,
    applyFilter,
    saveSnapshotVersion,
    restoreSnapshotVersion,
    addNewComment,
    exportLayoutData
  } = useDashboard();

  // Selected widget object lookup
  const selectedWidget = dashboard?.widgets.find((w) => w.id === selectedWidgetId) || null;

  // Real-time live simulations (autopolling speed is 3s)
  const {
    timeseriesData,
    scatterplotData,
    heatmapData,
    kpiRevenue,
    kpiMargin,
    kpiLoad,
    isWebSocketActive
  } = useWidgets(3, true);

  // Layout arrangement presets applier
  const handleApplyPreset = (preset: 'executive' | 'operations' | 'sandbox') => {
    if (!dashboard) return;

    if (preset === 'sandbox') {
      updateWidgetLayout(dashboard.widgets[0]?.id || '', 0, 0, 1, 1); // trigger state reset
      dashboard.widgets = [];
      saveSnapshotVersion('Clean sandbox canvas');
    } else if (preset === 'executive') {
      // Set to standard executive layout template
      const execWidgets = [
        {
          id: 'wdgt-kpi-rev',
          type: 'kpi' as const,
          title: 'Gross Net Revenue',
          layout: { id: 'wdgt-kpi-rev', x: 0, y: 0, w: 3, h: 2 },
          properties: { kpiValue: '$110,300', kpiLabel: 'Total Gross Volume', kpiTrend: 14.8, kpiTrendDirection: 'up' as const }
        },
        {
          id: 'wdgt-kpi-margin',
          type: 'kpi' as const,
          title: 'System Profit Margin',
          layout: { id: 'wdgt-kpi-margin', x: 3, y: 0, w: 3, h: 2 },
          properties: { kpiValue: '15.6%', kpiLabel: 'Weighted Margin Index', kpiTrend: -2.4, kpiTrendDirection: 'down' as const }
        },
        {
          id: 'wdgt-line-perf',
          type: 'line' as const,
          title: 'Performance Growth Delta',
          layout: { id: 'wdgt-line-perf', x: 0, y: 2, w: 6, h: 4 },
          properties: { xKey: 'month', dataKeys: ['revenue', 'cost'] }
        },
        {
          id: 'wdgt-bar-seg',
          type: 'bar' as const,
          title: 'Segment Contributions Weights',
          layout: { id: 'wdgt-bar-seg', x: 6, y: 2, w: 6, h: 4 },
          properties: { xKey: 'name', dataKeys: ['value'] }
        }
      ];
      dashboard.widgets = execWidgets;
      saveSnapshotVersion('Reset Executive Summary Arrangement');
    } else if (preset === 'operations') {
      // Dense layout
      const opsWidgets = [
        {
          id: 'wdgt-map-terminals',
          type: 'map' as const,
          title: 'Physical Latency sites',
          layout: { id: 'wdgt-map-terminals', x: 0, y: 0, w: 4, h: 4 },
          properties: { mapCenter: [37.7749, -122.4194] as [number, number], mapMarkers: [{ lat: 37.77, lng: -122.41, label: 'HQ SF' }] }
        },
        {
          id: 'wdgt-tbl-ledger',
          type: 'table' as const,
          title: 'Growth ledger log table',
          layout: { id: 'wdgt-tbl-ledger', x: 4, y: 0, w: 8, h: 4 },
          properties: { tableColumns: ['segment', 'revenue', 'margin'], tableData: [] }
        }
      ];
      dashboard.widgets = opsWidgets;
      saveSnapshotVersion('Reset Dense Operations Arrangement');
    }
  };

  const handleExport = (format: 'json' | 'pdf' | 'pptx' | 'svg') => {
    const data = exportLayoutData(format);
    const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enterprise-dashboard-${dashboard?.id || 'export'}.${format === 'pptx' ? 'txt' : format}`;
    link.click();
    setExportDrop(false);
  };

  const handleCreateDb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDbName.trim()) return;
    createNewDashboard(newDbName.trim(), newDbDesc.trim());
    setNewDbName('');
    setNewDbDesc('');
    setShowNewDbModal(false);
  };

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[350px] p-8 text-center bg-zinc-950/40 border border-white/5 rounded-2xl backdrop-blur-xl">
        <span className="text-xl animate-spin text-purple-400 mr-2">⚙️</span>
        <span className="text-zinc-400 font-mono text-xs">Booting layout engines...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Floating Workspace Title card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 bg-zinc-950/40 border border-white/5 rounded-2xl backdrop-blur-xl gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg p-2 shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight">{dashboard.name}</h1>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono text-[9px] uppercase tracking-wider font-semibold">
                  Active Cockpit Builder
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">{dashboard.description}</p>
            </div>
          </div>
        </div>

        {/* Global actions row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* New Dashboard Trigger */}
          <button
            onClick={() => setShowNewDbModal(true)}
            className="flex items-center space-x-1.5 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-purple-500/30 rounded-xl px-3.5 py-2 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-purple-400" />
            <span>New Grid Board</span>
          </button>

          {/* Preset templates modal triggers */}
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center space-x-1.5 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-purple-500/30 rounded-xl px-3.5 py-2 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <Tv className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>TV Presentation</span>
          </button>

          {/* Export structures list selection dropdown */}
          <div className="relative">
            <button
              onClick={() => setExportDrop(!exportDrop)}
              className="flex items-center space-x-1.5 bg-white/[0.01] hover:bg-white/[0.04] border border-white/5 hover:border-purple-500/30 rounded-xl px-3.5 py-2 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-purple-400" />
              <span>Export Layout</span>
            </button>

            {exportDrop && (
              <div className="absolute right-0 mt-2 w-44 bg-zinc-950 border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 animate-fade-in space-y-0.5">
                {[
                  { id: 'json', label: 'Export JSON Layout' },
                  { id: 'svg', label: 'Export vector SVG image' },
                  { id: 'pptx', label: 'Export PowerPoint outline' },
                  { id: 'pdf', label: 'Export Strategy PDF' }
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => handleExport(format.id as any)}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick delete trigger */}
          {dashboards.length > 1 && (
            <button
              onClick={deleteActiveDashboard}
              className="p-2 border border-white/5 bg-white/[0.01] hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 rounded-xl transition-all"
              title="Delete current board layout"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Global Filter panel */}
      <FilterPanel filters={dashboard.filters} onApplyFilter={applyFilter} />

      {/* Layout management controls toolbar */}
      <LayoutToolbar
        activeDashboard={dashboard}
        dashboards={dashboards}
        onSelectDashboard={selectDashboard}
        onDuplicate={duplicateActiveDashboard}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        zoom={zoom}
        onChangeZoom={setZoom}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onChangeTheme={changeTheme}
        onSaveSnapshot={saveSnapshotVersion}
      />

      {/* Main Grid Canvas layout workspace */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* Left column: Catalog options, Presets, sharing */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-5">
          {/* Tab switches */}
          <div className="grid grid-cols-3 gap-1 bg-zinc-950/40 border border-white/5 p-1 rounded-xl">
            {[
              { id: 'canvas', label: 'Assets' },
              { id: 'collaboration', label: 'Teamwork' },
              { id: 'presets', label: 'Templates' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors text-center ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'canvas' && (
            <WidgetLibrary onAddWidget={addWidget} />
          )}

          {activeTab === 'presets' && (
            <div className="space-y-5">
              <LayoutManager onApplyPreset={handleApplyPreset} />
              <ThemeManager activeTheme={dashboard.theme} onChangeTheme={changeTheme} />
            </div>
          )}

          {activeTab === 'collaboration' && (
            <div className="space-y-5">
              <ShareDashboard
                sharedUsers={dashboard.sharedUsers}
                onAddUser={(email, role) => {
                  const updated = {
                    ...dashboard,
                    sharedUsers: [...dashboard.sharedUsers, { email, role }]
                  };
                  updateWidgetLayout(dashboard.widgets[0]?.id || '', 0, 0, 1, 1); // trigger state refresh
                  dashboard.sharedUsers = updated.sharedUsers;
                  saveSnapshotVersion(`Authorized collaborator: ${email}`);
                }}
                onRemoveUser={(email) => {
                  const updated = {
                    ...dashboard,
                    sharedUsers: dashboard.sharedUsers.filter((u) => u.email !== email)
                  };
                  dashboard.sharedUsers = updated.sharedUsers;
                  saveSnapshotVersion(`Revoked access for: ${email}`);
                }}
              />
              <CommentPanel comments={comments} onAddComment={(text) => addNewComment(text)} />
            </div>
          )}
        </div>

        {/* Center Canvas workspace */}
        <div className="col-span-12 xl:col-span-6 min-h-[450px]">
          <GridCanvas
            widgets={dashboard.widgets}
            selectedWidgetId={selectedWidgetId}
            onSelectWidget={setSelectedWidgetId}
            onDeleteWidget={deleteWidget}
            onLayoutChange={updateWidgetLayout}
            zoom={zoom}
            liveValues={{
              kpiRevenue,
              kpiMargin,
              kpiLoad,
              timeseriesData,
              scatterplotData,
              heatmapData,
              isWebSocketActive
            }}
          />
        </div>

        {/* Right column: Config settings inspector */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-5">
          <PropertyPanel
            widget={selectedWidget}
            onUpdateProperties={updateWidgetProperties}
            onUpdateStyle={updateWidgetStyle}
          />
          <WidgetSettings
            widget={selectedWidget}
            onUpdateProperties={updateWidgetProperties}
          />
          <VersionHistory versions={versions} onRestore={restoreSnapshotVersion} />
          <ActivityTimeline activities={activities} />
        </div>
      </div>

      {/* Fullscreen TV presentation Dialog */}
      {isPreviewOpen && (
        <DashboardPreview
          dashboard={dashboard}
          onClose={() => setIsPreviewOpen(false)}
          liveValues={{
            kpiRevenue,
            kpiMargin,
            kpiLoad,
            timeseriesData,
            scatterplotData,
            heatmapData,
            isWebSocketActive
          }}
        />
      )}

      {/* Inline Create Dashboard Modal dialog */}
      {showNewDbModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in text-xs">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Configure new Dashboard</h4>
            <form onSubmit={handleCreateDb} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">Dashboard name</label>
                <input
                  type="text"
                  placeholder="Sales Conversion Board"
                  value={newDbName}
                  onChange={(e) => setNewDbName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">Aesthetic summary descriptor</label>
                <textarea
                  placeholder="Monitors active physical load capacities vs regional marketing expenses."
                  value={newDbDesc}
                  onChange={(e) => setNewDbDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setShowNewDbModal(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-md"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardBuilder;
