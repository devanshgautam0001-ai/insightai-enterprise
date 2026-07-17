import React, { useState, useEffect } from 'react';
import { useTraining } from '../../hooks/useTraining';
import { usePrediction } from '../../hooks/usePrediction';
import { MLModel } from '../../types/model';
import { ALGORITHM_LABELS } from '../../services/ml.service';
import { PredictionTable } from '../../components/ml/PredictionTable';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Binary, Database, UploadCloud, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useUIStore } from '../../store';

export const PredictionCenter: React.FC = () => {
  const { models } = useTraining();
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);

  useEffect(() => {
    useUIStore.setState({ predictionStatus: 'Completed' });
  }, []);

  // Sync default model selection
  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel]);

  const { history, isPredicting, batchResults, predictSingle, predictBatch, clearBatchResults } =
    usePrediction(selectedModel);

  const [predictionType, setPredictionType] = useState<'single' | 'batch'>('single');

  // Single prediction feature values state
  const [featureInputs, setFeatureInputs] = useState<Record<string, any>>({});

  useEffect(() => {
    if (selectedModel) {
      const initial: Record<string, any> = {};
      (selectedModel.featuresSelected || []).forEach((feat) => {
        initial[feat] = feat === 'margin' ? 0.15 : feat === 'amount' ? 10000 : 50;
      });
      setFeatureInputs(initial);
    }
  }, [selectedModel]);

  const handleInputChange = (feat: string, val: string) => {
    setFeatureInputs((prev) => ({
      ...prev,
      [feat]: isNaN(Number(val)) ? val : Number(val),
    }));
  };

  const handleSinglePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    await predictSingle(featureInputs);
  };

  // CSV Drag and drop / file read state
  const [csvContent, setCsvContent] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleCSVUpload = (text: string) => {
    setCsvContent(text);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleCSVUpload(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleCSVUpload(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleBatchPredict = async () => {
    if (!csvContent) return;
    await predictBatch(csvContent);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Inference & Prediction Hub</h2>
          <p className="text-sm text-zinc-400">
            Query active candidate weights using single real-time entries or batch-mode CSV datasets.
          </p>
        </div>

        {/* Prediction type toggles */}
        <div className="flex bg-white/5 border border-white/5 rounded-xl p-1 font-mono text-xs self-start sm:self-auto">
          <button
            onClick={() => {
              setPredictionType('single');
              clearBatchResults();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              predictionType === 'single'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Single Inference
          </button>
          <button
            onClick={() => {
              setPredictionType('batch');
              clearBatchResults();
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              predictionType === 'batch'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/10'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Batch (.CSV) Upload
          </button>
        </div>
      </div>

      {/* Model Selector Card */}
      <Card className="border border-white/5 bg-zinc-950/25 p-5">
        <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2.5">
          Choose Active Champion Pipeline
        </label>
        <select
          value={selectedModel?.id || ''}
          onChange={(e) => {
            const found = models.find((m) => m.id === e.target.value);
            if (found) setSelectedModel(found);
          }}
          className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all font-sans font-medium"
        >
          {models.map((m) => (
            <option key={m.id} value={m.id} className="bg-zinc-950 text-white">
              [{m.id}] {m.name} - {ALGORITHM_LABELS[m.algorithm]} ({m.taskType})
            </option>
          ))}
          {models.length === 0 && (
            <option className="bg-zinc-950 text-zinc-500">No models active. Standard demo XGBoost loaded.</option>
          )}
        </select>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input panel depending on prediction type */}
        <div className="lg:col-span-2 space-y-6">
          {predictionType === 'single' ? (
            <Card className="border border-white/5 bg-zinc-950/40 p-6">
              <div className="flex items-center gap-2.5 mb-6">
                <Binary className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-semibold text-white tracking-tight">Continuous Real-Time Queries</h3>
              </div>

              <form onSubmit={handleSinglePredict} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(selectedModel?.featuresSelected || []).map((feat) => (
                    <div key={feat} className="space-y-1.5">
                      <label className="block text-xs font-mono text-zinc-400 capitalize">{feat}</label>
                      <Input
                        value={featureInputs[feat] ?? ''}
                        onChange={(e) => handleInputChange(feat, e.target.value)}
                        placeholder={`Value for ${feat}...`}
                        className="border-white/10 focus:border-purple-500/50 focus:ring-purple-500/30 font-mono text-xs"
                        required
                      />
                    </div>
                  ))}
                  {(!selectedModel || !selectedModel.featuresSelected || selectedModel.featuresSelected.length === 0) && (
                    <div className="col-span-2 py-4 text-center text-zinc-500 font-mono italic">
                      Choose or build a model to load query parameters.
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit" isLoading={isPredicting} disabled={!selectedModel} className="px-8">
                    <Play className="w-4 h-4 mr-2" />
                    Inference Output
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="border border-white/5 bg-zinc-950/40 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <Database className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-semibold text-white tracking-tight">Structured Batch File upload</h3>
                </div>
                {csvContent && (
                  <button
                    onClick={() => {
                      setCsvContent('');
                      clearBatchResults();
                    }}
                    className="text-[11px] font-mono text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear Input
                  </button>
                )}
              </div>

              {!csvContent ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                    dragActive
                      ? 'border-purple-500 bg-purple-500/5'
                      : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
                  }`}
                >
                  <UploadCloud className="w-10 h-10 text-zinc-500 mx-auto mb-4" />
                  <p className="text-sm font-semibold text-zinc-300">Drag & Drop structured CSV files</p>
                  <p className="text-xs text-zinc-500 mt-1 mb-4">Must contain header columns matching active features</p>
                  <label className="inline-flex items-center justify-center font-sans font-medium rounded-xl transition-all duration-200 cursor-pointer text-xs bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 px-4 py-2">
                    Browse File Directories
                    <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Ready to parse: {csvContent.split('\n').filter(Boolean).length - 1} records detected.
                  </p>
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-zinc-500 max-h-[140px] overflow-y-auto">
                    {csvContent.slice(0, 500)}...
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleBatchPredict} isLoading={isPredicting} className="px-8">
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Inference batch runs
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Display probabilities for Classification if available */}
        <div className="space-y-6">
          <Card className="border border-white/5 bg-zinc-950/25 p-5">
            <h4 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-purple-400" />
              Real-time probabilities
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed mt-2">
              For classification tasks, our neural architecture maps predictions directly to class confidence profiles using Softmax outputs.
            </p>

            {history[0]?.probabilities && (
              <div className="mt-4 space-y-3">
                {Object.entries(history[0].probabilities).map(([cls, prob]) => (
                  <div key={cls} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                      <span>{cls}</span>
                      <span className="text-purple-400 font-bold">{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${prob * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Predictions ledger table */}
      <PredictionTable predictions={batchResults.length > 0 ? batchResults : history} />
    </motion.div>
  );
};
export default PredictionCenter;
