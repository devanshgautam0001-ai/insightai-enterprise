export type TaskType = 'classification' | 'regression' | 'forecasting' | 'clustering';

export type ModelAlgorithm =
  | 'automl'
  | 'random_forest'
  | 'decision_tree'
  | 'xgboost'
  | 'lightgbm'
  | 'catboost'
  | 'linear_regression'
  | 'logistic_regression'
  | 'svm'
  | 'knn'
  | 'naive_bayes'
  | 'gradient_boosting';

export type TrainingStatus = 'idle' | 'running' | 'paused' | 'success' | 'failed' | 'cancelled';

export interface Hyperparameter {
  name: string;
  type: 'int' | 'float' | 'categorical' | 'boolean';
  value: any;
  range?: [number, number];
  options?: string[];
}

export interface ModelMetrics {
  // Classification metrics
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  auc?: number;
  
  // Regression & Forecasting metrics
  mae?: number;
  rmse?: number;
  mse?: number;
  r2?: number;

  // Cross validation folds score average
  cvScore?: number;
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number; // between 0 and 1
}

export interface ConfusionMatrixData {
  labels: string[];
  matrix: number[][]; // rows are actual, cols are predicted
}

export interface RocCurvePoint {
  fpr: number; // False Positive Rate
  tpr: number; // True Positive Rate
}

export interface ModelConfig {
  algorithm: ModelAlgorithm;
  hyperparameters: Hyperparameter[];
  crossValidationFolds: number;
}

export interface MLModel {
  id: string;
  name: string;
  algorithm: ModelAlgorithm;
  taskType: TaskType;
  targetColumn: string;
  featuresSelected: string[];
  metrics: ModelMetrics;
  featureImportance: FeatureImportanceItem[];
  confusionMatrix?: ConfusionMatrixData;
  rocCurve?: RocCurvePoint[];
  hyperparameters: Record<string, any>;
  trainingTimeMs: number;
  createdAt: string;
  isBest?: boolean;
  accuracy?: number;
  logs?: TrainingLog[];
}

export interface TrainingLog {
  timestamp: string;
  epoch?: number;
  message: string;
  loss?: number;
  valLoss?: number;
  metric?: number;
}

export interface TrainingState {
  status: TrainingStatus;
  progress: number; // 0 to 100
  etaSeconds: number;
  currentEpoch: number;
  totalEpochs: number;
  logs: TrainingLog[];
  activeAlgorithm: ModelAlgorithm | null;
  hardwareStats: {
    cpuUsage: number;
    ramUsage: number;
    gpuUsage: number;
    gpuTemp: number;
  };
}

export interface SinglePredictionInput {
  features: Record<string, any>;
}

export interface PredictionResult {
  id: string;
  input: Record<string, any>;
  prediction: string | number;
  confidence?: number; // 0 to 1 for classification
  probabilities?: Record<string, number>; // probability distribution
  timestamp: string;
}

export interface ForecastPoint {
  date: string;
  actual?: number;
  forecast: number;
  lowerBound: number;
  upperBound: number;
  trend: number;
  seasonality: number;
}
