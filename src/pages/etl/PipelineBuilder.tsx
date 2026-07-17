import React, { useState } from 'react';
import { usePipeline } from '../../hooks/usePipeline';
import { PipelineToolbar } from '../../components/etl/PipelineToolbar';
import { PipelineCanvas } from '../../components/etl/PipelineCanvas';
import { ExecutionProgress } from '../../components/etl/ExecutionProgress';
import { PreviewTable } from '../../components/etl/PreviewTable';
import { Card } from '../../components/ui/Card';
export const PipelineBuilder: React.FC = () => {
  const {
    pipeline,
    isRunning,
    executionLogs,
    previewData,
    addNode,
    removeNode,
    addEdge,
    runPipeline,
    savePipeline,
    updateNodeCoordinates,
  } = usePipeline();

  const [activeTab, setActiveTab] = useState<'canvas' | 'preview'>('canvas');

  if (!pipeline) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        <p className="text-zinc-500 text-xs font-mono">Initializing pipeline configuration stream...</p>
      </div>
    );
  }

  // Calculate stats for logs progress
  const totalSteps = pipeline.nodes.length;
  const completedSteps = pipeline.nodes.filter((n) => n.status === 'success').length;

  return (
    <div className="space-y-6 animate-fade-in" id="pipeline-builder-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white">Visual DAG Pipeline Editor</h3>
        <p className="text-xs text-zinc-400">Drag nodes, link connections, compile rules, and stream cached analytical outputs instantly.</p>
      </div>

      {/* Toolbar controls */}
      <PipelineToolbar
        onAddNode={addNode}
        onRun={runPipeline}
        onSave={savePipeline}
        onUndo={() => {}} // Simple no-op fallback for now
        onRedo={() => {}}
        isRunning={isRunning}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main interactive area */}
        <div className="xl:col-span-2 space-y-6">
          {/* Section tabs */}
          <div className="flex gap-2 border-b border-white/5 pb-px">
            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-px ${
                activeTab === 'canvas'
                  ? 'border-blue-500 text-blue-400 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-white'
              }`}
            >
              Interactive Pipeline Graph
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all -mb-px ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-400 font-bold'
                  : 'border-transparent text-zinc-500 hover:text-white'
              }`}
            >
              Analytical Partition Preview
            </button>
          </div>

          {activeTab === 'canvas' ? (
            <PipelineCanvas
              pipeline={pipeline}
              onUpdateCoordinates={updateNodeCoordinates}
              onRemoveNode={removeNode}
              onAddEdge={addEdge}
              isRunning={isRunning}
            />
          ) : (
            <Card className="p-6 bg-white/[0.01] border border-white/5">
              <PreviewTable
                data={previewData}
                columns={previewData.length > 0 ? Object.keys(previewData[0]) : []}
              />
            </Card>
          )}
        </div>

        {/* Diagnostic compilation terminal */}
        <div className="h-full">
          <ExecutionProgress
            logs={executionLogs}
            isRunning={isRunning}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
          />
        </div>
      </div>
    </div>
  );
};
export default PipelineBuilder;
