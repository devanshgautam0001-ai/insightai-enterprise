import React, { useState, useEffect } from 'react';
import { Building, Users, ArrowRight, Plus } from 'lucide-react';
import { useUIStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { api } from '../../lib/api.ts';

export const WorkspacePage: React.FC = () => {
  const { workspaces, setWorkspace, setView, activeWorkspace } = useUIStore();
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDiv, setNewWorkspaceDiv] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load real workspaces from PostgreSQL on mount
  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await api.get('/api/workspaces');
      const safeList = Array.isArray(list) ? list : [];
      useUIStore.setState({ workspaces: safeList });
      
      // Auto-select first workspace if none selected and workspaces exist
      if (safeList.length > 0 && !activeWorkspace) {
        setWorkspace(safeList[0]);
      }
    } catch (err: any) {
      console.error("Failed to load workspaces:", err);
      setError("Failed to load secure enterprise workspaces from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  const handleSelect = (ws: any) => {
    setWorkspace(ws);
    setView('create-project');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const newWs = await api.post('/api/workspaces', {
        name: newWorkspaceName,
        division: newWorkspaceDiv || 'General Operations',
      });

      // Update local state store
      useUIStore.setState({ workspaces: [...workspaces, newWs] });
      setWorkspace(newWs);
      setNewWorkspaceName('');
      setNewWorkspaceDiv('');
      setShowCreate(false);
      setView('create-project');
    } catch (err: any) {
      console.error("Failed to create workspace:", err);
      setError(err.message || "Failed to create new tenant workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in" id="workspace-selection-page">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <Building className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="font-display font-extrabold text-3xl">Select Corporate Workspace</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Choose an active division workspace or register an isolated tenant space to host your predictive analytical models.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      {loading && workspaces.length === 0 ? (
        <div className="text-center py-12 text-xs text-zinc-400 font-mono">
          Querying secure PostgreSQL instances...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workspaces.map((ws, idx) => {
            const isSelected = activeWorkspace?.id === ws.id;
            return (
              <Card
                key={`workspace-item-${ws.id ?? ''}-${idx}`}
                onClick={() => handleSelect(ws)}
                hoverEffect
                className={`cursor-pointer transition-all border flex flex-col justify-between h-48 relative overflow-hidden group ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                      {ws.division}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-mono bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                        Selected
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-zinc-100 group-hover:text-blue-400 transition-colors">
                    {ws.name}
                  </h3>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
                    <Users className="w-3.5 h-3.5" />
                    <span>{ws.memberCount || 1} Members</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            );
          })}

          {/* Custom Create Workspace card */}
          {!showCreate ? (
            <Card
              key="workspace-register-trigger"
              onClick={() => setShowCreate(true)}
              hoverEffect
              className="cursor-pointer border border-dashed border-white/10 hover:border-white/30 bg-transparent flex flex-col items-center justify-center h-48 text-zinc-500 hover:text-white transition-all text-center"
            >
              <Plus className="w-8 h-8 mb-2 text-zinc-500" />
              <p className="font-display font-semibold text-sm">Register Tenant Workspace</p>
            </Card>
          ) : (
            <Card key="workspace-creation-form" className="border border-white/10 bg-brand-bg-sec flex flex-col justify-between h-48 p-5">
              <form onSubmit={handleCreate} className="space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Workspace Name"
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Division (e.g. Sales)"
                    value={newWorkspaceDiv}
                    onChange={(e) => setNewWorkspaceDiv(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 text-[10px] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-semibold flex items-center gap-1"
                  >
                    Confirm <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      {/* Professional Empty State when no workspaces are returned */}
      {!loading && workspaces.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl border border-white/5 max-w-md mx-auto p-8">
          <Building className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-display font-bold text-zinc-300">No active workspaces</h3>
          <p className="text-zinc-500 text-xs mt-2">
            Register your first corporate tenant workspace using the button above to begin.
          </p>
        </div>
      )}

      {activeWorkspace && (
        <div className="flex justify-center">
          <button
            onClick={() => setView('create-project')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all shadow-lg cursor-pointer"
          >
            Continue to Project Setup
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
