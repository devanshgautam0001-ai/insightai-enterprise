import { useState } from 'react';
import { useDataset } from './useDataset';
import { DatasetService } from '../services/dataset.service';
import { useUIStore } from '../store';
import { api } from '../lib/api.ts';

export const useUpload = () => {
  const { setDataset } = useDataset();
  const { addNotification } = useUIStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    try {
      const resultDataset = await DatasetService.processUploadedFile(file);
      const activeProject = useUIStore.getState().activeProject;
      let finalDataset = resultDataset;

      if (activeProject) {
        const savedDataset = await api.post('/api/datasets', {
          projectId: activeProject.id,
          name: resultDataset.name,
          size: resultDataset.size,
          bytes: resultDataset.bytes,
          rows: resultDataset.rows,
          cols: resultDataset.cols,
          fileType: resultDataset.fileType,
          columnsData: resultDataset.columns,
          qualityMetrics: resultDataset.qualityMetrics,
          previewRows: resultDataset.previewRows,
          duplicateCount: resultDataset.duplicateCount,
          duplicatePercentage: resultDataset.duplicatePercentage,
          memoryUsage: resultDataset.memoryUsage
        });

        finalDataset = {
          id: String(savedDataset.id),
          name: savedDataset.name,
          size: savedDataset.size,
          bytes: savedDataset.bytes,
          rows: savedDataset.rows,
          cols: savedDataset.cols,
          fileType: savedDataset.fileType as any,
          uploadedAt: savedDataset.createdAt,
          columns: savedDataset.columnsData as any,
          qualityMetrics: savedDataset.qualityMetrics as any,
          previewRows: savedDataset.previewRows as any,
          duplicateCount: savedDataset.duplicateCount,
          duplicatePercentage: savedDataset.duplicatePercentage,
          memoryUsage: savedDataset.memoryUsage
        };
      }

      clearInterval(progressInterval);
      setProgress(100);
      setDataset(finalDataset);

      addNotification({
        title: 'Dataset Ingestion Succeeded',
        description: `Successfully ingested and saved ${file.name} to PostgreSQL database with ${resultDataset.rows.toLocaleString()} rows.`,
        type: 'success'
      });
    } catch (err: any) {
      clearInterval(progressInterval);
      const errMsg = err.message || 'Failed to parse dataset';
      setError(errMsg);
      addNotification({
        title: 'Dataset Ingestion Failed',
        description: errMsg,
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  return {
    isDragging,
    isUploading,
    progress,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    uploadFile
  };
};
