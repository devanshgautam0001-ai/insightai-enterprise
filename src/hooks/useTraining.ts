import { useState, useRef, useEffect, useCallback } from 'react';
import {
  TaskType,
  ModelAlgorithm,
  TrainingState,
  TrainingLog,
  MLModel,
} from '../types/model';
import mlService, { TASK_ALGORITHMS } from '../services/ml.service';
import { useUIStore } from '../store';
import { api } from '../lib/api.ts';

const INITIAL_STATE: TrainingState = {
  status: 'idle',
  progress: 0,
  etaSeconds: 0,
  currentEpoch: 0,
  totalEpochs: 10,
  logs: [],
  activeAlgorithm: null,
  hardwareStats: {
    cpuUsage: 0,
    ramUsage: 0,
    gpuUsage: 0,
    gpuTemp: 0,
  },
};

export const useTraining = () => {
  const { addNotification, activeProject } = useUIStore();
  const [trainingState, setTrainingState] = useState<TrainingState>(INITIAL_STATE);
  const [models, setModels] = useState<MLModel[]>([]);
  
  // Refs to manage async loops safely without re-renders or stale closures
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const stateRef = useRef<TrainingState>(INITIAL_STATE);
  const configRef = useRef<{
    taskType: TaskType;
    targetColumn: string;
    features: string[];
    algorithms: ModelAlgorithm[];
    hyperparameters: Record<string, any>;
    epochs: number;
    modelName?: string;
  } | null>(null);

  // Sync stateRef with state
  useEffect(() => {
    stateRef.current = trainingState;
  }, [trainingState]);

  // Load models from PostgreSQL
  const refreshModels = useCallback(async () => {
    if (!activeProject) {
      setModels([]);
      return;
    }
    try {
      const list = await api.get('/api/models', { projectId: String(activeProject.id) });
      const safeList = Array.isArray(list) ? list : [];
      const mapped: MLModel[] = safeList.map((m: any) => {
        const metrics = m.metrics || {};
        const featuresSelected = metrics.featuresSelected || m.features || ['amount', 'margin', 'transaction_id'];
        return {
          id: String(m.id),
          name: m.name,
          algorithm: m.algorithm as any,
          taskType: (metrics.accuracy !== undefined || metrics.precision !== undefined) ? 'classification' : 'regression',
          accuracy: m.accuracy,
          targetColumn: m.targetColumn,
          featuresSelected: featuresSelected,
          features: featuresSelected,
          featureImportance: metrics.featureImportance || [
            { feature: 'margin', importance: 0.65 },
            { feature: 'amount', importance: 0.25 },
            { feature: 'transaction_id', importance: 0.10 }
          ],
          confusionMatrix: metrics.confusionMatrix,
          rocCurve: metrics.rocCurve,
          metrics: metrics,
          hyperparameters: {
            learningRate: m.learningRate,
            testSplit: m.testSplit,
          },
          trainingTimeMs: metrics.trainingTimeMs || 2500,
          logs: m.logs || [],
          predictionStatus: m.predictionStatus || 'Not Started',
          createdAt: m.createdAt ? new Date(m.createdAt).toLocaleString() : new Date().toLocaleString(),
        } as any;
      });
      setModels(mapped);
      if (mapped.length > 0) {
        // Find latest trained model
        const latestModel = mapped[mapped.length - 1];
        useUIStore.setState({ 
          trainedModel: latestModel as any,
          predictionStatus: ((latestModel as any).predictionStatus || 'Not Started') as any
        });
      } else {
        useUIStore.setState({ 
          trainedModel: null,
          predictionStatus: 'Not Started'
        });
      }
    } catch (err) {
      console.error("Failed to load trained models from PostgreSQL:", err);
    }
  }, [activeProject]);

  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const pauseTraining = useCallback(() => {
    if (stateRef.current.status !== 'running') return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTrainingState((prev) => ({
      ...prev,
      status: 'paused',
      logs: [
        ...prev.logs,
        {
          timestamp: new Date().toLocaleTimeString(),
          message: 'Training execution PAUSED by operator.',
        },
      ],
    }));

    addNotification({
      title: 'Training Paused',
      description: 'Model optimization has been paused.',
      type: 'info',
    });
  }, [addNotification]);

  const resumeTraining = useCallback(() => {
    if (stateRef.current.status !== 'paused' || !configRef.current) return;

    setTrainingState((prev) => ({
      ...prev,
      status: 'running',
      logs: [
        ...prev.logs,
        {
          timestamp: new Date().toLocaleTimeString(),
          message: 'Training execution RESUMED.',
        },
      ],
    }));

    addNotification({
      title: 'Training Resumed',
      description: 'Model optimization has resumed.',
      type: 'info',
    });

    // Restart simulation loop
    runTrainingStep();
  }, [addNotification]);

  const cancelTraining = useCallback(() => {
    if (stateRef.current.status === 'idle' || stateRef.current.status === 'success') return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTrainingState((prev) => ({
      ...prev,
      status: 'cancelled',
      logs: [
        ...prev.logs,
        {
          timestamp: new Date().toLocaleTimeString(),
          message: '❌ Training execution TERMINATED by operator.',
        },
      ],
    }));

    addNotification({
      title: 'Training Cancelled',
      description: 'Model training was cancelled.',
      type: 'warning',
    });
  }, [addNotification]);

  const runTrainingStep = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const { status, currentEpoch, totalEpochs, activeAlgorithm } = stateRef.current;
      const config = configRef.current;

      if (status !== 'running' || !config) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }

      const totalAlgorithms = config.algorithms.length;
      const currentAlgoIndex = config.algorithms.indexOf(activeAlgorithm || config.algorithms[0]);

      // Calculate progress increment
      const nextEpoch = currentEpoch + 1;
      
      // Hardware simulation
      const cpuUsage = Math.round(75 + Math.random() * 20);
      const ramUsage = Math.round(55 + Math.random() * 10);
      const gpuUsage = Math.round(80 + Math.random() * 18);
      const gpuTemp = Math.round(68 + Math.random() * 10);

      // Total overall progress
      const currentAlgoBaseProgress = (currentAlgoIndex / totalAlgorithms) * 100;
      const progressWithinAlgo = (nextEpoch / totalEpochs) * (100 / totalAlgorithms);
      const nextProgress = Math.min(99.9, parseFloat((currentAlgoBaseProgress + progressWithinAlgo).toFixed(1)));

      // Estimate remaining time
      const secondsPerEpoch = 0.8;
      const remainingEpochsInCurrent = totalEpochs - nextEpoch;
      const remainingAlgos = totalAlgorithms - 1 - currentAlgoIndex;
      const etaSeconds = Math.round((remainingEpochsInCurrent + remainingAlgos * totalEpochs) * secondsPerEpoch);

      // Generate a mock log for the current state
      const mockLog = mlService.generateMockLogs(
        activeAlgorithm || config.algorithms[0],
        nextEpoch,
        totalEpochs,
        config.taskType
      );

      if (nextEpoch <= totalEpochs) {
        // Continue epochs on the same algorithm
        setTrainingState((prev) => ({
          ...prev,
          progress: nextProgress,
          currentEpoch: nextEpoch,
          etaSeconds,
          logs: [...prev.logs, mockLog],
          hardwareStats: { cpuUsage, ramUsage, gpuUsage, gpuTemp },
        }));
      } else {
        // Current algorithm completed. Check if there are more
        const nextAlgoIndex = currentAlgoIndex + 1;
        if (nextAlgoIndex < totalAlgorithms) {
          const nextAlgo = config.algorithms[nextAlgoIndex];
          
          const completionLog: TrainingLog = {
            timestamp: new Date().toLocaleTimeString(),
            message: `✓ Completed optimization for ${activeAlgorithm}. Starting next candidate: ${nextAlgo}...`,
          };

          setTrainingState((prev) => ({
            ...prev,
            activeAlgorithm: nextAlgo,
            currentEpoch: 0,
            progress: parseFloat(((nextAlgoIndex / totalAlgorithms) * 100).toFixed(1)),
            logs: [...prev.logs, completionLog],
          }));
        } else {
          // All algorithms trained fully! Complete training
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          // Build and save final models to PostgreSQL
          const savePromises = config.algorithms.map(async (algo) => {
            const finalModel = mlService.createTrainedModel(
              config.algorithms.length > 1 ? `AutoML ${algo.toUpperCase()}` : (config.modelName || 'Model Candidate'),
              algo,
              config.taskType,
              config.targetColumn,
              config.features,
              config.hyperparameters,
              Math.round(totalEpochs * secondsPerEpoch * 1000)
            );

            return api.post('/api/models', {
              projectId: activeProject?.id,
              name: finalModel.name,
              algorithm: finalModel.algorithm,
              accuracy: finalModel.accuracy ?? finalModel.metrics?.accuracy ?? finalModel.metrics?.r2 ?? 0.85,
              targetColumn: finalModel.targetColumn,
              testSplit: config.hyperparameters.testSplit || 20,
              learningRate: config.hyperparameters.learningRate || 0.03,
              metrics: {
                ...finalModel.metrics,
                featuresSelected: finalModel.featuresSelected,
                featureImportance: finalModel.featureImportance,
                confusionMatrix: finalModel.confusionMatrix,
                rocCurve: finalModel.rocCurve,
                trainingTimeMs: finalModel.trainingTimeMs,
              },
              logs: finalModel.logs || []
            });
          });

          Promise.all(savePromises).then((savedModels) => {
            if (savedModels.length > 0) {
              const lastModel = savedModels[savedModels.length - 1];
              const metrics = lastModel.metrics || {};
              const featuresSelected = metrics.featuresSelected || ['amount', 'margin', 'transaction_id'];
              // Sync back to standard store format safely
              useUIStore.setState({ 
                trainedModel: {
                  id: String(lastModel.id),
                  name: lastModel.name,
                  algorithm: lastModel.algorithm,
                  taskType: (metrics.accuracy !== undefined || metrics.precision !== undefined) ? 'classification' : 'regression',
                  accuracy: lastModel.accuracy,
                  targetColumn: lastModel.targetColumn,
                  featuresSelected: featuresSelected,
                  features: featuresSelected,
                  featureImportance: metrics.featureImportance || [],
                  confusionMatrix: metrics.confusionMatrix,
                  rocCurve: metrics.rocCurve,
                  metrics: metrics,
                  hyperparameters: {
                    learningRate: lastModel.learningRate,
                    testSplit: lastModel.testSplit,
                  },
                  trainingTimeMs: metrics.trainingTimeMs || 2500,
                  logs: lastModel.logs || [],
                  createdAt: lastModel.createdAt ? new Date(lastModel.createdAt).toLocaleString() : new Date().toLocaleString(),
                } as any
              });
            }
            refreshModels();
          }).catch(err => console.error("Failed to persist trained models to PostgreSQL:", err));

          const finalLog: TrainingLog = {
            timestamp: new Date().toLocaleTimeString(),
            message: `🎉 All candidates finished optimizing successfully. Saved ${config.algorithms.length} trained models into the Model Hub!`,
          };

          setTrainingState((prev) => ({
            ...prev,
            status: 'success',
            progress: 100,
            etaSeconds: 0,
            logs: [...prev.logs, finalLog],
            hardwareStats: { cpuUsage: 2, ramUsage: 15, gpuUsage: 0, gpuTemp: 42 },
          }));

          addNotification({
            title: 'AutoML Training Finished',
            description: `Successfully trained and evaluated ${config.algorithms.length} models.`,
            type: 'success',
          });
        }
      }
    }, 800);
  };

  const startTraining = useCallback(
    (
      taskType: TaskType,
      targetColumn: string,
      features: string[],
      algorithms: ModelAlgorithm[],
      hyperparameters: Record<string, any>,
      epochs: number = 10,
      modelName?: string
    ) => {
      if (stateRef.current.status === 'running') return;

      // Expand 'automl' if chosen
      let runAlgos = [...algorithms];
      if (algorithms.includes('automl')) {
        // AutoML runs a selection of compatible algorithms automatically
        runAlgos = TASK_ALGORITHMS[taskType].filter((a) => a !== 'automl').slice(0, 3);
      }

      configRef.current = {
        taskType,
        targetColumn,
        features,
        algorithms: runAlgos,
        hyperparameters,
        epochs,
        modelName,
      };

      const initialLog: TrainingLog = {
        timestamp: new Date().toLocaleTimeString(),
        message: `🚀 Initiated AutoML Session | Target: ${targetColumn} | Candidates: ${runAlgos.join(', ')}`,
      };

      setTrainingState({
        status: 'running',
        progress: 0,
        etaSeconds: Math.round(runAlgos.length * epochs * 0.8),
        currentEpoch: 0,
        totalEpochs: epochs,
        logs: [initialLog],
        activeAlgorithm: runAlgos[0],
        hardwareStats: {
          cpuUsage: 15,
          ramUsage: 45,
          gpuUsage: 5,
          gpuTemp: 45,
        },
      });

      addNotification({
        title: 'AutoML Started',
        description: `Training ${runAlgos.length} model algorithms on target '${targetColumn}'.`,
        type: 'info',
      });

      // We wait briefly to simulate cluster setup, then begin simulation loops
      setTimeout(() => {
        runTrainingStep();
      }, 500);
    },
    [addNotification]
  );

  return {
    trainingState,
    models,
    startTraining,
    pauseTraining,
    resumeTraining,
    cancelTraining,
    refreshModels,
  };
};

export default useTraining;
