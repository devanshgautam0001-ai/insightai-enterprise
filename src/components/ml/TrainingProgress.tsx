import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TrainingState } from '../../types/model';
import { ALGORITHM_LABELS } from '../../services/ml.service';
import { Cpu, Zap, Thermometer, Clock, Pause, Play, XCircle, CheckCircle2, RotateCw } from 'lucide-react';
import { motion } from 'motion/react';

interface TrainingProgressProps {
  trainingState: TrainingState;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  trainingState,
  onPause,
  onResume,
  onCancel,
}) => {
  const { status, progress, etaSeconds, currentEpoch, totalEpochs, activeAlgorithm, logs, hardwareStats } = trainingState;

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'paused':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'success':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'failed':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'cancelled':
        return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
      default:
        return 'text-zinc-500 bg-zinc-500/5 border-zinc-500/10';
    }
  };

  return (
    <Card className="border border-white/5 bg-zinc-950/40 backdrop-blur-md">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse">
            <RotateCw className="w-5 h-5" />
          </div>
          <div>
            <h2 id="training-progress-title" className="text-lg font-semibold text-white tracking-tight">Active AutoML Training session</h2>
            <p className="text-xs text-zinc-400 font-mono">
              {activeAlgorithm ? `OPTIMIZING: ${ALGORITHM_LABELS[activeAlgorithm]}` : 'PROVISIONING GPU CLUSTER'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-mono border capitalize ${getStatusColor()}`}>
            ● {status}
          </span>
          <span className="text-xs text-zinc-500 font-mono">
            Epoch {currentEpoch}/{totalEpochs}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
          <span>Overall Search Stack Optimizer</span>
          <span className="text-white font-semibold">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Status Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* ETA */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-400" />
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Estimated Time Left</p>
            <p className="text-sm font-semibold text-white">
              {etaSeconds > 0 ? `${etaSeconds} seconds` : '0s (Completed)'}
            </p>
          </div>
        </div>

        {/* CPU */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">CPU Core Allocation</p>
            <p className="text-sm font-semibold text-white">{hardwareStats.cpuUsage}% Utilized</p>
          </div>
        </div>

        {/* RAM */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
          <Zap className="w-5 h-5 text-purple-400" />
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">RAM Utilization</p>
            <p className="text-sm font-semibold text-white">{hardwareStats.ramUsage}% (32 GB)</p>
          </div>
        </div>

        {/* GPU */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
          <Thermometer className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">GPU NVIDIA A100G</p>
            <p className="text-sm font-semibold text-white">{hardwareStats.gpuUsage}% @ {hardwareStats.gpuTemp}°C</p>
          </div>
        </div>
      </div>

      {/* Real-time Training Logs Display */}
      <div className="space-y-2 mb-6">
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Active Training Logs</p>
        <div className="bg-zinc-950/70 border border-white/5 rounded-xl p-4 font-mono text-xs text-zinc-400 h-[180px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-zinc-800">
          {logs.slice(-8).map((log, idx) => (
            <div key={idx} className="flex gap-4 hover:bg-white/[0.01] py-0.5 rounded transition-colors">
              <span className="text-zinc-600 select-none">[{log.timestamp}]</span>
              <span className={log.message.includes('✓') || log.message.includes('Saved') ? 'text-emerald-400' : 'text-zinc-300'}>
                {log.message}
              </span>
              {log.loss !== undefined && (
                <span className="text-blue-400 ml-auto select-all">
                  loss: {log.loss} {log.valLoss !== undefined ? `| val_loss: ${log.valLoss}` : ''}
                </span>
              )}
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-zinc-600 italic text-center py-12">Initialising training stack partitions...</p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-end">
        {status === 'running' && (
          <Button variant="secondary" onClick={onPause}>
            <Pause className="w-4 h-4 mr-2" />
            Pause Training
          </Button>
        )}
        {status === 'paused' && (
          <Button variant="success" onClick={onResume}>
            <Play className="w-4 h-4 mr-2" />
            Resume Training
          </Button>
        )}
        {(status === 'running' || status === 'paused') && (
          <Button variant="danger" onClick={onCancel}>
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Session
          </Button>
        )}
        {status === 'success' && (
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-xs">
            <CheckCircle2 className="w-4.5 h-4.5" />
            Optimization complete
          </span>
        )}
      </div>
    </Card>
  );
};
export default TrainingProgress;
