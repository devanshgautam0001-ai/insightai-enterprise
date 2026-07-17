import { useState, useCallback, useEffect } from 'react';
import { Pipeline, PipelineNode, PipelineEdge } from '../types/pipeline';
import etlService from '../services/etl.service';
import { useUIStore } from '../store';
import { RowData } from '../utils/dataCleaning';

export const usePipeline = () => {
  const { addNotification } = useUIStore();
  const [pipeline, setPipeline] = useState<Pipeline | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [previewData, setPreviewData] = useState<RowData[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  useEffect(() => {
    const active = etlService.getActivePipeline();
    setPipeline(active);
    setPreviewData(etlService.getPreviewData());
  }, []);

  const savePipeline = useCallback(() => {
    if (pipeline) {
      etlService.updateActivePipeline(pipeline);
      addNotification({
        title: 'Pipeline Saved',
        description: `Successfully stored configuration structure v${pipeline.version}.`,
        type: 'success',
      });
    }
  }, [pipeline, addNotification]);

  const addNode = useCallback((type: 'source' | 'clean' | 'transform' | 'engineer' | 'sink') => {
    if (!pipeline) return;
    const newId = `node-${Date.now()}`;
    const labels = {
      source: 'Ingress Stream',
      clean: 'Clean Impute',
      transform: 'Data Transformer',
      engineer: 'Feature Creator',
      sink: 'DB Storage Sink',
    };
    
    const newNode: PipelineNode = {
      id: newId,
      type,
      label: labels[type],
      status: 'idle',
      x: 350 + Math.random() * 50,
      y: 180 + Math.random() * 50,
      config: {},
    };

    const updated = {
      ...pipeline,
      nodes: [...pipeline.nodes, newNode],
    };
    setPipeline(updated);
    etlService.updateActivePipeline(updated);
  }, [pipeline]);

  const removeNode = useCallback((id: string) => {
    if (!pipeline) return;
    const updated = {
      ...pipeline,
      nodes: pipeline.nodes.filter((n) => n.id !== id),
      edges: pipeline.edges.filter((e) => e.source !== id && e.target !== id),
    };
    setPipeline(updated);
    etlService.updateActivePipeline(updated);
  }, [pipeline]);

  const addEdge = useCallback((source: string, target: string) => {
    if (!pipeline) return;
    if (pipeline.edges.some((e) => e.source === source && e.target === target)) return;
    const newEdge: PipelineEdge = {
      id: `edge-${Date.now()}`,
      source,
      target,
    };
    const updated = {
      ...pipeline,
      edges: [...pipeline.edges, newEdge],
    };
    setPipeline(updated);
    etlService.updateActivePipeline(updated);
  }, [pipeline]);

  const runPipeline = useCallback(async () => {
    if (!pipeline) return;
    const validation = etlService.validatePipeline(pipeline);
    if (!validation.valid) {
      addNotification({
        title: 'Validation Failed',
        description: validation.errors[0],
        type: 'error',
      });
      return;
    }

    setIsRunning(true);
    setExecutionLogs([]);
    let logs: string[] = [];

    // Reset status to running sequentially
    const updatedNodes = pipeline.nodes.map((n) => ({ ...n, status: 'idle' as const }));
    setPipeline({ ...pipeline, nodes: updatedNodes });

    let currentStepData = [...etlService.getSampleData()];

    for (let i = 0; i < pipeline.nodes.length; i++) {
      const node = pipeline.nodes[i];
      
      // Update specific node to running
      setPipeline((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          nodes: prev.nodes.map((n) => (n.id === node.id ? { ...n, status: 'running' as const } : n)),
        };
      });

      // Simulation delay
      await new Promise((r) => setTimeout(r, 600));

      try {
        const { data, log } = await etlService.runNodeTransformation(node, currentStepData);
        currentStepData = data;
        logs = [...logs, log];
        setExecutionLogs([...logs]);

        // Update specific node to success
        setPipeline((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            nodes: prev.nodes.map((n) => (n.id === node.id ? { ...n, status: 'success' as const } : n)),
          };
        });
      } catch (err: any) {
        logs = [...logs, `[ERROR] Node [${node.label}] failed: ${err.message}`];
        setExecutionLogs([...logs]);
        setPipeline((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            nodes: prev.nodes.map((n) => (n.id === node.id ? { ...n, status: 'failed' as const } : n)),
          };
        });
        setIsRunning(false);
        return;
      }
    }

    setPreviewData(currentStepData);
    setIsRunning(false);
    addNotification({
      title: 'Execution Completed',
      description: 'Pipeline completed processing all rows successfully.',
      type: 'success',
    });
  }, [pipeline, addNotification]);

  const updateNodeCoordinates = useCallback((nodeId: string, x: number, y: number) => {
    setPipeline((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
      };
    });
  }, []);

  return {
    pipeline,
    setPipeline,
    isRunning,
    executionLogs,
    previewData,
    activeNodeId,
    setActiveNodeId,
    addNode,
    removeNode,
    addEdge,
    runPipeline,
    savePipeline,
    updateNodeCoordinates,
  };
};
export default usePipeline;
