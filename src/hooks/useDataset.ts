import { useState, useEffect } from 'react';
import { DataEngineDataset } from '../types/dataset';
import { useUIStore } from '../store';
import { api } from '../lib/api.ts';

export const useDataset = () => {
  const { setActiveDataset, activeProject } = useUIStore();
  const [dataEngineDataset, setDataEngineDataset] = useState<DataEngineDataset | null>(null);

  useEffect(() => {
    const fetchDataset = async () => {
      if (!activeProject) {
        setDataEngineDataset(null);
        setActiveDataset(null);
        return;
      }

      try {
        const list = await api.get('/api/datasets', { projectId: String(activeProject.id) });
        const safeList = Array.isArray(list) ? list : [];
        if (safeList.length > 0) {
          // Retrieve the latest uploaded dataset for the active project
          const latest = safeList[safeList.length - 1];
          const parseIfString = (val: any) => {
            if (typeof val === 'string') {
              try {
                return JSON.parse(val);
              } catch (e) {
                console.error("Failed to parse JSON string in useDataset:", val, e);
                return val;
              }
            }
            return val;
          };

          const coerced: DataEngineDataset = {
            id: latest.id,
            name: latest.name,
            size: latest.size,
            bytes: latest.bytes,
            rows: latest.rows,
            cols: latest.cols,
            fileType: latest.fileType as any,
            uploadedAt: latest.createdAt,
            columns: parseIfString(latest.columnsData) as any,
            qualityMetrics: parseIfString(latest.qualityMetrics) as any,
            previewRows: parseIfString(latest.previewRows) as any,
            duplicateCount: latest.duplicateCount,
            duplicatePercentage: latest.duplicatePercentage,
            memoryUsage: latest.memoryUsage
          };

          setDataEngineDataset(coerced);
          setActiveDataset(coerced as any);

          useUIStore.setState({
            cleaningStatus: (latest.cleaningStatus as any) || 'Not Started',
            isFeatureEngineeringCompleted: latest.featureEngineeringStatus === 'Completed'
          });
        } else {
          setDataEngineDataset(null);
          setActiveDataset(null);
          useUIStore.setState({
            cleaningStatus: 'Not Started',
            isFeatureEngineeringCompleted: false
          });
        }
      } catch (err) {
        console.error("Failed to fetch project datasets from PostgreSQL:", err);
        setDataEngineDataset(null);
        setActiveDataset(null);
      }
    };

    fetchDataset();
  }, [activeProject, setActiveDataset]);

  const updateActiveDataset = async (ds: DataEngineDataset) => {
    setDataEngineDataset(ds);
    setActiveDataset(ds as any);
  };

  return {
    dataset: dataEngineDataset,
    setDataset: updateActiveDataset
  };
};
