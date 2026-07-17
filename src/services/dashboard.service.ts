import {
  Dashboard,
  DashboardTheme,
  DashboardThemeType,
  DashboardComment,
  DashboardVersion,
  DashboardActivity
} from '../types/dashboard';

const STORAGE_KEYS = {
  DASHBOARDS: 'enterprise_dashboards_v1',
  COMMENTS: 'enterprise_dashboard_comments_v1',
  VERSIONS: 'enterprise_dashboard_versions_v1',
  ACTIVITIES: 'enterprise_dashboard_activities_v1'
};

export const THEMES: Record<DashboardThemeType, DashboardTheme> = {
  glass: {
    id: 'glass',
    name: 'Cosmic Glass (Default)',
    background: 'bg-zinc-950 text-white',
    cardBg: 'bg-white/[0.01] border-white/5 backdrop-blur-md',
    textPrimary: 'text-white',
    textSecondary: 'text-zinc-400',
    accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    borderColor: 'border-white/5',
    glassEffect: 'backdrop-blur-xl bg-white/[0.02]'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Deep Blue',
    background: 'bg-[#030712] text-slate-100',
    cardBg: 'bg-[#1f2937]/30 border-blue-500/10 backdrop-blur-md',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    accent: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    borderColor: 'border-slate-800',
    glassEffect: 'bg-[#0f172a]/80'
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    background: 'bg-[#090514] text-[#f0f0f0]',
    cardBg: 'bg-[#1a0c2e]/40 border-pink-500/20 backdrop-blur-sm',
    textPrimary: 'text-[#00ffcc]',
    textSecondary: 'text-purple-300',
    accent: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    borderColor: 'border-pink-500/15',
    glassEffect: 'bg-[#130624]/60'
  },
  emerald: {
    id: 'emerald',
    name: 'Forest Emerald',
    background: 'bg-[#021c15] text-[#ecfdf5]',
    cardBg: 'bg-[#064e3b]/20 border-emerald-500/20 backdrop-blur-md',
    textPrimary: 'text-[#34d399]',
    textSecondary: 'text-[#a7f3d0]/60',
    accent: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    borderColor: 'border-emerald-500/10',
    glassEffect: 'bg-[#022c22]/50'
  },
  'nordic-light': {
    id: 'nordic-light',
    name: 'Clean Slate Light',
    background: 'bg-[#f4f4f5] text-zinc-900',
    cardBg: 'bg-white border-zinc-200 shadow-sm',
    textPrimary: 'text-zinc-900',
    textSecondary: 'text-zinc-500',
    accent: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    borderColor: 'border-zinc-200',
    glassEffect: 'bg-white/90 shadow-sm'
  }
};

// Mock Corporate KPI / Analytics Datasets
export const MOCK_DATA = {
  timeseries: [
    { month: 'Jan', revenue: 45000, margin: 12.5, signups: 120, satisfaction: 88, cost: 2300 },
    { month: 'Feb', revenue: 52000, margin: 14.2, signups: 145, satisfaction: 89, cost: 2400 },
    { month: 'Mar', revenue: 61000, margin: 13.8, signups: 190, satisfaction: 91, cost: 2800 },
    { month: 'Apr', revenue: 58000, margin: 15.0, signups: 175, satisfaction: 90, cost: 2700 },
    { month: 'May', revenue: 73000, margin: 16.5, signups: 240, satisfaction: 93, cost: 3100 },
    { month: 'Jun', revenue: 89000, margin: 17.1, signups: 310, satisfaction: 95, cost: 3500 },
    { month: 'Jul', revenue: 102000, margin: 18.0, signups: 380, satisfaction: 94, cost: 4200 }
  ],
  segments: [
    { name: 'Enterprise', value: 45, transactions: 1540, satisfaction: 96 },
    { name: 'Mid-Market', value: 30, transactions: 1120, satisfaction: 92 },
    { name: 'SMB', value: 15, transactions: 840, satisfaction: 85 },
    { name: 'SOHO', value: 10, transactions: 430, satisfaction: 81 }
  ],
  heatmap: [
    { day: 'Mon', hour: '9 AM', load: 45, latency: 120 },
    { day: 'Mon', hour: '12 PM', load: 85, latency: 240 },
    { day: 'Mon', hour: '3 PM', load: 75, latency: 190 },
    { day: 'Tue', hour: '9 AM', load: 50, latency: 130 },
    { day: 'Tue', hour: '12 PM', load: 92, latency: 290 },
    { day: 'Tue', hour: '3 PM', load: 80, latency: 210 },
    { day: 'Wed', hour: '9 AM', load: 55, latency: 145 },
    { day: 'Wed', hour: '12 PM', load: 88, latency: 250 },
    { day: 'Wed', hour: '3 PM', load: 78, latency: 200 }
  ],
  scatterplot: [
    { spend: 1200, clicks: 140, sales: 12, costPerAcq: 100 },
    { spend: 1800, clicks: 230, sales: 22, costPerAcq: 81 },
    { spend: 2200, clicks: 310, sales: 34, costPerAcq: 64 },
    { spend: 3100, clicks: 450, sales: 49, costPerAcq: 63 },
    { spend: 4000, clicks: 580, sales: 62, costPerAcq: 64 },
    { spend: 4500, clicks: 690, sales: 85, costPerAcq: 52 },
    { spend: 5200, clicks: 810, sales: 98, costPerAcq: 53 }
  ],
  forecast: [
    { date: 'Aug', actual: null, projected: 112000 },
    { date: 'Sep', actual: null, projected: 124000 },
    { date: 'Oct', actual: null, projected: 131000 },
    { date: 'Nov', actual: null, projected: 145000 },
    { date: 'Dec', actual: null, projected: 160000 }
  ],
  radar: [
    { subject: 'Reliability', A: 99, B: 80, fullMark: 100 },
    { subject: 'Speed', A: 85, B: 90, fullMark: 100 },
    { subject: 'Ease of Use', A: 92, B: 75, fullMark: 100 },
    { subject: 'Integration', A: 78, B: 85, fullMark: 100 },
    { subject: 'Pricing', A: 70, B: 95, fullMark: 100 }
  ],
  treemap: [
    { name: 'North America', size: 500, color: '#c084fc' },
    { name: 'Europe', size: 350, color: '#60a5fa' },
    { name: 'Asia-Pacific', size: 280, color: '#34d399' },
    { name: 'Latin America', size: 120, color: '#f472b6' }
  ],
  mapMarkers: [
    { lat: 37.7749, lng: -122.4194, label: 'HQ (San Francisco)' },
    { lat: 40.7128, lng: -74.0060, label: 'East Coast Operations (New York)' },
    { lat: 51.5074, lng: -0.1278, label: 'EMEA Terminal (London)' },
    { lat: 35.6762, lng: 139.6503, label: 'APAC Hub (Tokyo)' }
  ],
  tableData: [
    { id: '101', segment: 'Enterprise', tier: 'Tier-1 Premium', revenue: '$45,000', margin: '18.0%', satisfaction: '98%' },
    { id: '102', segment: 'Enterprise', tier: 'Tier-2 Scale', revenue: '$32,400', margin: '16.5%', satisfaction: '94%' },
    { id: '103', segment: 'Mid-Market', tier: 'Growth Core', revenue: '$28,100', margin: '15.0%', satisfaction: '91%' },
    { id: '104', segment: 'Mid-Market', tier: 'Basic Growth', revenue: '$14,500', margin: '14.0%', satisfaction: '88%' },
    { id: '105', segment: 'SMB', tier: 'Standard', revenue: '$12,200', margin: '11.0%', satisfaction: '85%' }
  ]
};

const DEFAULT_DASHBOARD: Dashboard = {
  id: 'db-executive-financial',
  name: 'Executive Performance Ledger',
  description: 'Enterprise revenue tracker, AutoML capacity bounds, and multi-segment operational health indices.',
  theme: 'glass',
  version: 1,
  ownerId: 'devanshgautam0001@gmail.com',
  sharedUsers: [
    { email: 'devanshgautam0001@gmail.com', role: 'admin' },
    { email: 'analyst@enterprise.io', role: 'editor' },
    { email: 'executive-board@enterprise.io', role: 'viewer' }
  ],
  createdAt: '10:00 AM',
  updatedAt: '10:30 AM',
  filters: [
    { id: 'fltr-daterange', type: 'dateRange', label: 'Fiscal Interval', column: 'month', value: 'Q3-2026', active: true },
    { id: 'fltr-segment', type: 'dropdown', label: 'Sector Focus', column: 'segment', value: 'All Segments', options: ['All Segments', 'Enterprise', 'Mid-Market', 'SMB'], active: true }
  ],
  widgets: [
    {
      id: 'wdgt-kpi-rev',
      type: 'kpi',
      title: 'Net Operational Revenue',
      layout: { id: 'wdgt-kpi-rev', x: 0, y: 0, w: 3, h: 2 },
      properties: {
        kpiValue: '$110,300',
        kpiLabel: 'Total Gross Volume',
        kpiTrend: 14.8,
        kpiTrendDirection: 'up'
      }
    },
    {
      id: 'wdgt-kpi-margin',
      type: 'kpi',
      title: 'Corporate Margin Rate',
      layout: { id: 'wdgt-kpi-margin', x: 3, y: 0, w: 3, h: 2 },
      properties: {
        kpiValue: '15.6%',
        kpiLabel: 'Weighted Margin Index',
        kpiTrend: -2.4,
        kpiTrendDirection: 'down'
      }
    },
    {
      id: 'wdgt-kpi-sat',
      type: 'kpi',
      title: 'Active NPS Score',
      layout: { id: 'wdgt-kpi-sat', x: 6, y: 0, w: 3, h: 2 },
      properties: {
        kpiValue: '93.5',
        kpiLabel: 'Customer Satisfaction Index',
        kpiTrend: 4.1,
        kpiTrendDirection: 'up'
      }
    },
    {
      id: 'wdgt-kpi-forecast',
      type: 'kpi',
      title: 'AI Run-Rate Estimate',
      layout: { id: 'wdgt-kpi-forecast', x: 9, y: 0, w: 3, h: 2 },
      properties: {
        kpiValue: '$145,000',
        kpiLabel: 'Projected Q4 Exit Runway',
        kpiTrend: 22.0,
        kpiTrendDirection: 'up'
      }
    },
    {
      id: 'wdgt-line-perf',
      type: 'line',
      title: 'Revenue Expansion Dynamics',
      layout: { id: 'wdgt-line-perf', x: 0, y: 2, w: 6, h: 4 },
      properties: {
        xKey: 'month',
        dataKeys: ['revenue', 'cost']
      }
    },
    {
      id: 'wdgt-bar-seg',
      type: 'bar',
      title: 'Sector Volume Contributions',
      layout: { id: 'wdgt-bar-seg', x: 6, y: 2, w: 6, h: 4 },
      properties: {
        xKey: 'name',
        dataKeys: ['value']
      }
    },
    {
      id: 'wdgt-map-terminals',
      type: 'map',
      title: 'Active Physical Latency Nodes',
      layout: { id: 'wdgt-map-terminals', x: 0, y: 6, w: 4, h: 4 },
      properties: {
        mapCenter: [37.7749, -122.4194],
        mapMarkers: MOCK_DATA.mapMarkers
      }
    },
    {
      id: 'wdgt-tbl-ledger',
      type: 'table',
      title: 'High-Value Segment Ledger',
      layout: { id: 'wdgt-tbl-ledger', x: 4, y: 6, w: 5, h: 4 },
      properties: {
        tableColumns: ['segment', 'tier', 'revenue', 'margin', 'satisfaction'],
        tableData: MOCK_DATA.tableData
      }
    },
    {
      id: 'wdgt-ai-insights',
      type: 'aiInsight',
      title: 'Proactive AI Audit Insight',
      layout: { id: 'wdgt-ai-insights', x: 9, y: 6, w: 3, h: 4 },
      properties: {
        aiInsightText: 'Analysis detected Q3 margins slipped -2.4% due to peak EMEA physical gateway latencies. We advise shifting edge route allocations via scikit parameters in AutoML pipeline immediately.'
      }
    }
  ]
};

const DEFAULT_COMMENTS: DashboardComment[] = [
  {
    id: 'cmnt-1',
    widgetId: 'wdgt-kpi-margin',
    author: 'analyst@enterprise.io',
    text: 'Why did corporate margin rates slip by -2.4%? Is this caused by the peak EMEA shipping cost surge?',
    timestamp: '10:15 AM'
  },
  {
    id: 'cmnt-2',
    widgetId: 'wdgt-kpi-margin',
    author: 'devanshgautam0001@gmail.com',
    text: '@analyst@enterprise.io I ran a Python correlation sandbox. Indeed, EMEA physical latency nodes show heavy latency peaks, spiking customer acquisition expenses.',
    timestamp: '10:22 AM',
    mentions: ['analyst@enterprise.io']
  }
];

class DashboardService {
  private isLoaded = false;

  private initializeStorage() {
    if (this.isLoaded) return;
    
    if (!localStorage.getItem(STORAGE_KEYS.DASHBOARDS)) {
      localStorage.setItem(STORAGE_KEYS.DASHBOARDS, JSON.stringify([DEFAULT_DASHBOARD]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMENTS)) {
      localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(DEFAULT_COMMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VERSIONS)) {
      const initVersion: DashboardVersion = {
        id: `ver-${DEFAULT_DASHBOARD.id}-1`,
        dashboardId: DEFAULT_DASHBOARD.id,
        versionNumber: 1,
        label: 'Initial Layout Base',
        layout: DEFAULT_DASHBOARD.widgets,
        theme: DEFAULT_DASHBOARD.theme,
        filters: DEFAULT_DASHBOARD.filters,
        createdAt: new Date().toLocaleTimeString(),
        author: 'devanshgautam0001@gmail.com'
      };
      localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify([initVersion]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
      const initActivity: DashboardActivity = {
        id: `act-${Date.now()}`,
        userId: 'devanshgautam0001@gmail.com',
        userName: 'Devansh Gautam',
        action: 'CREATED_DASHBOARD',
        details: 'Provisioned Executive Performance Ledger base template',
        timestamp: new Date().toLocaleTimeString()
      };
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify([initActivity]));
    }

    this.isLoaded = true;
  }

  getDashboards(): Dashboard[] {
    this.initializeStorage();
    const stored = localStorage.getItem(STORAGE_KEYS.DASHBOARDS);
    return stored ? JSON.parse(stored) : [];
  }

  saveDashboards(dashboards: Dashboard[]) {
    localStorage.setItem(STORAGE_KEYS.DASHBOARDS, JSON.stringify(dashboards));
  }

  getDashboardById(id: string): Dashboard | null {
    const list = this.getDashboards();
    return list.find((d) => d.id === id) || null;
  }

  createDashboard(name: string, description: string, theme: DashboardThemeType = 'glass'): Dashboard {
    const nextList = this.getDashboards();
    const newDb: Dashboard = {
      id: `db-${Date.now()}`,
      name,
      description,
      widgets: [
        {
          id: `wdgt-kpi-${Date.now()}`,
          type: 'kpi',
          title: 'System Gross Margin',
          layout: { id: `wdgt-kpi-${Date.now()}`, x: 0, y: 0, w: 4, h: 2 },
          properties: { kpiValue: '24.5%', kpiLabel: 'Operational Profit Rate', kpiTrend: 3.2, kpiTrendDirection: 'up' }
        },
        {
          id: `wdgt-chart-${Date.now()}`,
          type: 'line',
          title: 'Growth Vectors Tracker',
          layout: { id: `wdgt-chart-${Date.now()}`, x: 4, y: 0, w: 8, h: 4 },
          properties: { xKey: 'month', dataKeys: ['revenue', 'margin'] }
        }
      ],
      filters: [
        { id: `fltr-${Date.now()}`, type: 'dateRange', label: 'Time Scope', column: 'month', value: 'Q3-2026', active: true }
      ],
      theme,
      version: 1,
      ownerId: 'devanshgautam0001@gmail.com',
      sharedUsers: [{ email: 'devanshgautam0001@gmail.com', role: 'admin' }],
      createdAt: new Date().toLocaleTimeString(),
      updatedAt: new Date().toLocaleTimeString()
    };

    nextList.unshift(newDb);
    this.saveDashboards(nextList);
    this.logActivity('CREATED_DASHBOARD', `Created dashboard: ${name}`);
    return newDb;
  }

  updateDashboard(updated: Dashboard) {
    const list = this.getDashboards();
    const updatedList = list.map((d) => (d.id === updated.id ? { ...updated, updatedAt: new Date().toLocaleTimeString() } : d));
    this.saveDashboards(updatedList);
  }

  duplicateDashboard(id: string): Dashboard | null {
    const original = this.getDashboardById(id);
    if (!original) return null;

    const list = this.getDashboards();
    const dup: Dashboard = {
      ...original,
      id: `db-dup-${Date.now()}`,
      name: `${original.name} (Copy)`,
      widgets: original.widgets.map((w) => ({
        ...w,
        id: `wdgt-${w.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        layout: { ...w.layout, id: `wdgt-${w.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}` }
      })),
      createdAt: new Date().toLocaleTimeString(),
      updatedAt: new Date().toLocaleTimeString()
    };

    list.unshift(dup);
    this.saveDashboards(list);
    this.logActivity('DUPLICATED_DASHBOARD', `Duplicated dashboard: ${original.name}`);
    return dup;
  }

  deleteDashboard(id: string) {
    const list = this.getDashboards();
    const filtered = list.filter((d) => d.id !== id);
    this.saveDashboards(filtered);
    this.logActivity('DELETED_DASHBOARD', `Removed dashboard with id: ${id}`);
  }

  // Version Control
  getVersions(dashboardId: string): DashboardVersion[] {
    this.initializeStorage();
    const stored = localStorage.getItem(STORAGE_KEYS.VERSIONS);
    const all: DashboardVersion[] = stored ? JSON.parse(stored) : [];
    return all.filter((v) => v.dashboardId === dashboardId);
  }

  createVersion(dashboardId: string, label: string): DashboardVersion | null {
    const db = this.getDashboardById(dashboardId);
    if (!db) return null;

    const stored = localStorage.getItem(STORAGE_KEYS.VERSIONS);
    const all: DashboardVersion[] = stored ? JSON.parse(stored) : [];
    const dbVersions = all.filter((v) => v.dashboardId === dashboardId);
    const nextNum = dbVersions.length + 1;

    const newVer: DashboardVersion = {
      id: `ver-${dashboardId}-${nextNum}-${Date.now()}`,
      dashboardId,
      versionNumber: nextNum,
      label,
      layout: db.widgets,
      theme: db.theme,
      filters: db.filters,
      createdAt: new Date().toLocaleTimeString(),
      author: 'devanshgautam0001@gmail.com'
    };

    all.unshift(newVer);
    localStorage.setItem(STORAGE_KEYS.VERSIONS, JSON.stringify(all));

    // increment current version counter
    db.version = nextNum;
    this.updateDashboard(db);

    this.logActivity('SAVED_VERSION', `Created layout snapshot v${nextNum} (${label})`);
    return newVer;
  }

  restoreVersion(ver: DashboardVersion): Dashboard | null {
    const db = this.getDashboardById(ver.dashboardId);
    if (!db) return null;

    db.widgets = ver.layout;
    db.theme = ver.theme;
    db.filters = ver.filters;
    db.version = ver.versionNumber;
    
    this.updateDashboard(db);
    this.logActivity('RESTORED_VERSION', `Restored layout snapshot back to v${ver.versionNumber}`);
    return db;
  }

  // Comments & Collaboration Panel
  getComments(widgetId?: string): DashboardComment[] {
    this.initializeStorage();
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const all: DashboardComment[] = stored ? JSON.parse(stored) : [];
    if (widgetId) {
      return all.filter((c) => c.widgetId === widgetId);
    }
    return all;
  }

  addComment(text: string, widgetId?: string, mentions?: string[]): DashboardComment {
    this.initializeStorage();
    const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    const all: DashboardComment[] = stored ? JSON.parse(stored) : [];

    const newC: DashboardComment = {
      id: `cmnt-${Date.now()}`,
      widgetId,
      author: 'devanshgautam0001@gmail.com',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mentions
    };

    all.push(newC);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(all));
    this.logActivity('ADDED_COMMENT', `Posted comment: "${text.slice(0, 30)}..."`);
    return newC;
  }

  // Activity Timeline
  getActivities(): DashboardActivity[] {
    this.initializeStorage();
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return stored ? JSON.parse(stored) : [];
  }

  logActivity(action: string, details: string) {
    this.initializeStorage();
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    const all: DashboardActivity[] = stored ? JSON.parse(stored) : [];

    const act: DashboardActivity = {
      id: `act-${Date.now()}`,
      userId: 'devanshgautam0001@gmail.com',
      userName: 'Devansh Gautam',
      action,
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    all.unshift(act);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(all.slice(0, 50))); // Cap at 50 logs
  }

  // Exports Descriptors
  exportDashboard(format: 'json' | 'pdf' | 'pptx' | 'svg', db: Dashboard): string {
    if (format === 'json') {
      return JSON.stringify(db, null, 2);
    }

    if (format === 'svg') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="100%" height="100%">
  <rect width="1200" height="800" fill="#09090b"/>
  <text x="40" y="60" fill="#ffffff" font-family="sans-serif" font-size="24" font-weight="bold">${db.name}</text>
  <text x="40" y="90" fill="#71717a" font-family="sans-serif" font-size="14">${db.description}</text>
  <rect x="40" y="140" width="340" height="120" rx="12" fill="#18181b" stroke="#27272a"/>
  <text x="60" y="180" fill="#a1a1aa" font-family="sans-serif" font-size="12" font-weight="bold">Net Operational Revenue</text>
  <text x="60" y="220" fill="#c084fc" font-family="sans-serif" font-size="28" font-weight="bold">$110,300</text>
</svg>`;
    }

    if (format === 'pptx') {
      return `PowerPoint Document Builder Layout Metadata Description:
Title: ${db.name}
Scope: ${db.description}
Total Slides Generated: ${Math.ceil(db.widgets.length / 2) + 1}
Slide 1: Executive Presentation Title Card
Slide 2: Primary Analytics Charts (Revenue Expansion Trends)
Slide 3: Detailed Ledger Grid Outputs & Segment Weights.`;
    }

    return `Executive Performance Briefing Document
=========================================
Dashboard: ${db.name}
Description: ${db.description}
Version: v${db.version}
Date Compiled: ${new Date().toLocaleDateString()}

Strategic KPIs Block
--------------------
- Net Operational Revenue: $110,300 (+14.8% trend)
- Corporate Margin Rate: 15.6% (-2.4% trend)
- NPS Score Satisfaction Index: 93.5 (+4.1% trend)

AI Core Observations
--------------------
Analysis detected EMEA latency peaks causing corporate acquisition increases. Shifting AutoML capacity buffers recommended.`;
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
