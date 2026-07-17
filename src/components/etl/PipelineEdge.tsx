import React from 'react';
import { PipelineNode } from '../../types/pipeline';

interface PipelineEdgeProps {
  sourceNode: PipelineNode;
  targetNode: PipelineNode;
  isRunning?: boolean;
}

export const PipelineEdge: React.FC<PipelineEdgeProps> = ({ sourceNode, targetNode, isRunning }) => {
  // Compute start/end coordinates of the line
  const startX = sourceNode.x + 224; // width of node is 56 (w-56 => 224px)
  const startY = sourceNode.y + 44; // halfway down height
  const endX = targetNode.x;
  const endY = targetNode.y + 44;

  // Draw a cubic bezier curve for smooth flows
  const controlX1 = startX + 50;
  const controlY1 = startY;
  const controlX2 = endX - 50;
  const controlY2 = endY;

  const pathD = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;

  return (
    <g>
      {/* Background thicker line for clickability or hover glow */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth={6}
        className="transition-all"
      />
      {/* Primary elegant connector */}
      <path
        d={pathD}
        fill="none"
        stroke={isRunning ? '#3b82f6' : 'rgba(255,255,255,0.12)'}
        strokeWidth={1.5}
        strokeDasharray={isRunning ? '4, 4' : undefined}
        className={isRunning ? 'animate-[dash_10s_linear_infinite]' : 'transition-colors'}
        style={{
          strokeDashoffset: isRunning ? 100 : undefined,
        }}
      />
    </g>
  );
};
export default PipelineEdge;
