import { useState, useCallback, useEffect } from 'react';
import etlService from '../services/etl.service';
import { RowData } from '../utils/dataCleaning';
import { DataQualityReport, TransformationStep } from '../types/pipeline';
import { useUIStore } from '../store';
import { api } from '../lib/api.ts';

export const useCleaning = () => {
  const { activeDataset, addNotification } = useUIStore();
  const [data, setData] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [report, setReport] = useState<DataQualityReport | null>(null);
  const [history, setHistory] = useState<TransformationStep[]>([]);
  const [isCleaning, setIsCleaning] = useState(false);

  const calculateStats = useCallback((currentData: RowData[]) => {
    if (currentData.length === 0) return;
    const cols = Object.keys(currentData[0]);
    setColumns(cols);
    const r = etlService.calculateQualityReport(currentData, cols);
    setReport(r);
  }, []);

  useEffect(() => {
    if (activeDataset && activeDataset.previewRows) {
      const initial = activeDataset.previewRows;
      setData(initial);
      calculateStats(initial);
    } else {
      setData([]);
      setColumns([]);
      setReport(null);
    }
  }, [activeDataset, calculateStats]);

  const applyTransformation = useCallback((step: TransformationStep) => {
    if (!activeDataset) return;
    setIsCleaning(true);
    setTimeout(async () => {
      let updated = [...data];

      if (step.type === 'rename_column' && step.column && step.targetColumn) {
        updated = updated.map((row) => {
          const { [step.column!]: val, ...rest } = row;
          return { ...rest, [step.targetColumn!]: val };
        });
      } else if (step.type === 'drop_column' && step.column) {
        updated = updated.map((row) => {
          const { [step.column!]: _, ...rest } = row;
          return rest;
        });
      } else if (step.type === 'filter_rows' && step.column && step.parameters.operator && step.parameters.value !== undefined) {
        const { operator, value } = step.parameters;
        updated = updated.filter((row) => {
          const cellVal = row[step.column!];
          if (operator === 'equals') return String(cellVal) === String(value);
          if (operator === 'contains') return String(cellVal).toLowerCase().includes(String(value).toLowerCase());
          if (operator === 'greater') return Number(cellVal) > Number(value);
          if (operator === 'less') return Number(cellVal) < Number(value);
          return true;
        });
      } else if (step.type === 'sort_rows' && step.column) {
        const direction = step.parameters.direction || 'asc';
        updated = [...updated].sort((a, b) => {
          const valA = a[step.column!];
          const valB = b[step.column!];
          if (typeof valA === 'number' && typeof valB === 'number') {
            return direction === 'asc' ? valA - valB : valB - valA;
          }
          const strA = String(valA || '').toLowerCase();
          const strB = String(valB || '').toLowerCase();
          if (strA < strB) return direction === 'asc' ? -1 : 1;
          if (strA > strB) return direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      try {
        const updatedDS = await api.put(`/api/datasets/${activeDataset.id}`, {
          previewRows: updated,
          cleaningStatus: 'Completed'
        });

        useUIStore.setState({ activeDataset: updatedDS, cleaningStatus: 'Completed' });
        setData(updated);
        setHistory((prev) => [...prev, step]);
        calculateStats(updated);
        
        addNotification({
          title: 'Transformation Applied',
          description: step.description,
          type: 'success',
        });
      } catch (err: any) {
        console.error("Failed to save transformation to PostgreSQL:", err);
      } finally {
        setIsCleaning(false);
      }
    }, 400);
  }, [data, activeDataset, calculateStats, addNotification]);

  const runOneClickClean = useCallback(() => {
    if (!activeDataset) return;
    setIsCleaning(true);
    setTimeout(async () => {
      // Automatic removal of duplicates and filling values
      let cleaned = [...data];
      const seen = new Set<string>();
      cleaned = cleaned.filter((row) => {
        const key = JSON.stringify(row);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Simple imputations on empty values
      columns.forEach((col) => {
        const hasNulls = cleaned.some((row) => row[col] === undefined || row[col] === null || row[col] === '');
        if (hasNulls) {
          const values = cleaned.map((row) => row[col]).filter((v) => v !== undefined && v !== null && v !== '');
          const numeric = values.map((v) => Number(v)).filter((v) => !isNaN(v));
          if (numeric.length > 0) {
            const mean = numeric.reduce((a, b) => a + b, 0) / numeric.length;
            cleaned = cleaned.map((row) => {
              if (row[col] === undefined || row[col] === null || row[col] === '') {
                return { ...row, [col]: parseFloat(mean.toFixed(2)) };
              }
              return row;
            });
          } else if (values.length > 0) {
            cleaned = cleaned.map((row) => {
              if (row[col] === undefined || row[col] === null || row[col] === '') {
                return { ...row, [col]: values[0] };
              }
              return row;
            });
          }
        }
      });

      try {
        const updatedDS = await api.put(`/api/datasets/${activeDataset.id}`, {
          previewRows: cleaned,
          cleaningStatus: 'Completed',
          duplicateCount: 0,
          duplicatePercentage: 0
        });

        useUIStore.setState({ activeDataset: updatedDS, cleaningStatus: 'Completed' });
        setData(cleaned);
        setHistory((prev) => [
          ...prev,
          {
            id: `step-${Date.now()}`,
            type: 'impute_missing',
            description: 'Automatic One-Click Purge of duplicates and missing values.',
            parameters: {},
          },
        ]);
        calculateStats(cleaned);

        addNotification({
          title: 'One-Click Optimization Complete',
          description: 'Duplicates removed and spare numeric distributions populated.',
          type: 'success',
        });
      } catch (err) {
        console.error("Failed to save one-click clean to PostgreSQL:", err);
      } finally {
        setIsCleaning(false);
      }
    }, 1200);
  }, [data, columns, activeDataset, calculateStats, addNotification]);

  return {
    data,
    setData,
    columns,
    report,
    history,
    setHistory,
    isCleaning,
    applyTransformation,
    runOneClickClean,
  };
};

export default useCleaning;
