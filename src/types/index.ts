import { DataEngineDataset, ColumnDefinition } from './dataset';
import { MLModel } from './model';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  charts?: any[];
}

export type Dataset = DataEngineDataset;
export type TrainedModel = MLModel;
export type DatasetColumn = ColumnDefinition;

export interface SystemNotification {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'error';
  timestamp: string;
  read: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  division: string;
  memberCount: number;
  status: 'active' | 'archived';
}
export type { DatasetColumnStats, ColumnDefinition, DataType, QualityMetric } from './dataset';
export type { TaskType, ModelAlgorithm, TrainingStatus, Hyperparameter, ModelMetrics, FeatureImportanceItem, ConfusionMatrixData, RocCurvePoint, ModelConfig, TrainingLog, TrainingState, SinglePredictionInput, PredictionResult, ForecastPoint } from './model';
