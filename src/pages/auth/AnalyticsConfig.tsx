import React, { useState } from 'react';
import { Info, Save, Cpu } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store';

export const AnalyticsConfig: React.FC = () => {
  const {
    outlierThreshold,
    setOutlierThreshold,
    learningRate,
    setLearningRate,
    testSplit,
    setTestSplit,
    addNotification
  } = useUIStore();

  const [maxDepth, setMaxDepth] = useState(6);
  const [nEstimators, setNEstimators] = useState(100);

  const handleSave = () => {
    addNotification({
      title: 'Global Analytics Updated',
      description: 'Model optimization parameters and threshold constraints were securely dispatched.',
      type: 'success'
    });
  };

  return (
    <div className="space-y-8 animate-fade-in" id="analytics-config-view">
      <div>
        <h2 className="font-display font-extrabold text-3xl">Analytics Configuration</h2>
        <p className="text-zinc-400 text-sm">Configure training guidelines, estimators, and learning rates for AutoML clusters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" /> Gradient Boost Estimator Rules
              </h3>
              <p className="text-xs text-zinc-500">Fine-tune hyper-parameters used during AutoML evaluations.</p>
            </div>

            <div className="space-y-5">
              {/* Learning Rate Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Secure Learning Rate</span>
                  <span className="text-blue-400 font-bold">{learningRate}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
              </div>

              {/* Test Split Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Testing Validation Ratio (%)</span>
                  <span className="text-blue-400 font-bold">{testSplit}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="5"
                  value={testSplit}
                  onChange={(e) => setTestSplit(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
              </div>

              {/* Outlier Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Outlier Isolation Threshold (z-score)</span>
                  <span className="text-blue-400 font-bold">{outlierThreshold} σ</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.0"
                  step="0.1"
                  value={outlierThreshold}
                  onChange={(e) => setOutlierThreshold(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Max Tree Depth</label>
                  <input
                    type="number"
                    value={maxDepth}
                    onChange={(e) => setMaxDepth(parseInt(e.target.value) || 3)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Number of Estimators</label>
                  <input
                    type="number"
                    value={nEstimators}
                    onChange={(e) => setNEstimators(parseInt(e.target.value) || 50)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="font-display font-bold text-base flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" /> Grounding Guidelines
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              These hyperparameters govern the feature engineering matrix, validation epochs, and explainable AI SHAP layouts.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Adjusting the learning rate or estimators will alter model accuracy and speed metrics.
            </p>
            <Button onClick={handleSave} className="w-full mt-4">
              <Save className="w-4 h-4 mr-2" /> Dispatch Constraints
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
