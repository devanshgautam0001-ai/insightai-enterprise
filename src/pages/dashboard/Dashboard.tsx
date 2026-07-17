import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  Cpu, 
  Activity, 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Database, 
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import { useUIStore } from '../../store';
import { Card } from '../../components/ui/Card';
import dashboardService from '../../services/dashboard.service';
import mlService from '../../services/ml.service';

export const Dashboard: React.FC = () => {
  const { activeDataset, trainedModel, setView } = useUIStore();

  // Connect TanStack React Query for Enterprise Dashboard API Connectivity
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboardStats', activeDataset?.name, trainedModel?.name],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activeDataset,
          trainedModel,
          pipelineRunning: false,
          activities: dashboardService.getActivities(),
          predictions: mlService.getPredictionHistory()
        })
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve dynamic metrics from InsightAI server.');
      }
      return response.json();
    },
    enabled: !!activeDataset,
  });

  // Handle Empty State: "Upload a dataset to begin analysis"
  if (!activeDataset) {
    return (
      <div className="space-y-8 animate-fade-in" id="dashboard-empty-view">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-extrabold text-3xl">Executive Command Cockpit</h2>
            <p className="text-zinc-400 text-sm">Real-time macro predictive indicators and predictive loops.</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border border-white/5 bg-white/[0.01] rounded-2xl p-12 text-center backdrop-blur-md min-h-[450px]">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
            <Database className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h3 className="font-display font-bold text-xl text-zinc-100 mb-2">
            No Workspace Dataset Selected
          </h3>
          <p className="text-zinc-400 text-sm max-w-md mb-8">
            Upload a dataset to begin analysis. Once loaded, the InsightAI prediction engine will generate automated forecasts, workspace intelligence, and ML-grounded business indicators.
          </p>
          <button
            onClick={() => setView('datasets')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            Go to Datasets Hub
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Handle Loading State: Skeleton Loaders mimicking original elements
  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in" id="dashboard-loading-view">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="space-y-2 w-1/3">
            <div className="h-8 bg-white/5 rounded-md animate-pulse w-full" />
            <div className="h-4 bg-white/5 rounded-md animate-pulse w-2/3" />
          </div>
          <div className="h-8 bg-white/5 rounded-md animate-pulse w-48" />
        </div>

        {/* Bento Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="h-40 flex flex-col justify-between p-6">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-white/5 rounded w-24 animate-pulse" />
                <div className="h-4 w-4 bg-white/5 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-white/5 rounded w-36 animate-pulse" />
                <div className="h-3 bg-white/5 rounded w-28 animate-pulse" />
              </div>
              <div className="h-1 bg-white/5 rounded-full w-full animate-pulse" />
            </Card>
          ))}
        </div>

        {/* Charts & recommendations Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 h-96 p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-6 bg-white/5 rounded w-48 animate-pulse" />
              <div className="h-3 bg-white/5 rounded w-72 animate-pulse" />
            </div>
            <div className="h-48 bg-white/5 rounded w-full animate-pulse" />
          </Card>
          <Card className="h-96 p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="h-6 bg-white/5 rounded w-36 animate-pulse" />
              <div className="h-3 bg-white/5 rounded w-48 animate-pulse" />
            </div>
            <div className="space-y-4 flex-grow mt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-white/5 rounded-xl w-full animate-pulse" />
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Handle Error State
  if (isError) {
    return (
      <div className="space-y-8 animate-fade-in" id="dashboard-error-view">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-display font-extrabold text-3xl">Executive Command Cockpit</h2>
            <p className="text-zinc-400 text-sm">Real-time macro predictive indicators and predictive loops.</p>
          </div>
        </div>

        <div className="border border-red-500/20 bg-red-500/10 rounded-2xl p-8 text-center max-w-2xl mx-auto my-12">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-200 mb-2">Failed to Sync Live Workspace Intelligence</h3>
          <p className="text-sm text-zinc-400 mb-6">
            {error instanceof Error ? error.message : "An unknown communication error occurred while connecting to the InsightAI backend metrics server."}
          </p>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-medium mx-auto transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Server Connection
          </button>
        </div>
      </div>
    );
  }

  // Loaded state values returned from server
  const metrics = data?.success ? data.data : data;

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-view">
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl">Executive Command Cockpit</h2>
          <p className="text-zinc-400 text-sm">Real-time macro predictive indicators and predictive loops.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Refresh feedback */}
          {isFetching && (
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              Syncing live metrics...
            </div>
          )}
          {/* Date badge */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 text-xs font-mono text-zinc-400 flex items-center gap-2 self-start">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            Live Feed: {activeDataset.name}
          </div>
        </div>
      </div>

      {/* Top Bento Row: Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric Card 1: Revenue (Dynamic calculations) */}
        <Card hoverEffect className="flex flex-col justify-between h-40">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-widest">Enterprise Revenue</span>
            <DollarSign className="w-4 h-4 text-brand-success" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-display font-bold text-glow-green text-emerald-400">
              {metrics.revenueFormatted}
            </p>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              {metrics.vsBaselineText}
            </p>
          </div>
          <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${metrics.revenueProgress}%` }} />
          </div>
        </Card>

        {/* Metric Card 2: Predict Accuracy (Dynamic model metrics) */}
        <Card hoverEffect className="flex flex-col justify-between h-40">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-widest">AutoML Predict Accuracy</span>
            <Cpu className="w-4 h-4 text-brand-accent" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-display font-bold text-glow-blue text-blue-400">
              {metrics.modelAccuracy}
            </p>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              {metrics.modelRegistryNote}
            </p>
          </div>
          <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${metrics.modelAccuracyPercentage}%` }} />
          </div>
        </Card>

        {/* Metric Card 3: Ingestion pipelines */}
        <Card hoverEffect className="flex flex-col justify-between h-40">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-widest">ETL Pipeline Status</span>
            <Activity className="w-4 h-4 text-brand-warning" />
          </div>
          <div className="my-2">
            <p className={`text-3xl font-display font-bold ${metrics.etlStatus === 'ACTIVE RUN' ? 'text-brand-warning animate-pulse' : 'text-emerald-400'}`}>
              {metrics.etlStatus}
            </p>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              {metrics.etlProgressText}
            </p>
          </div>
          <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
            <div 
              className={`h-full ${metrics.etlStatus === 'ACTIVE RUN' ? 'bg-brand-warning animate-pulse' : 'bg-emerald-500'}`} 
              style={{ width: `${metrics.etlProgress}%` }} 
            />
          </div>
        </Card>

        {/* Metric Card 4: Quality score (Derived profiling average) */}
        <Card hoverEffect className="flex flex-col justify-between h-40">
          <div className="flex justify-between items-start text-zinc-400">
            <span className="text-xs font-mono uppercase tracking-widest">Workspace Data Quality</span>
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-2">
            <p className="text-3xl font-display font-bold text-emerald-400">
              {metrics.dataQualityPercent}%
            </p>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              {metrics.dataQualityText}
            </p>
          </div>
          <div className="w-full bg-white/[0.05] h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full" style={{ width: `${metrics.dataQualityPercent}%` }} />
          </div>
        </Card>
      </div>

      {/* Secondary Bento Grid Row: Interactive Large Charts & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recharts interactive revenue forecast area chart with dynamic values */}
        <Card className="lg:col-span-2 flex flex-col justify-between h-96">
          <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
            <div>
              <h3 className="font-display font-bold text-lg">Predictive Revenue Growth Path</h3>
              <p className="text-xs text-zinc-500">Overlay of actual billing metrics against ML models projections.</p>
            </div>
            <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-lg p-1">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-brand-success text-white uppercase">Actuals</span>
              <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-brand-accent text-white uppercase">ML Projections</span>
            </div>
          </div>

          <div className="flex-grow w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.chartsData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Actual Revenue" />
                <Area type="monotone" dataKey="target" stroke="#3B82F6" strokeDasharray="4 4" strokeWidth={1.5} fillOpacity={1} fill="url(#colorTarget)" name="Projected Path" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right: Predictive Health / Strategic Recommendations Alert panel */}
        <Card className="flex flex-col h-96 justify-between">
          <div className="border-b border-white/5 pb-4 mb-4">
            <h3 className="font-display font-bold text-lg">AI Strategic Recommendations</h3>
            <p className="text-xs text-zinc-500">Real-time alerts grounded in live dataset telemetry.</p>
          </div>

          <div className="flex-grow space-y-4 overflow-y-auto pr-1 custom-scrollbar">
            {metrics.recommendations.map((rec: any, idx: number) => {
              const bgClass = rec.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' :
                              rec.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' :
                              'bg-blue-500/10 border-blue-500/20 text-blue-300';
              
              const IconComponent = rec.type === 'warning' ? AlertTriangle :
                                    rec.type === 'success' ? CheckCircle :
                                    Sparkles;

              return (
                <div key={idx} className={`p-3.5 rounded-xl border flex gap-3 ${bgClass}`}>
                  <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold">{rec.title}</p>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Tertiary Bento Row: Workspace Prediction Feed & Recent Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prediction history feed */}
        <Card className="lg:col-span-2 flex flex-col justify-between min-h-[250px]">
          <div className="border-b border-white/5 pb-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-lg">Predictive Decision Feed</h3>
                <p className="text-xs text-zinc-500">Inbound evaluation streams validated on-chain via trained ML parameters.</p>
              </div>
              <span className="text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded text-blue-400 uppercase tracking-wider">
                Live Ingress
              </span>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto max-h-[180px] pr-1 space-y-3">
            {metrics.predictionFeed.map((pred: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-zinc-300">
                      ID: {pred.id} {pred.features ? `(Feature: ${Object.keys(pred.features)[0]}=${Object.values(pred.features)[0]})` : ''}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">Confidence: {(pred.confidence * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {pred.prediction}
                  </span>
                  <p className="text-[9px] text-zinc-600 mt-1 font-mono">{pred.timestamp || 'Just now'}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Workspace activity logs */}
        <Card className="flex flex-col justify-between min-h-[250px]">
          <div className="border-b border-white/5 pb-4 mb-4">
            <h3 className="font-display font-bold text-lg">System Audit Activity</h3>
            <p className="text-xs text-zinc-500">Audit logs tracking ETL runs, model trains, and workspace actions.</p>
          </div>

          <div className="flex-grow overflow-y-auto max-h-[180px] pr-1 space-y-3">
            {metrics.recentActivity.map((act: any, idx: number) => (
              <div key={idx} className="flex gap-3 p-2.5 rounded-xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mt-0.5 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-300 truncate">{act.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase px-1 rounded bg-white/5 border border-white/5">
                      {act.event}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-600">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
