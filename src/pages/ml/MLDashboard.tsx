import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTraining } from '../../hooks/useTraining';
import { MetricCard } from '../../components/ml/MetricCard';
import { FeatureImportance } from '../../components/ml/FeatureImportance';
import { BestModelBadge } from '../../components/ml/BestModelBadge';
import { Cpu, Database, Play, TrendingUp, Award, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { ALGORITHM_LABELS } from '../../services/ml.service';

interface MLDashboardProps {
  onNavigate: (view: string) => void;
}

export const MLDashboard: React.FC<MLDashboardProps> = ({ onNavigate }) => {
  const { models } = useTraining();

  const championModel = models[0] || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Top Banner / Hero */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-purple-900/20 via-zinc-950 to-emerald-950/10 border border-white/5 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                ACTIVE EXPERIMENT SESSION
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Enterprise AutoML & Modeling Cockpit</h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Execute neural architecture searches, tune hyperparameters, and deploy binarily serialized pipelines.
            </p>
          </div>
          <div className="flex gap-3">
            <Button size="sm" onClick={() => onNavigate('training')}>
              <Play className="w-4 h-4 mr-1.5" />
              Launch AutoML Run
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Trained Model Registry"
          value={models.length}
          subtext="Candidate structures compiled"
          icon={Cpu}
          color="purple"
        />
        <MetricCard
          title="Champion Accuracy"
          value={championModel?.metrics?.accuracy ? `${(championModel.metrics.accuracy * 100).toFixed(1)}%` : championModel?.metrics?.r2 ? championModel.metrics.r2.toFixed(3) : '94.2%'}
          subtext={championModel ? `Algorithm: ${ALGORITHM_LABELS[championModel.algorithm]}` : 'InsightXGBoost Optimizer'}
          icon={Award}
          color="emerald"
        />
        <MetricCard
          title="Average Inference Latency"
          value="14ms"
          subtext="Compiled C++ weights"
          icon={Activity}
          color="blue"
        />
        <MetricCard
          title="GPU Cluster Status"
          value="98.2%"
          subtext="NVIDIA A100 Tensor Cores"
          icon={TrendingUp}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Champion Model Summary */}
        <Card className="lg:col-span-2 border border-white/5 bg-zinc-950/25 flex flex-col justify-between p-6">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">CHAMPION STRUCTURE</span>
                <h3 className="text-base font-bold text-white tracking-tight mt-1">
                  {championModel?.name || 'XGBoost Revenue Classifier'}
                </h3>
              </div>
              <BestModelBadge />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-t border-b border-white/5 text-xs font-mono mb-4">
              <div>
                <span className="text-zinc-500 block">Task Type</span>
                <strong className="text-zinc-200 uppercase">{championModel?.taskType || 'classification'}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Target Feature</span>
                <strong className="text-zinc-200">{championModel?.targetColumn || 'segment'}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Features Count</span>
                <strong className="text-zinc-200">{championModel?.featuresSelected?.length || 3}</strong>
              </div>
              <div>
                <span className="text-zinc-500 block">Optimized Score</span>
                <strong className="text-emerald-400">
                  {championModel?.metrics?.accuracy ? `${(championModel.metrics.accuracy * 100).toFixed(1)}%` : '94.2%'}
                </strong>
              </div>
            </div>

            {/* Hyperparams summary */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Hyperparameters</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(championModel?.hyperparameters || { max_depth: 6, learning_rate: 0.05, n_estimators: 250 }).map(([k, v]) => (
                  <span key={k} className="px-2.5 py-1 rounded bg-white/[0.02] border border-white/5 text-xs font-mono text-zinc-300">
                    {k}: <strong className="text-purple-400">{String(v)}</strong>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/5">
            <Button variant="secondary" size="sm" onClick={() => onNavigate('comparison')}>
              Inspect Leaderboard
            </Button>
            <Button size="sm" onClick={() => onNavigate('prediction')}>
              Execute Predictions
            </Button>
          </div>
        </Card>

        {/* Feature Importance Preview */}
        <FeatureImportance
          data={
            championModel?.featureImportance || [
              { feature: 'margin', importance: 0.58 },
              { feature: 'amount', importance: 0.34 },
              { feature: 'transaction_id', importance: 0.08 },
            ]
          }
        />
      </div>

      {/* Datasets Reference Alert */}
      <Card className="border border-purple-500/10 bg-purple-500/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Need structured features?</h4>
            <p className="text-xs text-zinc-400">
              Run data cleaning and feature engineering in Feature Creator before scheduling model evaluations.
            </p>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={() => onNavigate('training')}>
          Configure Experiment
        </Button>
      </Card>
    </motion.div>
  );
};
export default MLDashboard;
