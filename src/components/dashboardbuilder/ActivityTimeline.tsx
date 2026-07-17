import React from 'react';
import { Activity, Clock, Terminal } from 'lucide-react';
import { DashboardActivity } from '../../types/dashboard';

interface ActivityTimelineProps {
  activities: DashboardActivity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl text-xs space-y-3.5">
      {/* Header logs */}
      <div className="flex items-center space-x-2 pb-3.5 border-b border-white/5">
        <Activity className="w-4 h-4 text-purple-400" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Workspace Telemetry</h4>
          <p className="text-[10px] font-mono text-zinc-500">Global change log & audit details</p>
        </div>
      </div>

      {/* Timeline item loop */}
      <div className="space-y-3 max-h-[190px] overflow-y-auto custom-scrollbar pr-1">
        {activities.length === 0 ? (
          <div className="text-center py-4 text-zinc-500 italic text-[11px]">No logged operations yet.</div>
        ) : (
          activities.map((act) => {
            let actionColor = 'text-purple-400';
            if (act.action.includes('DELETED')) actionColor = 'text-rose-400';
            if (act.action.includes('RESTORED') || act.action.includes('ADDED')) actionColor = 'text-emerald-400';

            return (
              <div key={act.id} className="flex items-start space-x-2.5 text-[11px] hover:bg-white/[0.01] p-1 rounded-md transition-colors">
                <Terminal className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
                <div className="space-y-0.5 truncate flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-mono font-bold uppercase text-[9px] ${actionColor}`}>
                      {act.action.replace('_', ' ')}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-mono flex items-center">
                      <Clock className="w-2.5 h-2.5 mr-0.5" />
                      {act.timestamp}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-[10px] truncate leading-normal" title={act.details}>
                    {act.details}
                  </p>
                  <span className="text-[8px] font-mono text-zinc-600 block">by {act.userName}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default ActivityTimeline;
