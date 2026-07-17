import React, { useState, useEffect } from 'react';
import { FileText, Download, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store';
import { api } from '../../lib/api.ts';

export const Reports: React.FC = () => {
  const { activeProject } = useUIStore();
  const [compiling, setCompiling] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadReports = async () => {
    if (!activeProject) return;
    try {
      setError(null);
      const list = await api.get('/api/reports', { projectId: String(activeProject.id) });
      const safeList = Array.isArray(list) ? list : [];
      setReports(safeList);
      if (safeList.length > 0) {
        useUIStore.setState({ reportStatus: 'Completed' });
      } else {
        useUIStore.setState({ reportStatus: 'Not Started' });
      }
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError("Failed to retrieve compiled reports from PostgreSQL.");
    }
  };

  useEffect(() => {
    loadReports();
  }, [activeProject]);

  const handleCompileReport = async () => {
    if (!activeProject) return;
    try {
      setCompiling(true);
      setError(null);
      const newReport = await api.post('/api/reports', {
        projectId: activeProject.id
      });
      setReports((prev) => [newReport, ...prev]);
      useUIStore.setState({ reportStatus: 'Completed' });
    } catch (err: any) {
      console.error("Failed to compile report:", err);
      setError("Failed to compile executive brief. Ensure project data exists.");
    } finally {
      setCompiling(false);
    }
  };

  const downloadReportFile = (report: any) => {
    // Generate a downloadable text/markdown file on the fly
    const element = document.createElement("a");
    const file = new Blob([report.content || "Empty report content."], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `${report.name.toLowerCase().replace(/\s+/g, '_')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="reports-view">
      <div>
        <h2 className="font-display font-extrabold text-3xl">Executive Reports Compiler</h2>
        <p className="text-zinc-400 text-sm">Generate and export automated PDF/HTML business intelligence briefings.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-center max-w-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="font-display font-bold text-lg">Report History Archive</h3>
            <p className="text-xs text-zinc-500">View and download compiled executive reports.</p>
          </div>

          <div className="space-y-3">
            {reports.map((report, idx) => (
              <div key={report.id || idx} className="flex flex-col p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-purple-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-200">{report.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Compiled {new Date(report.createdAt).toLocaleDateString()} • Real-Time Gemini Generated
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => downloadReportFile(report)}
                    className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-mono"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Markdown
                  </button>
                </div>
                
                {/* Content preview */}
                <div className="bg-black/20 p-3 rounded-lg border border-white/5 max-h-[160px] overflow-y-auto text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-wrap">
                  {report.content}
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-12 text-xs text-zinc-500">
                No reports compiled yet for this workspace pipeline. Click the Compile button to initiate one.
              </div>
            )}
          </div>
        </Card>

        {/* Generate actions */}
        <Card className="space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-display font-bold text-lg">Interactive Compiler</h3>
              <p className="text-xs text-zinc-500">Initiate automated document generation workflows.</p>
            </div>

            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-300 leading-relaxed">
                The reports engine integrates local predictive scores and parameters directly into structured templates, querying the Gemini LLM for executive summaries.
              </p>
            </div>
          </div>

          <Button
            onClick={handleCompileReport}
            isLoading={compiling}
            className="w-full mt-6 bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-95 text-white"
          >
            Compile Executive Briefing
          </Button>
        </Card>
      </div>
    </div>
  );
};
