import React from 'react';
import { Card } from '../../components/ui/Card';
import { Database, CheckCircle, Clock, Cpu } from 'lucide-react';

export const ETLDashboard: React.FC = () => {
  const activeJobs = [
    { name: 'Sync client ledger accounts', status: 'Active', speed: '2.4MB/s', size: '14.2GB', rate: '100%' },
    { name: 'Clean regional sales partitions', status: 'Idle', speed: '0.0MB/s', size: '420MB', rate: '100%' },
    { name: 'Export computed vector embeddings', status: 'Running', speed: '4.8MB/s', size: '8.4GB', rate: '85%' },
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="etl-dashboard-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white">ETL Process Operations</h3>
        <p className="text-xs text-zinc-400">Manage pipeline schedules, partition ingestion speed, and engine memory footprints.</p>
      </div>

      {/* Aggregate stats metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-white/[0.01] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/20 via-transparent to-transparent" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Active Streams</span>
              <p className="font-display font-extrabold text-2xl text-white">4 Pipelines</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Database className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white/[0.01] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/20 via-transparent to-transparent" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Aggregated Rate</span>
              <p className="font-display font-extrabold text-2xl text-emerald-400">100% Valid</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white/[0.01] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500/20 via-transparent to-transparent" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">RAM Footprint</span>
              <p className="font-display font-extrabold text-2xl text-white">480 MB</p>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Cpu className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white/[0.01] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-rose-500/20 via-transparent to-transparent" />
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Elapsed Average</span>
              <p className="font-display font-extrabold text-2xl text-white">12.5 ms/row</p>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* active jobs container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-4 bg-white/[0.01] border border-white/5">
          <div className="border-b border-white/5 pb-3">
            <h4 className="font-display font-bold text-sm text-zinc-200">Production Execution Streams</h4>
            <p className="text-[11px] text-zinc-500">Live operational streams feeding the grounded feature database.</p>
          </div>

          <div className="space-y-3">
            {activeJobs.map((job, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-bold text-white font-display">{job.name}</h5>
                  <div className="flex gap-3 text-[10px] font-mono text-zinc-500 mt-1 uppercase">
                    <span>Size: {job.size}</span>
                    <span>•</span>
                    <span>Throughput: {job.speed}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    job.status === 'Active' || job.status === 'Running'
                      ? 'bg-blue-500/15 text-blue-400 border-blue-500/20 animate-pulse'
                      : 'bg-zinc-500/10 text-zinc-400 border-white/5'
                  }`}>
                    {job.status}
                  </span>
                  
                  <div className="w-20 bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: job.rate }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Operational logs summaries */}
        <Card className="p-6 space-y-4 bg-white/[0.01] border border-white/5">
          <h4 className="font-display font-bold text-sm text-zinc-200">Cluster Diagnostics</h4>
          <div className="space-y-3 text-xs font-mono text-zinc-400">
            <div className="p-2.5 rounded bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <span>Primary Engine</span>
              <span className="text-emerald-400 font-bold uppercase">Online</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <span>Kubernetes Pods</span>
              <span className="text-white">6 Active</span>
            </div>
            <div className="p-2.5 rounded bg-white/[0.02] border border-white/5 flex justify-between items-center">
              <span>Data Sinks</span>
              <span className="text-blue-400">Grounded Store</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default ETLDashboard;
