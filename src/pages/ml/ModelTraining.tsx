import React from 'react';
import { useTraining } from '../../hooks/useTraining';
import { TrainingPanel } from '../../components/ml/TrainingPanel';
import { TrainingProgress } from '../../components/ml/TrainingProgress';
import { HyperParameterPanel } from '../../components/ml/HyperParameterPanel';
import { Card } from '../../components/ui/Card';
import { BrainCircuit } from 'lucide-react';
import { motion } from 'motion/react';

export const ModelTraining: React.FC = () => {
  const { trainingState, startTraining, pauseTraining, resumeTraining, cancelTraining } = useTraining();

  // Columns & Row structures to train on
  const datasetColumns = ['amount', 'margin', 'transaction_id', 'segment', 'churn_flag', 'session_duration'];
  const datasetRows = [
    { amount: 15400, margin: 0.15, transaction_id: 101, segment: 'Enterprise', churn_flag: 0, session_duration: 120 },
    { amount: 3200, margin: 0.08, transaction_id: 102, segment: 'SMB', churn_flag: 1, session_duration: 45 },
    { amount: 48000, margin: 0.22, transaction_id: 103, segment: 'Enterprise', churn_flag: 0, session_duration: 310 },
    { amount: 1200, margin: 0.05, transaction_id: 104, segment: 'SMB', churn_flag: 0, session_duration: 15 },
    { amount: 9500, margin: 0.12, transaction_id: 105, segment: 'Mid-Market', churn_flag: 0, session_duration: 85 },
  ];

  const isTrainingActive = trainingState.status === 'running' || trainingState.status === 'paused';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">AutoML Model training Architect</h2>
        <p className="text-sm text-zinc-400">
          Design, test and compile optimized neural configurations and ensemble structures automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {!isTrainingActive && trainingState.status !== 'success' ? (
            <TrainingPanel
              isTraining={isTrainingActive}
              datasetColumns={datasetColumns}
              datasetRows={datasetRows}
              onStartTraining={startTraining}
            />
          ) : (
            <TrainingProgress
              trainingState={trainingState}
              onPause={pauseTraining}
              onResume={resumeTraining}
              onCancel={cancelTraining}
            />
          )}
        </div>

        <div className="space-y-6">
          {/* Informational Panel */}
          <Card className="border border-white/5 bg-zinc-950/25 p-5">
            <div className="flex items-center gap-2 mb-4">
              <BrainCircuit className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-semibold text-white tracking-tight">Neural search Engine</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed space-y-2">
              Our automated ML engine tests multiple candidates sequentially. It optimizes hyperparameter constraints using Bayesian search algorithms, checking the following:
            </p>
            <ul className="text-xs text-zinc-400 mt-3 list-disc pl-4 space-y-1.5 font-mono">
              <li>Automatic column distribution shape detection.</li>
              <li>Outlier mitigation via Huber thresholds.</li>
              <li>Ensembling weights using Ridge stacking.</li>
            </ul>
          </Card>

          {/* Hyperparameter view/edit depending on state */}
          <HyperParameterPanel
            isReadOnly={isTrainingActive || trainingState.status === 'success'}
            hyperparameters={[
              { name: 'n_estimators', type: 'int', value: 200, range: [10, 500] },
              { name: 'max_depth', type: 'int', value: 6, range: [2, 32] },
              { name: 'learning_rate', type: 'float', value: 0.05, range: [0.01, 0.5] },
            ]}
          />
        </div>
      </div>
    </motion.div>
  );
};
export default ModelTraining;
