export type WidgetType =
  | 'kpi'
  | 'line'
  | 'bar'
  | 'area'
  | 'pie'
  | 'treemap'
  | 'heatmap'
  | 'scatter'
  | 'bubble'
  | 'radar'
  | 'gauge'
  | 'map'
  | 'table'
  | 'markdown'
  | 'text'
  | 'image'
  | 'aiInsight'
  | 'forecast';

export interface WidgetLayout {
  id: string;
  x: number; // grid columns (0-11)
  y: number; // grid rows
  w: number; // grid width (1-12)
  h: number; // grid height (rows)
}

export interface WidgetStyle {
  background?: string;
  textColor?: string;
  borderColor?: string;
  glassmorphism?: boolean;
}

export interface WidgetProperties {
  chartType?: string;
  dataKeys?: string[];
  xKey?: string;
  kpiValue?: string | number;
  kpiLabel?: string;
  kpiTrend?: number; // percentage
  kpiTrendDirection?: 'up' | 'down' | 'neutral';
  tableColumns?: string[];
  tableData?: any[];
  markdownContent?: string;
  textContent?: string;
  imageUrl?: string;
  aiInsightText?: string;
  forecastData?: any[];
  gaugeValue?: number;
  gaugeMax?: number;
  mapCenter?: [number, number];
  mapMarkers?: Array<{ lat: number; lng: number; label: string }>;
  refreshInterval?: number; // seconds
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  layout: WidgetLayout;
  properties: WidgetProperties;
  style?: WidgetStyle;
}

export type DashboardThemeType = 'glass' | 'midnight' | 'cyberpunk' | 'nordic-light' | 'emerald';

export interface DashboardTheme {
  id: DashboardThemeType;
  name: string;
  background: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  borderColor: string;
  glassEffect?: string;
}

export type FilterType = 'dateRange' | 'dropdown' | 'search' | 'multiSelect' | 'relativeDate';

export interface DashboardFilter {
  id: string;
  type: FilterType;
  label: string;
  column: string;
  value: any;
  options?: string[];
  active: boolean;
}

export interface DashboardComment {
  id: string;
  widgetId?: string; // can be global dashboard comment if undefined
  author: string;
  text: string;
  timestamp: string;
  mentions?: string[];
}

export interface DashboardVersion {
  id: string;
  dashboardId: string;
  versionNumber: number;
  label: string;
  layout: DashboardWidget[];
  theme: DashboardThemeType;
  filters: DashboardFilter[];
  createdAt: string;
  author: string;
}

export interface DashboardActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SharedUser {
  email: string;
  role: 'viewer' | 'editor' | 'admin';
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  theme: DashboardThemeType;
  version: number;
  ownerId: string;
  sharedUsers: SharedUser[];
  createdAt: string;
  updatedAt: string;
}
