export type NodeType = 'source' | 'clean' | 'transform' | 'engineer' | 'sink';

export type TransformType =
  | 'rename_column'
  | 'drop_column'
  | 'filter_rows'
  | 'sort_rows'
  | 'group_by'
  | 'one_hot_encode'
  | 'standard_scale'
  | 'impute_missing'
  | 'polynomial_features'
  | 'interaction_features'
  | 'date_extraction';

export interface PipelineNode {
  id: string;
  type: NodeType;
  label: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  x: number;
  y: number;
  config: Record<string, any>;
}

export interface PipelineEdge {
  id: string;
  source: string;
  target: string;
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  updatedAt: string;
  version: string;
}

export interface TransformationStep {
  id: string;
  type: TransformType;
  column?: string;
  targetColumn?: string;
  parameters: Record<string, any>;
  description: string;
}

export interface DataQualityReport {
  score: number;
  missingValuesCount: number;
  duplicateCount: number;
  outliersCount: number;
  memoryUsageBytes: number;
  processingTimeMs: number;
  dataTypeDistribution: Record<string, number>;
}
