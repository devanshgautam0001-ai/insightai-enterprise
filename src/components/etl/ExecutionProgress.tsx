import React from 'react';
import { Card } from '../ui/Card';
import { Terminal, Cpu, Clock } from 'lucide-react';

interface ExecutionProgressProps {
  logs: string[];
  isRunning: boolean;
  totalSteps: number;
  completedSteps: number;
}

export const ExecutionProgress: React.FC<ExecutionProgressProps> = ({
  logs,
  isRunning,
  totalSteps,
  completedSteps,
}) => {
  const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <Card className="p-6 bg-white/[0.01] border border-white/5 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/20 via-transparent to-transparent" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="font-display font-bold text-sm text-zinc-100 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span>Interactive Process Terminal</span>
          </h4>
          <p className="text-[11px] text-zinc-500 mt-0.5">Real-time compilation logs for local Node DAG runs.</p>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Time: 290ms</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-zinc-500" />
            <span>CPU: 4.8%</span>
          </div>
        </div>
      </div>

      {/* Progress scale */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-zinc-400">Pipeline compilation pipeline</span>
          <span className="text-blue-400 font-bold">{percentage}%</span>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Logs window terminal */}
      <div className="h-44 rounded-xl bg-black/60 border border-white/5 p-4 font-mono text-[10px] text-zinc-400 space-y-1.5 overflow-y-auto">
        {logs.length > 0 ? (
          logs.map((log, idx) => {
            const isError = log.includes('[ERROR]');
            return (
              <div key={idx} className={`leading-relaxed ${isError ? 'text-red-400' : 'text-zinc-300'}`}>
                <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                <span>{log}</span>
              </div>
            );
          })
        ) : isRunning ? (
          <div className="text-blue-400 animate-pulse">Initializing cluster nodes, resolving imports, checking schemas...</div>
        ) : (
          <div className="text-zinc-600">Terminal idle. Click "Run Pipeline" to begin streaming compilation logs.</div>
        )}
      </div>
    </Card>
  );
};
export default ExecutionProgress;
