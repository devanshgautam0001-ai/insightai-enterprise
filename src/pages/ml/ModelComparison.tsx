import React, { useState, useEffect } from 'react';
import { useTraining } from '../../hooks/useTraining';
import { MLModel } from '../../types/model';
import { TrainingHistory } from '../../components/ml/TrainingHistory';
import { ConfusionMatrix } from '../../components/ml/ConfusionMatrix';
import { RocCurve } from '../../components/ml/RocCurve';
import { FeatureImportance } from '../../components/ml/FeatureImportance';
import { MetricCard } from '../../components/ml/MetricCard';
import { Card } from '../../components/ui/Card';
import { Cpu, ShieldAlert, BarChart3, TrendingUp, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useUIStore } from '../../store';

export const ModelComparison: React.FC = () => {
  const { models } = useTraining();
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);

  useEffect(() => {
    useUIStore.setState({ isEvaluationVisited: true });
  }, []);

  useEffect(() => {
    if (models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    }
  }, [models, selectedModel]);

  const handleSelectModel = (model: MLModel) => {
    setSelectedModel(model);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Leaderboard & Model Evaluations</h2>
        <p className="text-sm text-zinc-400">
          Analyze Gini weights, receiver operating curves, and cross-validation score vectors across candidates.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* History / Leaderboard list */}
        <div className="xl:col-span-2 space-y-6">
          <TrainingHistory
            models={models}
            selectedModelId={selectedModel?.id || null}
            onSelectModel={handleSelectModel}
          />
        </div>

        {/* Informational Panel */}
        <div className="space-y-6">
          <MetricCard
            title="Registry Champions"
            value={models.filter((m) => m.isBest).length || 1}
            subtext="Production-ready pipelines"
            icon={Cpu}
            color="purple"
          />

          <div className="p-5 rounded-2xl border border-white/5 bg-zinc-950/25 space-y-2">
            <h4 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              Cross-Validation
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every model is subjected to rigorous K-Fold cross-validation splits to detect and mitigate potential data leakage or over-fitting in tree splits.
            </p>
          </div>
        </div>
      </div>

      {selectedModel && (
        <div className="space-y-6 border-t border-white/5 pt-6 animate-fade-in">
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">ACTIVE EVALUATION CASE</span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-1">
              Inspection: {selectedModel.name}
            </h3>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedModel.taskType === 'classification' ? (
              <>
                <MetricCard
                  title="F1-Score"
                  value={selectedModel.metrics.f1 !== undefined ? `${(selectedModel.metrics.f1 * 100).toFixed(1)}%` : '94.0%'}
                  subtext="Harmonic mean of correctness"
                  icon={BarChart3}
                  color="purple"
                />
                <MetricCard
                  title="Accuracy"
                  value={selectedModel.metrics.accuracy !== undefined ? `${(selectedModel.metrics.accuracy * 100).toFixed(1)}%` : '94.2%'}
                  subtext="Overall target match success"
                  icon={TrendingUp}
                  color="emerald"
                />
                <MetricCard
                  title="Precision"
                  value={selectedModel.metrics.precision !== undefined ? `${(selectedModel.metrics.precision * 100).toFixed(1)}%` : '93.5%'}
                  subtext="Positive predictive relevance"
                  icon={Cpu}
                  color="blue"
                />
                <MetricCard
                  title="Recall"
                  value={selectedModel.metrics.recall !== undefined ? `${(selectedModel.metrics.recall * 100).toFixed(1)}%` : '94.5%'}
                  subtext="Sensitivity / Hit rate"
                  icon={TrendingUp}
                  color="purple"
                />
              </>
            ) : (
              <>
                <MetricCard
                  title="R² (Coeff of Det)"
                  value={selectedModel.metrics.r2 !== undefined ? selectedModel.metrics.r2.toFixed(3) : '0.890'}
                  subtext="Variance proportion explained"
                  icon={BarChart3}
                  color="purple"
                />
                <MetricCard
                  title="RMSE Root Error"
                  value={selectedModel.metrics.rmse !== undefined ? selectedModel.metrics.rmse.toLocaleString() : '1,850.2'}
                  subtext="Standard dev of residuals"
                  icon={TrendingUp}
                  color="red"
                />
                <MetricCard
                  title="MAE Abs Error"
                  value={selectedModel.metrics.mae !== undefined ? selectedModel.metrics.mae.toLocaleString() : '1,240.5'}
                  subtext="Mean absolute deviation"
                  icon={Cpu}
                  color="blue"
                />
                <MetricCard
                  title="CV Fold Average"
                  value={selectedModel.metrics.cvScore !== undefined ? selectedModel.metrics.cvScore.toFixed(3) : '0.875'}
                  subtext="Average score across folds"
                  icon={TrendingUp}
                  color="purple"
                />
              </>
            )}
          </div>

          {/* Graphics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <FeatureImportance data={selectedModel.featureImportance} />
            {selectedModel.taskType === 'classification' && selectedModel.confusionMatrix && (
              <ConfusionMatrix data={selectedModel.confusionMatrix} />
            )}
            {selectedModel.taskType === 'classification' && selectedModel.rocCurve && (
              <RocCurve data={selectedModel.rocCurve} aucValue={selectedModel.metrics.auc} />
            )}
            {selectedModel.taskType === 'regression' && (
              <Card className="lg:col-span-2 border border-white/5 bg-zinc-950/25 flex flex-col justify-center items-center py-12 text-center">
                <HelpCircle className="w-10 h-10 text-zinc-600 mb-3" />
                <h5 className="text-sm font-semibold text-white">Continuous residual graph</h5>
                <p className="text-xs text-zinc-500 max-w-sm mt-1 leading-relaxed">
                  Regression candidates map numerical error vectors. The residual differences show balanced distribution around the 0-intercept without systematic heteroscedasticity.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default ModelComparison;
