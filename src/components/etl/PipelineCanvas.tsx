import React, { useRef, useState } from 'react';
import { Pipeline } from '../../types/pipeline';
import { PipelineNode as NodeCard } from './PipelineNode';
import { PipelineEdge as EdgeConnector } from './PipelineEdge';

interface PipelineCanvasProps {
  pipeline: Pipeline;
  onUpdateCoordinates: (id: string, x: number, y: number) => void;
  onRemoveNode: (id: string) => void;
  onAddEdge: (source: string, target: string) => void;
  isRunning?: boolean;
}

export const PipelineCanvas: React.FC<PipelineCanvasProps> = ({
  pipeline,
  onUpdateCoordinates,
  onRemoveNode,
  onAddEdge,
  isRunning = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);

  const handleDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setSelectedNodeId(nodeId);
    
    const node = pipeline.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Absolute constraint boundaries inside the canvas box
    const x = Math.max(10, Math.min(rect.width - 240, e.clientX - dragOffset.x));
    const y = Math.max(10, Math.min(rect.height - 100, e.clientY - dragOffset.y));

    onUpdateCoordinates(draggingNodeId, x, y);
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleNodeClick = (id: string) => {
    if (connectingSourceId) {
      if (connectingSourceId !== id) {
        onAddEdge(connectingSourceId, id);
      }
      setConnectingSourceId(null);
    } else {
      setSelectedNodeId(id);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setSelectedNodeId(null);
      setConnectingSourceId(null);
    }
  };

  const triggerConnection = () => {
    if (selectedNodeId) {
      setConnectingSourceId(selectedNodeId);
    }
  };

  return (
    <div className="relative flex flex-col h-[520px] bg-black/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      {/* Visual background engineering dots grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]" 
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        className="relative flex-grow overflow-auto cursor-crosshair select-none"
      >
        {/* SVG overlay to render node link connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {pipeline.edges.map((edge) => {
            const source = pipeline.nodes.find((n) => n.id === edge.source);
            const target = pipeline.nodes.find((n) => n.id === edge.target);
            if (!source || !target) return null;
            return (
              <EdgeConnector
                key={edge.id}
                sourceNode={source}
                targetNode={target}
                isRunning={isRunning}
              />
            );
          })}
        </svg>

        {/* Nodes layer */}
        {pipeline.nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={handleNodeClick}
            onRemove={onRemoveNode}
            onDragStart={handleDragStart}
          />
        ))}

        {connectingSourceId && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono px-3 py-1.5 rounded-full animate-pulse z-10">
            <span>Linking source: {pipeline.nodes.find((n) => n.id === connectingSourceId)?.label}</span>
            <button 
              onClick={() => setConnectingSourceId(null)}
              className="hover:text-white underline ml-1 font-bold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Floating control trigger overlay */}
      {selectedNodeId && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-zinc-950/90 border border-white/10 rounded-xl p-2 shadow-2xl backdrop-blur-md">
          <span className="text-[10px] font-mono text-zinc-500 uppercase px-2">
            Selected: {pipeline.nodes.find((n) => n.id === selectedNodeId)?.label}
          </span>
          <button
            onClick={triggerConnection}
            className="px-2.5 py-1 rounded bg-blue-500 hover:bg-blue-600 text-zinc-950 font-bold text-[10px] transition-all"
          >
            Connect Node
          </button>
        </div>
      )}
    </div>
  );
};
export default PipelineCanvas;
