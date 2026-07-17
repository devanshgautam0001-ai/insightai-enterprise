import {
  TaskType,
  ModelAlgorithm,
  MLModel,
  TrainingLog,
  PredictionResult,
  ForecastPoint,
  Hyperparameter,
  FeatureImportanceItem,
  ConfusionMatrixData,
  RocCurvePoint,
} from '../types/model';
import { RowData } from '../utils/dataCleaning';

const DEFAULT_MODELS: MLModel[] = [
  {
    id: 'model-rf-01',
    name: 'XGBoost Revenue Classifier',
    algorithm: 'xgboost',
    taskType: 'classification',
    targetColumn: 'segment',
    featuresSelected: ['amount', 'margin', 'transaction_id'],
    metrics: {
      accuracy: 0.94,
      precision: 0.93,
      recall: 0.95,
      f1: 0.94,
      auc: 0.97,
      cvScore: 0.935,
    },
    featureImportance: [
      { feature: 'margin', importance: 0.58 },
      { feature: 'amount', importance: 0.34 },
      { feature: 'transaction_id', importance: 0.08 },
    ],
    confusionMatrix: {
      labels: ['Enterprise', 'Mid-Market', 'SMB'],
      matrix: [
        [15, 1, 0],
        [1, 12, 1],
        [0, 1, 10],
      ],
    },
    rocCurve: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.05, tpr: 0.4 },
      { fpr: 0.1, tpr: 0.8 },
      { fpr: 0.15, tpr: 0.92 },
      { fpr: 0.2, tpr: 0.96 },
      { fpr: 0.4, tpr: 0.98 },
      { fpr: 0.7, tpr: 0.99 },
      { fpr: 1, tpr: 1 },
    ],
    hyperparameters: {
      max_depth: 6,
      learning_rate: 0.05,
      n_estimators: 250,
      subsample: 0.8,
    },
    trainingTimeMs: 4210,
    createdAt: '2026-07-10 14:32:00',
    isBest: true,
  },
  {
    id: 'model-rf-02',
    name: 'Random Forest Regressor',
    algorithm: 'random_forest',
    taskType: 'regression',
    targetColumn: 'amount',
    featuresSelected: ['margin', 'segment_enterprise', 'segment_smb'],
    metrics: {
      mae: 1240.5,
      rmse: 1850.2,
      mse: 3423240,
      r2: 0.89,
      cvScore: 0.875,
    },
    featureImportance: [
      { feature: 'margin', importance: 0.65 },
      { feature: 'segment_enterprise', importance: 0.25 },
      { feature: 'segment_smb', importance: 0.10 },
    ],
    hyperparameters: {
      n_estimators: 150,
      max_depth: 10,
      min_samples_split: 4,
    },
    trainingTimeMs: 2340,
    createdAt: '2026-07-11 09:12:00',
    isBest: false,
  },
];

export const ALGORITHM_LABELS: Record<ModelAlgorithm, string> = {
  automl: 'AutoML (Search Stack)',
  random_forest: 'Random Forest',
  decision_tree: 'Decision Tree',
  xgboost: 'XGBoost',
  lightgbm: 'LightGBM',
  catboost: 'CatBoost',
  linear_regression: 'Linear Regression',
  logistic_regression: 'Logistic Regression',
  svm: 'Support Vector Machine (SVM)',
  knn: 'K-Nearest Neighbors (KNN)',
  naive_bayes: 'Naive Bayes',
  gradient_boosting: 'Gradient Boosting',
};

export const TASK_ALGORITHMS: Record<TaskType, ModelAlgorithm[]> = {
  classification: [
    'automl',
    'random_forest',
    'xgboost',
    'lightgbm',
    'catboost',
    'logistic_regression',
    'svm',
    'knn',
    'naive_bayes',
    'gradient_boosting',
  ],
  regression: [
    'automl',
    'random_forest',
    'decision_tree',
    'xgboost',
    'lightgbm',
    'catboost',
    'linear_regression',
    'svm',
    'gradient_boosting',
  ],
  forecasting: [
    'automl',
    'linear_regression',
    'random_forest',
    'xgboost',
    'lightgbm',
  ],
  clustering: [
    'knn',
    'decision_tree',
    'random_forest',
  ],
};

export const DEFAULT_HYPERPARAMETERS: Record<ModelAlgorithm, Hyperparameter[]> = {
  automl: [
    { name: 'max_eval_time_sec', type: 'int', value: 60, range: [10, 300] },
    { name: 'ensemble_size', type: 'int', value: 5, range: [1, 20] },
  ],
  random_forest: [
    { name: 'n_estimators', type: 'int', value: 100, range: [10, 500] },
    { name: 'max_depth', type: 'int', value: 8, range: [2, 32] },
    { name: 'min_samples_split', type: 'int', value: 2, range: [2, 10] },
  ],
  decision_tree: [
    { name: 'max_depth', type: 'int', value: 6, range: [2, 20] },
    { name: 'criterion', type: 'categorical', value: 'gini', options: ['gini', 'entropy'] },
  ],
  xgboost: [
    { name: 'n_estimators', type: 'int', value: 200, range: [10, 1000] },
    { name: 'learning_rate', type: 'float', value: 0.1, range: [0.01, 0.5] },
    { name: 'max_depth', type: 'int', value: 6, range: [2, 16] },
    { name: 'subsample', type: 'float', value: 0.8, range: [0.5, 1.0] },
  ],
  lightgbm: [
    { name: 'n_estimators', type: 'int', value: 200, range: [10, 1000] },
    { name: 'learning_rate', type: 'float', value: 0.05, range: [0.01, 0.5] },
    { name: 'num_leaves', type: 'int', value: 31, range: [15, 127] },
  ],
  catboost: [
    { name: 'iterations', type: 'int', value: 250, range: [50, 1000] },
    { name: 'learning_rate', type: 'float', value: 0.03, range: [0.01, 0.3] },
    { name: 'depth', type: 'int', value: 6, range: [4, 10] },
  ],
  linear_regression: [
    { name: 'fit_intercept', type: 'boolean', value: true },
    { name: 'normalize', type: 'boolean', value: false },
  ],
  logistic_regression: [
    { name: 'penalty', type: 'categorical', value: 'l2', options: ['l1', 'l2', 'elasticnet', 'none'] },
    { name: 'C', type: 'float', value: 1.0, range: [0.01, 10.0] },
  ],
  svm: [
    { name: 'kernel', type: 'categorical', value: 'rbf', options: ['linear', 'poly', 'rbf', 'sigmoid'] },
    { name: 'C', type: 'float', value: 1.0, range: [0.1, 50.0] },
  ],
  knn: [
    { name: 'n_neighbors', type: 'int', value: 5, range: [1, 25] },
    { name: 'weights', type: 'categorical', value: 'uniform', options: ['uniform', 'distance'] },
  ],
  naive_bayes: [
    { name: 'var_smoothing', type: 'float', value: 1e-9, range: [1e-11, 1e-5] },
  ],
  gradient_boosting: [
    { name: 'n_estimators', type: 'int', value: 100, range: [10, 500] },
    { name: 'learning_rate', type: 'float', value: 0.1, range: [0.01, 0.5] },
    { name: 'max_depth', type: 'int', value: 3, range: [2, 10] },
  ],
};

class MLService {
  private trainedModels: MLModel[] = [...DEFAULT_MODELS];
  private predictionHistory: PredictionResult[] = [];

  public getModels(): MLModel[] {
    return this.trainedModels;
  }

  public addModel(model: MLModel) {
    this.trainedModels = [model, ...this.trainedModels];
    this.updateBestModelStatus();
  }

  public getBestModel(taskType: TaskType): MLModel | null {
    const models = this.trainedModels.filter((m) => m.taskType === taskType);
    if (models.length === 0) return null;

    if (taskType === 'classification') {
      return [...models].sort((a, b) => (b.metrics.accuracy || 0) - (a.metrics.accuracy || 0))[0];
    } else {
      return [...models].sort((a, b) => (b.metrics.r2 || 0) - (a.metrics.r2 || 0))[0];
    }
  }

  private updateBestModelStatus() {
    const types: TaskType[] = ['classification', 'regression', 'forecasting', 'clustering'];
    types.forEach((type) => {
      const best = this.getBestModel(type);
      this.trainedModels = this.trainedModels.map((m) => {
        if (m.taskType === type) {
          return { ...m, isBest: best ? m.id === best.id : false };
        }
        return m;
      });
    });
  }

  public detectTargetColumn(data: RowData[]): string {
    if (data.length === 0) return '';
    const keys = Object.keys(data[0]);
    // Try to find a logical classification target like "segment", "category", "target", "label"
    const targetKeywords = ['segment', 'category', 'target', 'label', 'class', 'amount', 'revenue'];
    for (const key of keys) {
      if (targetKeywords.includes(key.toLowerCase())) {
        return key;
      }
    }
    return keys[keys.length - 1] || '';
  }

  public selectFeatures(data: RowData[], targetColumn: string): string[] {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter((col) => col !== targetColumn);
  }

  public generateMockLogs(
    algorithm: ModelAlgorithm,
    epoch: number,
    totalEpochs: number,
    taskType: TaskType
  ): TrainingLog {
    const progress = epoch / totalEpochs;
    const timestamp = new Date().toLocaleTimeString();
    
    // Simulating descending loss over epoch
    const lossBase = taskType === 'classification' ? 1.2 : 450000;
    const loss = parseFloat((lossBase * Math.pow(0.85, epoch) + Math.random() * 0.02 * lossBase).toFixed(4));
    const valLoss = parseFloat((loss * 1.05 + Math.random() * 0.05 * loss).toFixed(4));
    
    // Metrics increasing
    let metricVal = 0;
    if (taskType === 'classification') {
      metricVal = parseFloat((0.55 + 0.4 * progress - Math.random() * 0.03 * progress).toFixed(4));
    } else {
      metricVal = parseFloat((0.45 + 0.48 * progress - Math.random() * 0.02 * progress).toFixed(4));
    }

    const messages = [
      `Epoch [${epoch}/${totalEpochs}] - processing batches`,
      `Validated validation split partition - checking gradients`,
      `Feature weight optimization step complete - updated weights`,
      `Regularization parameters bounded`,
      `Pruning decision tree branches to prevent overfitting`,
    ];
    const message = messages[epoch % messages.length];

    return {
      timestamp,
      epoch,
      message: `${ALGORITHM_LABELS[algorithm]} - ${message}`,
      loss,
      valLoss,
      metric: metricVal,
    };
  }

  public generateRocCurve(): RocCurvePoint[] {
    const points: RocCurvePoint[] = [{ fpr: 0, tpr: 0 }];
    let currentTpr = 0;
    for (let fpr = 0.05; fpr <= 1; fpr += 0.05) {
      currentTpr = Math.min(1, currentTpr + (1 - currentTpr) * (Math.random() * 0.4 + 0.3));
      points.push({
        fpr: parseFloat(fpr.toFixed(2)),
        tpr: parseFloat(currentTpr.toFixed(3)),
      });
    }
    return points;
  }

  public createTrainedModel(
    name: string,
    algorithm: ModelAlgorithm,
    taskType: TaskType,
    targetColumn: string,
    featuresSelected: string[],
    hyperparams: Record<string, any>,
    trainingTimeMs: number
  ): MLModel {
    const modelId = `model-${taskType === 'classification' ? 'clf' : 'reg'}-${Date.now().toString().slice(-4)}`;
    
    const accuracy = taskType === 'classification' ? parseFloat((0.88 + Math.random() * 0.08).toFixed(2)) : undefined;
    const precision = accuracy ? parseFloat((accuracy - 0.01 - Math.random() * 0.02).toFixed(2)) : undefined;
    const recall = accuracy ? parseFloat((accuracy + 0.01 - Math.random() * 0.02).toFixed(2)) : undefined;
    const f1 = accuracy && precision && recall ? parseFloat((2 * (precision * recall) / (precision + recall)).toFixed(2)) : undefined;
    const auc = accuracy ? parseFloat((accuracy + 0.04 + Math.random() * 0.02).toFixed(2)) : undefined;

    const mae = taskType === 'regression' ? parseFloat((800 + Math.random() * 500).toFixed(2)) : undefined;
    const rmse = mae ? parseFloat((mae * 1.25 + Math.random() * 100).toFixed(2)) : undefined;
    const mse = rmse ? parseFloat(Math.pow(rmse, 2).toFixed(0)) : undefined;
    const r2 = taskType === 'regression' ? parseFloat((0.78 + Math.random() * 0.18).toFixed(2)) : undefined;

    const cvScore = accuracy || r2 || 0.85;

    // Feature Importances
    const featureImportance: FeatureImportanceItem[] = featuresSelected.map((feat, idx) => {
      return {
        feature: feat,
        importance: parseFloat((Math.pow(0.5, idx + 1) + Math.random() * 0.05).toFixed(3)),
      };
    });
    // Normalize weights
    const totalImportance = featureImportance.reduce((sum, item) => sum + item.importance, 0) || 1;
    featureImportance.forEach((item) => {
      item.importance = parseFloat((item.importance / totalImportance).toFixed(3));
    });
    featureImportance.sort((a, b) => b.importance - a.importance);

    // Confusion Matrix
    let confusionMatrix: ConfusionMatrixData | undefined;
    if (taskType === 'classification') {
      confusionMatrix = {
        labels: ['High', 'Medium', 'Low'],
        matrix: [
          [24, 2, 1],
          [3, 18, 2],
          [1, 2, 21],
        ],
      };
    }

    const rocCurve = taskType === 'classification' ? this.generateRocCurve() : undefined;

    return {
      id: modelId,
      name: name || `${ALGORITHM_LABELS[algorithm]} ${taskType === 'classification' ? 'Classifier' : 'Regressor'}`,
      algorithm,
      taskType,
      targetColumn,
      featuresSelected,
      metrics: {
        accuracy,
        precision,
        recall,
        f1,
        auc,
        mae,
        rmse,
        mse,
        r2,
        cvScore,
      },
      featureImportance,
      confusionMatrix,
      rocCurve,
      hyperparameters: hyperparams,
      trainingTimeMs,
      accuracy: accuracy ?? r2 ?? 0.85,
      createdAt: new Date().toLocaleString(),
    };
  }

  public getPredictionHistory(): PredictionResult[] {
    return this.predictionHistory;
  }

  public makePrediction(model: MLModel, features: Record<string, any>): PredictionResult {
    let prediction: string | number = '';
    let confidence = 0.85;
    const probabilities: Record<string, number> = {};

    if (model.taskType === 'classification') {
      // Logic matching classification label
      const classes = model.confusionMatrix?.labels || ['Class A', 'Class B', 'Class C'];
      // Deterministic choice based on input fields or random
      const sum = Object.values(features).reduce((a, b) => a + (typeof b === 'number' ? b : String(b).length), 0);
      const chosenIndex = sum % classes.length;
      prediction = classes[chosenIndex];

      // Create fake probabilities
      let remaining = 1.0;
      classes.forEach((cls, idx) => {
        if (idx === chosenIndex) {
          confidence = parseFloat((0.65 + Math.random() * 0.32).toFixed(3));
          probabilities[cls] = confidence;
          remaining -= confidence;
        } else {
          probabilities[cls] = parseFloat((remaining / (classes.length - 1)).toFixed(3));
        }
      });
    } else {
      // Numeric outcome
      const margin = features.margin ? Number(features.margin) : 0.2;
      const amount = features.amount ? Number(features.amount) : 10000;
      prediction = Math.round(amount * (1 + margin) * (0.9 + Math.random() * 0.2));
    }

    const result: PredictionResult = {
      id: `pred-${Date.now().toString().slice(-4)}`,
      input: features,
      prediction,
      confidence: model.taskType === 'classification' ? confidence : undefined,
      probabilities: model.taskType === 'classification' ? probabilities : undefined,
      timestamp: new Date().toLocaleTimeString(),
    };

    this.predictionHistory = [result, ...this.predictionHistory];
    return result;
  }

  public generateForecast(days: 30 | 60 | 90, trendStrength: number = 0.5, seasonalityStrength: number = 0.3): ForecastPoint[] {
    const result: ForecastPoint[] = [];
    const baseValue = 50000;
    const date = new Date();

    for (let i = 0; i < days; i++) {
      const forecastDate = new Date(date);
      forecastDate.setDate(date.getDate() + i);

      // Math components
      const trend = baseValue + i * 250 * trendStrength;
      const seasonality = Math.sin((i / 7) * 2 * Math.PI) * 5000 * seasonalityStrength;
      const randomNoise = (Math.random() - 0.5) * 4000;

      const forecast = Math.round(trend + seasonality + randomNoise);
      const errorMargin = 2000 + i * 80; // Margin widens further out
      const lowerBound = Math.round(forecast - errorMargin);
      const upperBound = Math.round(forecast + errorMargin);

      result.push({
        date: forecastDate.toISOString().split('T')[0],
        forecast,
        lowerBound,
        upperBound,
        trend: Math.round(trend),
        seasonality: Math.round(seasonality),
      });
    }

    return result;
  }
}

export const mlService = new MLService();
export default mlService;
