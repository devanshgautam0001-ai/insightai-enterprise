import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TaskType, ModelAlgorithm } from '../../types/model';
import mlService, { TASK_ALGORITHMS, ALGORITHM_LABELS, DEFAULT_HYPERPARAMETERS } from '../../services/ml.service';
import { Brain, Sparkles, Check, Play } from 'lucide-react';

interface TrainingPanelProps {
  onStartTraining: (
    taskType: TaskType,
    targetColumn: string,
    features: string[],
    algorithms: ModelAlgorithm[],
    hyperparams: Record<string, any>,
    epochs: number,
    modelName: string
  ) => void;
  isTraining: boolean;
  datasetColumns: string[];
  datasetRows: any[];
}

export const TrainingPanel: React.FC<TrainingPanelProps> = ({
  onStartTraining,
  isTraining,
  datasetColumns,
  datasetRows,
}) => {
  const [taskType, setTaskType] = useState<TaskType>('classification');
  const [targetColumn, setTargetColumn] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<ModelAlgorithm[]>(['automl']);
  const [epochs, setEpochs] = useState<number>(10);
  const [modelName, setModelName] = useState<string>('');
  
  // Auto-detect target column on mount or dataset change
  useEffect(() => {
    if (datasetRows.length > 0) {
      const detected = mlService.detectTargetColumn(datasetRows);
      setTargetColumn(detected);
      
      const features = mlService.selectFeatures(datasetRows, detected);
      setSelectedFeatures(features);
    } else {
      setTargetColumn(datasetColumns[datasetColumns.length - 1] || '');
      setSelectedFeatures(datasetColumns.slice(0, -1));
    }
  }, [datasetColumns, datasetRows]);

  // Handle auto-detect trigger
  const handleAutoDetect = () => {
    if (datasetRows.length > 0) {
      const detected = mlService.detectTargetColumn(datasetRows);
      setTargetColumn(detected);
      
      const features = mlService.selectFeatures(datasetRows, detected);
      setSelectedFeatures(features);
    }
  };

  const handleToggleFeature = (col: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(col) ? prev.filter((f) => f !== col) : [...prev, col]
    );
  };

  const handleSelectAllFeatures = () => {
    setSelectedFeatures(datasetColumns.filter((c) => c !== targetColumn));
  };

  const handleSelectNoneFeatures = () => {
    setSelectedFeatures([]);
  };

  const handleToggleAlgorithm = (algo: ModelAlgorithm) => {
    if (algo === 'automl') {
      setSelectedAlgorithms(['automl']);
      return;
    }

    setSelectedAlgorithms((prev) => {
      const filtered = prev.filter((a) => a !== 'automl');
      if (filtered.includes(algo)) {
        const next = filtered.filter((a) => a !== algo);
        return next.length === 0 ? ['automl'] : next;
      } else {
        return [...filtered, algo];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetColumn) return;
    if (selectedFeatures.length === 0) return;

    // Collect default hyperparameters
    const hyperparams: Record<string, any> = {};
    selectedAlgorithms.forEach((algo) => {
      const defaults = DEFAULT_HYPERPARAMETERS[algo] || [];
      defaults.forEach((hp) => {
        hyperparams[hp.name] = hp.value;
      });
    });

    const finalName = modelName || `${ALGORITHM_LABELS[selectedAlgorithms[0]]} [${targetColumn}]`;

    onStartTraining(
      taskType,
      targetColumn,
      selectedFeatures,
      selectedAlgorithms,
      hyperparams,
      epochs,
      finalName
    );
  };

  return (
    <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h2 id="training-panel-title" className="text-lg font-semibold text-white tracking-tight">AutoML Experiment Configuration</h2>
          <p className="text-xs text-zinc-400 font-mono">STEP 1: DESIGN SELECTION & OBJECTIVES</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Type */}
        <div className="space-y-2">
          <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
            1. Select Machine Learning Task
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {(['classification', 'regression', 'forecasting', 'clustering'] as TaskType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setTaskType(type);
                  // Default algo matches the new task
                  setSelectedAlgorithms(['automl']);
                }}
                className={`py-3 px-4 rounded-xl text-center border font-sans text-sm font-medium transition-all duration-200 capitalize ${
                  taskType === type
                    ? 'bg-purple-600/15 text-purple-400 border-purple-500/40 shadow-lg shadow-purple-500/5'
                    : 'bg-white/[0.01] text-zinc-400 border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Target and Feature Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Column */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
                2. Target Variable (Label)
              </label>
              <button
                type="button"
                onClick={handleAutoDetect}
                className="flex items-center gap-1.5 text-[11px] font-mono text-purple-400 hover:text-purple-300 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Auto-Detect
              </button>
            </div>
            <select
              value={targetColumn}
              onChange={(e) => setTargetColumn(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
              required
            >
              <option value="" disabled className="bg-zinc-950 text-zinc-500">
                Choose a column...
              </option>
              {datasetColumns.map((col) => (
                <option key={col} value={col} className="bg-zinc-950 text-white">
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Model Name */}
          <div className="space-y-2.5">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
              3. Experiment Run Name
            </label>
            <Input
              placeholder="e.g. XGBoost Churn Predictor"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="border-white/10 focus:border-purple-500/50 focus:ring-purple-500/30"
            />
          </div>
        </div>

        {/* Feature Selector checklist */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
              4. Features Subset Selection ({selectedFeatures.length} / {datasetColumns.filter((c) => c !== targetColumn).length} selected)
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSelectAllFeatures}
                className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={handleSelectNoneFeatures}
                className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="border border-white/5 bg-zinc-950/20 rounded-xl p-4 max-h-[160px] overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-zinc-800">
            {datasetColumns
              .filter((col) => col !== targetColumn)
              .map((col) => {
                const isSelected = selectedFeatures.includes(col);
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => handleToggleFeature(col)}
                    className="flex items-center gap-3 w-full text-left py-1.5 px-2 rounded-lg hover:bg-white/[0.02] transition-colors group"
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-purple-500 border-purple-400 text-white'
                          : 'border-white/20 group-hover:border-white/40'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-sm text-zinc-300 font-mono">{col}</span>
                  </button>
                );
              })}
            {datasetColumns.filter((col) => col !== targetColumn).length === 0 && (
              <p className="text-sm text-zinc-500 text-center font-mono py-4">No features available.</p>
            )}
          </div>
        </div>

        {/* Algorithm selection */}
        <div className="space-y-3">
          <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
            5. Select Algorithms to Optimize
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => handleToggleAlgorithm('automl')}
              className={`py-3 px-3 rounded-xl border font-sans text-xs font-semibold text-center transition-all ${
                selectedAlgorithms.includes('automl')
                  ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-md shadow-purple-500/5'
                  : 'bg-white/[0.01] text-zinc-400 border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
              }`}
            >
              🚀 AutoML (Recommended)
            </button>
            {TASK_ALGORITHMS[taskType]
              .filter((algo) => algo !== 'automl')
              .map((algo) => {
                const isSelected = selectedAlgorithms.includes(algo);
                return (
                  <button
                    key={algo}
                    type="button"
                    onClick={() => handleToggleAlgorithm(algo)}
                    className={`py-3 px-3 rounded-xl border font-sans text-xs font-medium text-center transition-all ${
                      isSelected
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-md'
                        : 'bg-white/[0.01] text-zinc-400 border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                    }`}
                  >
                    {ALGORITHM_LABELS[algo]}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Training Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest">
              Max Training Epochs
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={epochs}
                onChange={(e) => setEpochs(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <span className="text-sm font-mono text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/5 min-w-[36px] text-center">
                {epochs}
              </span>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <Button
              type="submit"
              disabled={isTraining || !targetColumn || selectedFeatures.length === 0}
              className="w-full md:w-auto px-8 py-3.5"
            >
              <Play className="w-4.5 h-4.5 mr-2 stroke-[2.5]" />
              Start Training Session
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
export default TrainingPanel;
