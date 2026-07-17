import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Cpu,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Wand2,
  Lock,
  CheckCircle2,
  Building,
  FolderGit,
  Upload,
  BarChart3,
  Binary,
  ShieldCheck
} from 'lucide-react';
import { useUIStore } from '../../store';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setView,
    userRole,
    isSidebarCollapsed,
    toggleSidebar,
    activeWorkspace,
    setWorkspace,
    isWorkspaceDropdownOpen,
    setWorkspaceDropdownOpen,
    workspaces,
    setLoggedIn,
    activeProject,
    activeDataset,
    trainedModel,
    isProfilingVisited,
    isQualityVisited,
    isEdaVisited,
    isEvaluationVisited,
    cleaningStatus,
    isFeatureEngineeringCompleted,
    predictionStatus,
    dashboardStatus,
    copilotStatus,
    reportStatus,
    setDatasetsTab,
    setModelsTab,
    setProfilingVisited,
    setQualityVisited,
    setEdaVisited,
    setEvaluationVisited,
    addNotification
  } = useUIStore();

  const pipelineStages = [
    { id: 'login', label: '1. Secure Auth', icon: ShieldCheck, targetView: 'login' },
    { id: 'workspace', label: '2. Select Workspace', icon: Building, targetView: 'workspace' },
    { id: 'create-project', label: '3. Create Project', icon: FolderGit, targetView: 'create-project' },
    { id: 'upload-dataset', label: '4. Upload Dataset', icon: Upload, targetView: 'datasets', subTab: 'upload' },
    { id: 'dataset-profiling', label: '5. Dataset Profiling', icon: BarChart3, targetView: 'datasets', subTab: 'columns' },
    { id: 'data-quality', label: '6. Data Quality', icon: ShieldCheck, targetView: 'datasets', subTab: 'quality' },
    { id: 'data-cleaning', label: '7. Data Cleaning', icon: Wand2, targetView: 'data-cleaning' },
    { id: 'feature-engineering', label: '8. Feature Engineering', icon: Cpu, targetView: 'feature-engineering' },
    { id: 'eda', label: '9. Exploratory Stats', icon: Activity, targetView: 'eda' },
    { id: 'train-model', label: '10. Train ML Model', icon: Cpu, targetView: 'models', subTab: 'training' },
    { id: 'evaluate-model', label: '11. Evaluate Model', icon: BarChart3, targetView: 'models', subTab: 'comparison' },
    { id: 'predictions', label: '12. Run Predictions', icon: Binary, targetView: 'models', subTab: 'prediction' },
    { id: 'dashboardbuilder', label: '13. Dashboard Builder', icon: LayoutDashboard, targetView: 'dashboardbuilder' },
    { id: 'copilot', label: '14. AI Copilot RAG', icon: Sparkles, targetView: 'copilot' },
    { id: 'reports', label: '15. Reports Compiler', icon: FileText, targetView: 'reports' },
    { id: 'settings', label: '16. Console Settings', icon: Settings, targetView: 'settings' },
    { id: 'user-management', label: '17. User Control Audit', icon: ShieldCheck, targetView: 'user-management' },
    { id: 'analytics-config', label: '18. Analytics Config', icon: Settings, targetView: 'analytics-config' }
  ];

  const getStageStatus = (id: string): 'locked' | 'current' | 'completed' => {
    // Step 1: Login
    if (id === 'login') return 'completed';

    // Step 2: Workspace
    if (id === 'workspace') {
      if (activeWorkspace) return 'completed';
      return 'current';
    }

    // Step 3: Create Project
    if (id === 'create-project') {
      if (!activeWorkspace) return 'locked';
      if (activeProject) return 'completed';
      return 'current';
    }

    // Step 4: Upload Dataset
    if (id === 'upload-dataset') {
      if (!activeProject) return 'locked';
      if (activeDataset) return 'completed';
      return 'current';
    }

    // Step 5: Dataset Profiling
    if (id === 'dataset-profiling') {
      if (!activeDataset) return 'locked';
      if (isProfilingVisited) return 'completed';
      return 'current';
    }

    // Step 6: Data Quality
    if (id === 'data-quality') {
      if (!activeDataset) return 'locked';
      if (isQualityVisited) return 'completed';
      return 'current';
    }

    // Step 7: Data Cleaning
    if (id === 'data-cleaning') {
      if (!activeDataset) return 'locked';
      if (cleaningStatus === 'Completed') return 'completed';
      return 'current';
    }

    // Step 8: Feature Engineering
    if (id === 'feature-engineering') {
      if (cleaningStatus !== 'Completed') return 'locked';
      if (isFeatureEngineeringCompleted) return 'completed';
      return 'current';
    }

    // Step 9: Exploratory Data Analysis
    if (id === 'eda') {
      if (cleaningStatus !== 'Completed') return 'locked';
      if (isEdaVisited) return 'completed';
      return 'current';
    }

    // Step 10: Train ML Model
    if (id === 'train-model') {
      if (cleaningStatus !== 'Completed') return 'locked';
      if (trainedModel) return 'completed';
      return 'current';
    }

    // Step 11: Evaluate Model
    if (id === 'evaluate-model') {
      if (!trainedModel) return 'locked';
      if (isEvaluationVisited) return 'completed';
      return 'current';
    }

    // Step 12: Predictions
    if (id === 'predictions') {
      if (!trainedModel) return 'locked';
      if (predictionStatus === 'Completed') return 'completed';
      return 'current';
    }

    // Step 13: Dashboard Builder
    if (id === 'dashboardbuilder') {
      if (!activeDataset) return 'locked';
      if (dashboardStatus === 'Completed') return 'completed';
      return 'current';
    }

    // Step 14: AI Copilot
    if (id === 'copilot') {
      if (!activeDataset) return 'locked';
      if (copilotStatus === 'Completed') return 'completed';
      return 'current';
    }

    // Step 15: Reports
    if (id === 'reports') {
      if (dashboardStatus !== 'Completed') return 'locked';
      if (reportStatus === 'Completed') return 'completed';
      return 'current';
    }

    // Step 16: Settings
    if (id === 'settings' || id === 'workspace' || id === 'user-management' || id === 'analytics-config') {
      if (userRole !== 'ADMIN') return 'locked';
      if (id === 'workspace' && activeWorkspace) return 'completed';
      return 'current';
    }

    return 'current';
  };

  const handleStageClick = (stage: typeof pipelineStages[0]) => {
    const status = getStageStatus(stage.id);

    if (status === 'locked') {
      let msg = 'This stage is locked.';
      if (stage.id === 'create-project') msg = 'Select a workspace in Step 2 first.';
      else if (stage.id === 'upload-dataset') msg = 'Create or select a project in Step 3 first.';
      else if (['dataset-profiling', 'data-quality', 'data-cleaning', 'dashboardbuilder', 'copilot'].includes(stage.id)) {
        msg = 'Upload a raw dataset in Step 4 first.';
      } else if (['feature-engineering', 'eda', 'train-model', 'evaluate-model'].includes(stage.id)) {
        msg = 'Complete data cleaning in Step 7 first.';
      } else if (stage.id === 'predictions') {
        msg = 'Train and save an AutoML model in Step 10 first.';
      } else if (stage.id === 'reports') {
        msg = 'Build a dynamic dashboard in Step 13 first.';
      } else if (['workspace', 'settings', 'user-management', 'analytics-config'].includes(stage.id)) {
        msg = 'This portal is restricted to authorized corporate administrators (ADMIN role only).';
      }

      addNotification({
        title: 'Pipeline Ingress Denied',
        description: msg,
        type: 'warning'
      });
      return;
    }

    // Handle sub-tab bindings
    if (stage.subTab) {
      if (stage.targetView === 'datasets') {
        setDatasetsTab(stage.subTab);
        if (stage.subTab === 'columns') setProfilingVisited(true);
        if (stage.subTab === 'quality') setQualityVisited(true);
      } else if (stage.targetView === 'models') {
        setModelsTab(stage.subTab);
        if (stage.subTab === 'comparison') setEvaluationVisited(true);
      }
    }

    // Trigger visited markers for other steps
    if (stage.id === 'eda') {
      setEdaVisited(true);
    }

    setView(stage.targetView);
  };

  return (
    <aside
      className={`bg-brand-bg-sec border-r border-white/5 transition-all duration-300 flex flex-col justify-between relative z-40 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col h-[calc(100vh-140px)] overflow-hidden">
        {/* Workspace Switcher Header */}
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <button
              onClick={() => activeWorkspace && setWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all text-left"
              disabled={!activeWorkspace}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="bg-gradient-to-tr from-brand-accent to-brand-success w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="truncate">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active Division</p>
                    <p className="text-xs font-bold truncate text-zinc-100">
                      {activeWorkspace ? activeWorkspace.name : 'No Active Tenant'}
                    </p>
                  </div>
                )}
              </div>
            </button>

            {/* Dropdown Options */}
            {isWorkspaceDropdownOpen && !isSidebarCollapsed && workspaces.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl glass-card p-2 border border-white/10 z-50 shadow-2xl">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      setWorkspace(ws);
                      setWorkspaceDropdownOpen(false);
                      setView('create-project');
                    }}
                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-white/[0.04] transition-all flex items-center justify-between"
                  >
                    <span className={activeWorkspace?.id === ws.id ? 'text-brand-accent font-bold' : 'text-zinc-300'}>
                      {ws.name}
                    </span>
                    {activeWorkspace?.id === ws.id && <Check className="w-3.5 h-3.5 text-brand-accent" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Executive Cockpit Link */}
        <div className="p-4 pb-2 border-b border-white/5">
          <button
            onClick={() => {
              if (!activeWorkspace || !activeProject) {
                addNotification({
                  title: 'Access Restricted',
                  description: 'Select Workspace (Step 2) and Create Project (Step 3) before accessing the Executive Cockpit.',
                  type: 'info'
                });
                return;
              }
              setView('dashboard');
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition-all duration-200 border ${
              currentView === 'dashboard'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.02] border-transparent'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 text-blue-400" />
            {!isSidebarCollapsed && <span>Executive Cockpit</span>}
          </button>
        </div>

        {/* Main Routing Menu List */}
        <div className="flex-grow overflow-y-auto px-4 py-3 space-y-1.5 scrollbar-thin">
          {!isSidebarCollapsed && (
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 mb-2">Pipeline Progress</p>
          )}
          {pipelineStages.map((stage) => {
            const Icon = stage.icon;
            const status = getStageStatus(stage.id);
            const isTargetActive = currentView === stage.targetView && 
              (!stage.subTab || (stage.targetView === 'datasets' ? useUIStore.getState().datasetsTab === stage.subTab : useUIStore.getState().modelsTab === stage.subTab));

            let textClass = 'text-zinc-400';
            let bgClass = 'hover:bg-white/[0.02]';
            let borderClass = 'border-l-2 border-transparent';

            if (status === 'locked') {
              textClass = 'text-zinc-600 cursor-not-allowed';
            } else if (isTargetActive) {
              textClass = 'text-blue-400 font-bold';
              bgClass = 'bg-blue-500/10';
              borderClass = 'border-l-4 border-blue-500 pl-2.5';
            } else if (status === 'completed') {
              textClass = 'text-zinc-300 hover:text-white';
            }

            return (
              <button
                key={stage.id}
                onClick={() => handleStageClick(stage)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${bgClass} ${textClass} ${borderClass}`}
                title={stage.label}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">{stage.label}</span>}
                </div>

                {!isSidebarCollapsed && (
                  <div className="shrink-0 ml-1">
                    {status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : status === 'locked' ? (
                      <Lock className="w-3.5 h-3.5 text-zinc-600" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar bottom drawer panel */}
      <div className="p-4 border-t border-white/5 space-y-2">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 transition-all"
          title="Collapse Panel"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4 text-zinc-400" /> : <ChevronLeft className="w-4 h-4 text-zinc-400" />}
        </button>

        <button
          onClick={async () => {
            try {
              const { signOut } = await import('firebase/auth');
              const { auth } = await import('../../lib/firebase.ts');
              await signOut(auth);
            } catch (e) {
              console.error("Firebase signout error:", e);
            }
            localStorage.removeItem('insightai_jwt');
            setLoggedIn(false);
            useUIStore.setState({ activeWorkspace: null, activeProject: null, activeDataset: null, trainedModel: null });
            setView('landing');
          }}
          className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
          title="Log Out"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

