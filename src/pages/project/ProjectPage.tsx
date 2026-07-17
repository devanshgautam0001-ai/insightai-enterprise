import React, { useState, useEffect } from 'react';
import { FolderGit, Calendar, ArrowRight, Plus, Check } from 'lucide-react';
import { useUIStore } from '../../store';
import { Card } from '../../components/ui/Card';
import { api } from '../../lib/api.ts';

export const ProjectPage: React.FC = () => {
  const { activeWorkspace, activeProject, setActiveProject, setView, setProjects, projects } = useUIStore();
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load projects from PostgreSQL
  const loadProjects = async () => {
    if (!activeWorkspace) {
      setError("Please select or register a tenant workspace first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const list = await api.get('/api/projects', { workspaceId: String(activeWorkspace.id) });
      const safeList = Array.isArray(list) ? list : [];
      setProjects(safeList);
      
      // Auto-select first project if none active and projects exist
      if (safeList.length > 0 && !activeProject) {
        setActiveProject(safeList[0]);
      }
    } catch (err: any) {
      console.error("Failed to load projects:", err);
      setError("No projects found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [activeWorkspace]);

  const handleSelect = (proj: any) => {
    setActiveProject(proj);
    setView('datasets'); // Go to datasets view
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim() || !activeWorkspace) return;

    try {
      setLoading(true);
      setError(null);
      const newProj = await api.post('/api/projects', {
        workspaceId: activeWorkspace.id,
        name: projName,
        description: projDesc || 'Custom analytical workspace pipeline.',
      });

      const updated = [...projects, newProj];
      setProjects(updated);
      setActiveProject(newProj);
      setProjName('');
      setProjDesc('');
      setShowCreate(false);
      setView('datasets'); // Continue to datasets view
    } catch (err: any) {
      console.error("Failed to create project:", err);
      setError(err.message || "Failed to instantiate new analytics project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in" id="project-selection-page">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
          <FolderGit className="w-6 h-6 text-purple-400" />
        </div>
        <h2 className="font-display font-extrabold text-3xl">Active Analytics Projects</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Create or select a modular forecasting project. Each project isolated-sandbox manages separate data streams and models.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      {loading && projects.length === 0 ? (
        <div className="text-center py-12 text-xs text-zinc-400 font-mono">
          Loading modular workspace sandboxes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const isSelected = activeProject?.id === proj.id;
            return (
              <Card
                key={proj.id}
                onClick={() => handleSelect(proj)}
                hoverEffect
                className={`cursor-pointer transition-all border flex flex-col justify-between p-6 relative group ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/5'
                    : 'border-white/5 bg-white/[0.01] hover:border-white/20'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Created {new Date(proj.createdAt).toLocaleDateString()}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-mono bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-lg text-zinc-100 group-hover:text-purple-400 transition-colors">
                    {proj.name}
                  </h3>
                  <p className="text-zinc-400 text-xs leading-relaxed">{proj.description}</p>
                </div>

                <div className="flex items-center justify-end border-t border-white/5 pt-4 mt-6">
                  <span className="text-xs font-mono text-zinc-500 group-hover:text-purple-400 flex items-center gap-1">
                    Launch Pipeline <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                  </span>
                </div>
              </Card>
            );
          })}

          {/* Custom Create Project card */}
          {!showCreate ? (
            <Card
              onClick={() => setShowCreate(true)}
              hoverEffect
              className="cursor-pointer border border-dashed border-white/10 hover:border-white/30 bg-transparent flex flex-col items-center justify-center min-h-[220px] text-zinc-500 hover:text-white transition-all text-center"
            >
              <Plus className="w-8 h-8 mb-2 text-zinc-500 animate-pulse" />
              <p className="font-display font-semibold text-sm">Initiate New Project</p>
            </Card>
          ) : (
            <Card className="border border-white/10 bg-brand-bg-sec flex flex-col justify-between min-h-[220px] p-6">
              <form onSubmit={handleCreate} className="space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-400">New Project Bounds</h4>
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={projName}
                    onChange={(e) => setProjName(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                    required
                  />
                  <textarea
                    placeholder="Project Description / Analytical Objectives"
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    Confirm & Upload <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      {/* Professional Empty State when no projects exist */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl border border-white/5 max-w-md mx-auto p-8">
          <FolderGit className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-display font-bold text-zinc-300">No projects found</h3>
          <p className="text-zinc-500 text-xs mt-2">
            Create an analytical sandbox project above to begin ingesting files.
          </p>
        </div>
      )}

      {activeProject && (
        <div className="flex justify-center">
          <button
            onClick={() => setView('datasets')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium hover:opacity-90 transition-all shadow-lg cursor-pointer"
          >
            Continue to Dataset Ingestion
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
