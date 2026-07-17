import { useState, useEffect } from 'react';
import {
  Dashboard,
  DashboardWidget,
  DashboardThemeType,
  WidgetType,
  DashboardComment,
  DashboardVersion,
  DashboardActivity
} from '../types/dashboard';
import dashboardService from '../services/dashboard.service';
import { useUIStore } from '../store';
import { api } from '../lib/api.ts';

export const useDashboard = (initialId: string = 'db-executive-financial') => {
  const { activeProject } = useUIStore();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [versions] = useState<DashboardVersion[]>([]);
  const [comments, setComments] = useState<DashboardComment[]>([]);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);

  // Canvas View Parameters
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  // Undo/Redo Stacks
  const [historyStack, setHistoryStack] = useState<DashboardWidget[][]>([]);
  const [redoStack, setRedoStack] = useState<DashboardWidget[][]>([]);

  const loadAllData = async () => {
    if (!activeProject) {
      setDashboards([]);
      setDashboard(null);
      return;
    }

    try {
      let list = await api.get('/api/dashboards', { projectId: String(activeProject.id) });
      if (!Array.isArray(list)) {
        list = [];
      }
      
      if (list.length === 0) {
        // Automatically seed a default executive dashboard if none exist!
        try {
          const seeded = await api.post('/api/dashboards', {
            projectId: activeProject.id,
            name: 'Executive KPI Cockpit',
            widgets: [
              {
                id: 'wdgt-kpi-rev',
                type: 'kpi',
                title: 'Gross Net Revenue',
                layout: { id: 'wdgt-kpi-rev', x: 0, y: 0, w: 4, h: 2 },
                properties: { kpiValue: '$110,300', kpiLabel: 'Total Gross Volume', kpiTrend: 14.8, kpiTrendDirection: 'up' }
              },
              {
                id: 'wdgt-kpi-margin',
                type: 'kpi',
                title: 'System Profit Margin',
                layout: { id: 'wdgt-kpi-margin', x: 4, y: 0, w: 4, h: 2 },
                properties: { kpiValue: '15.6%', kpiLabel: 'Weighted Margin Index', kpiTrend: -2.4, kpiTrendDirection: 'down' }
              }
            ]
          });
          list = [seeded];
        } catch (seedErr) {
          console.error("Failed to seed default dashboard:", seedErr);
        }
      }
      
      const mappedList: Dashboard[] = list.map((db: any) => ({
        id: String(db.id),
        name: db.name,
        description: 'Saved corporate KPI metrics, AutoML capacities, and telemetry indices.',
        theme: 'glass',
        version: 1,
        ownerId: 'devanshgautam0001@gmail.com',
        sharedUsers: [],
        createdAt: db.createdAt,
        updatedAt: db.updatedAt,
        widgets: (db.widgets || []) as DashboardWidget[],
        filters: []
      }));

      setDashboards(mappedList);

      const active = mappedList.find((db) => db.id === initialId) || mappedList[0] || null;
      setDashboard(active);

      if (active) {
        setHistoryStack([active.widgets]);
        setRedoStack([]);
      }

      if (mappedList.length > 0) {
        useUIStore.setState({ dashboardStatus: 'Completed' });
      } else {
        useUIStore.setState({ dashboardStatus: 'Not Started' });
      }
    } catch (err) {
      console.error("Failed to load dashboards from PostgreSQL:", err);
      // Fallback local initial seed dashboard if empty (but empty states are preferred)
      setDashboards([]);
      setDashboard(null);
    }

    setComments(dashboardService.getComments());
    setActivities(dashboardService.getActivities());
  };

  useEffect(() => {
    loadAllData();
  }, [initialId, activeProject]);

  const saveStateToHistory = (widgetsList: DashboardWidget[]) => {
    setHistoryStack((prev) => [...prev, widgetsList]);
    setRedoStack([]);
  };

  const selectDashboard = (id: string) => {
    const active = dashboards.find((d) => d.id === id);
    if (active) {
      setDashboard(active);
      setHistoryStack([active.widgets]);
      setRedoStack([]);
      setSelectedWidgetId(null);
    }
  };

  const createNewDashboard = async (name: string, _description: string, _theme: DashboardThemeType = 'glass') => {
    if (!activeProject) return;
    try {
      const newDB = await api.post('/api/dashboards', {
        projectId: activeProject.id,
        name,
        widgets: []
      });
      await loadAllData();
      selectDashboard(String(newDB.id));
    } catch (err) {
      console.error("Failed to create new dashboard in PostgreSQL:", err);
    }
  };

  const duplicateActiveDashboard = async () => {
    if (!dashboard || !activeProject) return;
    try {
      const newDB = await api.post('/api/dashboards', {
        projectId: activeProject.id,
        name: `${dashboard.name} (Copy)`,
        widgets: dashboard.widgets
      });
      await loadAllData();
      selectDashboard(String(newDB.id));
    } catch (err) {
      console.error("Failed to duplicate dashboard:", err);
    }
  };

  const deleteActiveDashboard = () => {
    // Client-side only or soft delete for local safety
    if (!dashboard) return;
    loadAllData();
  };

  // Undo / Redo engine
  const undo = () => {
    if (historyStack.length <= 1 || !dashboard) return;
    const current = historyStack[historyStack.length - 1];
    const previous = historyStack[historyStack.length - 2];

    setRedoStack((prev) => [current, ...prev]);
    setHistoryStack((prev) => prev.slice(0, prev.length - 1));

    const updated = { ...dashboard, widgets: previous };
    setDashboard(updated);

    if (activeProject) {
      api.post('/api/dashboards', {
        projectId: activeProject.id,
        name: dashboard.name,
        widgets: previous
      }).catch(err => console.error(err));
    }
  };

  const redo = () => {
    if (redoStack.length === 0 || !dashboard) return;
    const nextState = redoStack[0];

    setRedoStack((prev) => prev.slice(1));
    setHistoryStack((prev) => [...prev, nextState]);

    const updated = { ...dashboard, widgets: nextState };
    setDashboard(updated);

    if (activeProject) {
      api.post('/api/dashboards', {
        projectId: activeProject.id,
        name: dashboard.name,
        widgets: nextState
      }).catch(err => console.error(err));
    }
  };

  // Widget Actions
  const updateWidgetLayout = (id: string, x: number, y: number, w: number, h: number) => {
    if (!dashboard || !activeProject) return;

    const snappedX = Math.max(0, Math.min(11, Math.round(x)));
    const snappedW = Math.max(1, Math.min(12, Math.round(w)));
    const snappedY = Math.max(0, Math.round(y));
    const snappedH = Math.max(1, Math.round(h));

    const updatedWidgets = dashboard.widgets.map((widget) => {
      if (widget.id === id) {
        return {
          ...widget,
          layout: { ...widget.layout, x: snappedX, y: snappedY, w: snappedW, h: snappedH }
        };
      }
      return widget;
    });

    const updated = { ...dashboard, widgets: updatedWidgets };
    setDashboard(updated);
    saveStateToHistory(updatedWidgets);

    api.post('/api/dashboards', {
      projectId: activeProject.id,
      name: dashboard.name,
      widgets: updatedWidgets
    }).catch(err => console.error("Failed to save widget layout:", err));
  };

  const updateWidgetProperties = (id: string, props: any) => {
    if (!dashboard || !activeProject) return;

    const updatedWidgets = dashboard.widgets.map((widget) => {
      if (widget.id === id) {
        return {
          ...widget,
          properties: { ...widget.properties, ...props }
        };
      }
      return widget;
    });

    const updated = { ...dashboard, widgets: updatedWidgets };
    setDashboard(updated);
    saveStateToHistory(updatedWidgets);

    api.post('/api/dashboards', {
      projectId: activeProject.id,
      name: dashboard.name,
      widgets: updatedWidgets
    }).catch(err => console.error("Failed to save widget properties:", err));
  };

  const updateWidgetStyle = (id: string, style: any) => {
    if (!dashboard || !activeProject) return;

    const updatedWidgets = dashboard.widgets.map((widget) => {
      if (widget.id === id) {
        return {
          ...widget,
          style: { ...widget.style, ...style }
        };
      }
      return widget;
    });

    const updated = { ...dashboard, widgets: updatedWidgets };
    setDashboard(updated);
    saveStateToHistory(updatedWidgets);

    api.post('/api/dashboards', {
      projectId: activeProject.id,
      name: dashboard.name,
      widgets: updatedWidgets
    }).catch(err => console.error("Failed to save widget style:", err));
  };

  const addWidget = (type: WidgetType, title: string) => {
    if (!dashboard || !activeProject) return;

    const w = type === 'kpi' ? 3 : type.includes('Chart') || ['line', 'bar', 'area', 'scatter', 'pie'].includes(type) ? 6 : 4;
    const h = type === 'kpi' ? 2 : 4;

    let maxY = 0;
    dashboard.widgets.forEach((wdg) => {
      const bottom = wdg.layout.y + wdg.layout.h;
      if (bottom > maxY) maxY = bottom;
    });

    const newWdg: DashboardWidget = {
      id: `wdgt-${type}-${Date.now()}`,
      type,
      title,
      layout: {
        id: `wdgt-${type}-${Date.now()}`,
        x: 0,
        y: maxY,
        w,
        h
      },
      properties: {
        kpiValue: type === 'kpi' ? '$12,500' : undefined,
        kpiLabel: type === 'kpi' ? 'Standard Rate metric' : undefined,
        kpiTrend: type === 'kpi' ? 5.2 : undefined,
        kpiTrendDirection: type === 'kpi' ? 'up' : undefined,
        xKey: 'month',
        dataKeys: ['revenue', 'margin'],
        markdownContent: type === 'markdown' ? '### Markdown header\nUse markdown syntax here.' : undefined,
        textContent: type === 'text' ? 'Write text summaries.' : undefined,
        aiInsightText: type === 'aiInsight' ? 'AI Auto-generated executive observations.' : undefined
      }
    };

    const nextWidgets = [...dashboard.widgets, newWdg];
    const updated = { ...dashboard, widgets: nextWidgets };
    setDashboard(updated);
    saveStateToHistory(nextWidgets);

    api.post('/api/dashboards', {
      projectId: activeProject.id,
      name: dashboard.name,
      widgets: nextWidgets
    }).catch(err => console.error("Failed to save new widget:", err));
  };

  const deleteWidget = (id: string) => {
    if (!dashboard || !activeProject) return;

    const nextWidgets = dashboard.widgets.filter((w) => w.id !== id);
    const updated = { ...dashboard, widgets: nextWidgets };
    setDashboard(updated);
    saveStateToHistory(nextWidgets);

    if (selectedWidgetId === id) setSelectedWidgetId(null);

    api.post('/api/dashboards', {
      projectId: activeProject.id,
      name: dashboard.name,
      widgets: nextWidgets
    }).catch(err => console.error("Failed to delete widget:", err));
  };

  const changeTheme = (theme: DashboardThemeType) => {
    if (!dashboard) return;
    const updated = { ...dashboard, theme };
    setDashboard(updated);
  };

  const applyFilter = (filterId: string, value: any) => {
    if (!dashboard) return;
    const nextFilters = dashboard.filters.map((flt) => (flt.id === filterId ? { ...flt, value } : flt));
    const updated = { ...dashboard, filters: nextFilters };
    setDashboard(updated);
  };

  const saveSnapshotVersion = (_label: string) => {
    // Client-side snapshot wrapper
  };

  const restoreSnapshotVersion = (_ver: DashboardVersion) => {
    // Client-side snapshot restorer
  };

  const addNewComment = (text: string, widgetId?: string) => {
    dashboardService.addComment(text, widgetId);
    setComments(dashboardService.getComments());
  };

  const exportLayoutData = (format: 'json' | 'pdf' | 'pptx' | 'svg') => {
    if (!dashboard) return '';
    return dashboardService.exportDashboard(format, dashboard);
  };

  return {
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
    canUndo: historyStack.length > 1,
    canRedo: redoStack.length > 0,
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
  };
};
export default useDashboard;
