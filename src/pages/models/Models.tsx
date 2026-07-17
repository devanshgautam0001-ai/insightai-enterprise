import React, { useState } from 'react';
import { MLDashboard } from '../ml/MLDashboard';
import { ModelTraining } from '../ml/ModelTraining';
import { ModelComparison } from '../ml/ModelComparison';
import { PredictionCenter } from '../ml/PredictionCenter';
import { Forecasting } from '../ml/Forecasting';
import { LayoutDashboard, BrainCircuit, BarChart3, Binary, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUIStore } from '../../store';

export const Models: React.FC = () => {
  const { modelsTab } = useUIStore();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  React.useEffect(() => {
    if (modelsTab) {
      setActiveTab(modelsTab);
    }
  }, [modelsTab]);

  const tabs = [
    { id: 'dashboard', label: 'Cockpit Overview', icon: LayoutDashboard },
    { id: 'training', label: 'AutoML Architect', icon: BrainCircuit },
    { id: 'comparison', label: 'Leaderboard Evaluator', icon: BarChart3 },
    { id: 'prediction', label: 'Prediction Hub', icon: Binary },
    { id: 'forecasting', label: 'Forecasting Station', icon: TrendingUp },
  ];

  const handleNavigate = (view: string) => {
    setActiveTab(view);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <MLDashboard onNavigate={handleNavigate} />;
      case 'training':
        return <ModelTraining />;
      case 'comparison':
        return <ModelComparison />;
      case 'prediction':
        return <PredictionCenter />;
      case 'forecasting':
        return <Forecasting />;
      default:
        return <MLDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="space-y-6" id="automl-master-workspace">
      {/* Tab Navigation header */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 relative ${
                isActive
                  ? 'text-purple-400 bg-purple-500/10 border border-purple-500/20'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.span
                  layoutId="activeTabUnderline"
                  className="absolute bottom-[-9px] left-4 right-4 h-[2px] bg-purple-500"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main workspace view rendered with AnimatePresence */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
export default Models;
