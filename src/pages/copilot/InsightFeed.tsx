import React, { useState } from 'react';
import { useCopilot } from '../../hooks/useCopilot';
import { InsightCard } from '../../components/copilot/InsightCard';
import { RecommendationCard } from '../../components/copilot/RecommendationCard';
import { Sparkles, Cpu } from 'lucide-react';

export const InsightFeed: React.FC = () => {
  const { insights, recommendations } = useCopilot();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Insights' },
    { id: 'revenue', label: 'Revenue & Sales' },
    { id: 'risk', label: 'Risks & Churn' },
    { id: 'marketing', label: 'Marketing' }
  ];

  const filteredInsights = activeCategory === 'all'
    ? insights
    : insights.filter((ins) => ins.category === activeCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Executive Business Insights Feed</h2>
        <p className="text-sm text-zinc-400">
          Real-time proactive diagnostic tracking, margin evaluations, and behavioral predictive triggers.
        </p>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
              activeCategory === cat.id
                ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Insights Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">Active Strategic Insights</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInsights.map((ins) => (
              <InsightCard key={ins.id} insight={ins} />
            ))}
            {filteredInsights.length === 0 && (
              <div className="col-span-2 py-12 text-center text-zinc-500 font-mono text-xs italic">
                No active strategic insights categorized under this tag
              </div>
            )}
          </div>
        </div>

        {/* AutoML / Operational suggestions Column */}
        <div className="space-y-6 border-l border-white/5 lg:pl-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight">AutoML Pipeline Adjustments</h3>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.id} rec={rec} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default InsightFeed;
