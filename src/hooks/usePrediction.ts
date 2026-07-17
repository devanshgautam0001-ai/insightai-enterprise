import { useState, useCallback, useEffect } from 'react';
import { MLModel, PredictionResult } from '../types/model';
import mlService from '../services/ml.service';
import { useUIStore } from '../store';
import { api } from '../lib/api.ts';

export const usePrediction = (selectedModel: MLModel | null) => {
  const { addNotification, activeProject } = useUIStore();
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [batchResults, setBatchResults] = useState<PredictionResult[]>([]);

  const refreshHistory = useCallback(async () => {
    if (!activeProject) {
      setHistory([]);
      return;
    }
    try {
      const results = await api.get('/api/predictions', { projectId: String(activeProject.id) });
      const safeResults = Array.isArray(results) ? results : [];
      const mapped = safeResults.map((r: any) => ({
        id: String(r.id),
        input: r.inputData,
        prediction: r.prediction,
        confidence: r.confidence || undefined,
        probabilities: r.probabilities || undefined,
        timestamp: r.createdAt ? new Date(r.createdAt).toLocaleString() : new Date().toLocaleString()
      }));
      setHistory(mapped);
    } catch (err) {
      console.error("Failed to load predictions from PostgreSQL:", err);
      // Fallback
      setHistory(mlService.getPredictionHistory());
    }
  }, [activeProject]);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const predictSingle = useCallback(
    async (features: Record<string, any>): Promise<PredictionResult | null> => {
      if (!selectedModel || !activeProject) {
        addNotification({
          title: 'No Model Selected',
          description: 'Please select a trained model from the hub to run predictions.',
          type: 'warning',
        });
        return null;
      }

      setIsPredicting(true);
      return new Promise<PredictionResult>((resolve) => {
        setTimeout(async () => {
          const res = mlService.makePrediction(selectedModel, features);
          
          try {
            await api.post('/api/predictions', {
              projectId: activeProject.id,
              modelId: parseInt(selectedModel.id),
              inputData: features,
              prediction: String(res.prediction),
              confidence: res.confidence,
              probabilities: res.probabilities
            });
            useUIStore.setState({ predictionStatus: 'Completed' });
          } catch (err) {
            console.error("Failed to save single prediction to PostgreSQL:", err);
          }

          setIsPredicting(false);
          await refreshHistory();
          
          addNotification({
            title: 'Prediction Success',
            description: `Generated outcome: ${res.prediction}${
              res.confidence ? ` (${(res.confidence * 100).toFixed(1)}% confidence)` : ''
            }`,
            type: 'success',
          });
          resolve(res);
        }, 600);
      });
    },
    [selectedModel, activeProject, refreshHistory, addNotification]
  );

  const predictBatch = useCallback(
    async (csvText: string): Promise<PredictionResult[]> => {
      if (!selectedModel || !activeProject) {
        addNotification({
          title: 'No Model Selected',
          description: 'Please select a trained model from the hub to run predictions.',
          type: 'warning',
        });
        return [];
      }

      setIsPredicting(true);
      return new Promise<PredictionResult[]>((resolve) => {
        setTimeout(async () => {
          // Parse lines from CSV
          const lines = csvText.split('\n').map((l) => l.trim()).filter(Boolean);
          if (lines.length < 2) {
            addNotification({
              title: 'Empty File',
              description: 'The CSV must contain a header row and at least one data row.',
              type: 'warning',
            });
            setIsPredicting(false);
            resolve([]);
            return;
          }

          const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
          const parsedRows: Record<string, any>[] = [];

          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
            const row: Record<string, any> = {};
            headers.forEach((header, idx) => {
              const value = cols[idx];
              // Parse number if possible
              if (value !== undefined) {
                row[header] = isNaN(Number(value)) ? value : Number(value);
              }
            } );
            parsedRows.push(row);
          }

          // Run prediction on each row
          const results = parsedRows.map((row) => mlService.makePrediction(selectedModel, row));
          setBatchResults(results);

          // Save batch predictions to PostgreSQL
          try {
            const savePromises = results.map((res) => {
              return api.post('/api/predictions', {
                projectId: activeProject.id,
                modelId: parseInt(selectedModel.id),
                inputData: res.input,
                prediction: String(res.prediction),
                confidence: res.confidence,
                probabilities: res.probabilities
              });
            });
            await Promise.all(savePromises);
            useUIStore.setState({ predictionStatus: 'Completed' });
          } catch (err) {
            console.error("Failed to save batch predictions to PostgreSQL:", err);
          }

          setIsPredicting(false);
          await refreshHistory();

          addNotification({
            title: 'Batch Predictions Completed',
            description: `Successfully inferred outcomes for ${results.length} records.`,
            type: 'success',
          });

          resolve(results);
        }, 1200);
      });
    },
    [selectedModel, activeProject, refreshHistory, addNotification]
  );

  const clearBatchResults = useCallback(() => {
    setBatchResults([]);
  }, []);

  return {
    history,
    isPredicting,
    batchResults,
    predictSingle,
    predictBatch,
    clearBatchResults,
  };
};
export default usePrediction;
