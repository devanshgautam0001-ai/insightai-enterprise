export interface DatasetColumnStats {
  mean?: number;
  median?: number;
  stdDev?: number;
  min?: number;
  max?: number;
  skewness?: number;
  kurtosis?: number;
  nullCount: number;
  nullPercentage: number;
  uniqueCount: number;
  uniquePercentage: number;
  frequentValues: Array<{ value: any; count: number; percentage: number }>;
}

export type DataType = 'numerical' | 'categorical' | 'temporal' | 'boolean' | 'text';

export interface ColumnDefinition {
  name: string;
  type: DataType;
  sampleValues: any[];
  qualityScore: number;
  stats: DatasetColumnStats;
  isNullable: boolean;
  isPrimaryKey: boolean;
}

export interface QualityMetric {
  ruleName: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'passed' | 'failed' | 'warning';
  affectedRows: number;
  affectedPercentage: number;
}

export interface DataEngineDataset {
  id: string;
  name: string;
  size: string;
  bytes: number;
  rows: number;
  cols: number;
  fileType: 'csv' | 'xlsx' | 'json' | 'parquet';
  uploadedAt: string;
  columns: ColumnDefinition[];
  qualityMetrics: QualityMetric[];
  previewRows: Record<string, any>[];
  duplicateCount: number;
  duplicatePercentage: number;
  memoryUsage: string;
}
