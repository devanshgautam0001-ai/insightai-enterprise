import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Check, Sparkles, BookOpen } from 'lucide-react';
import copilotService from '../../services/copilot.service';

export const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState<'md' | 'html' | 'pdf' | 'pptx'>('md');
  const [generating, setGenerating] = useState(false);
  const [complete, setComplete] = useState(false);

  const demoMessages = [
    {
      id: '1',
      role: 'user' as const,
      content: 'Provide an executive summary of current transaction amounts and margins.',
      timestamp: '10:15 AM'
    },
    {
      id: '2',
      role: 'assistant' as const,
      content: 'Here is the strategic review: Total ledger volume matches $110,300 across 3 primary tiers. Average margin floats at 13.8%. Enterprise tiers have highest capital allocation risk but command superior yield offsets.',
      timestamp: '10:16 AM'
    }
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setComplete(false);

    setTimeout(() => {
      const report = copilotService.exportReport(reportType, demoMessages);
      
      // Trigger a direct download in the browser
      const blob = new Blob([report], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `enterprise_copilot_report_${Date.now()}.${reportType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setGenerating(false);
      setComplete(true);
      setTimeout(() => setComplete(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Structured Report Composer</h2>
        <p className="text-sm text-zinc-400">
          Decompose active workspaces into multi-page analytical summaries, PDF briefing decks, or markdown notes.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-white/5 bg-zinc-950/40 p-6 space-y-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-white tracking-tight">Configure Document Blueprint</h3>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {([
                { id: 'md', label: 'Markdown Notes', ext: '.md', desc: 'Pre-formatted syntax notes' },
                { id: 'html', label: 'HTML Web Page', ext: '.html', desc: 'Direct browser execution' },
                { id: 'pdf', label: 'Executive PDF', ext: '.pdf', desc: 'Structured report layout' },
                { id: 'pptx', label: 'Briefing Slides', ext: '.pptx', desc: 'Slide briefing cards' }
              ] as const).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setReportType(opt.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    reportType === opt.id
                      ? 'border-purple-500/40 bg-purple-500/10 text-purple-300'
                      : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] text-zinc-400 hover:text-white'
                  }`}
                  type="button"
                >
                  <div>
                    <span className="text-[10px] font-mono block text-zinc-500 uppercase tracking-wider">{opt.ext}</span>
                    <h4 className="text-xs font-semibold mt-1">{opt.label}</h4>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">{opt.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <Button onClick={handleGenerate} isLoading={generating} className="px-8">
                {complete ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-emerald-400" />
                    Document Assembled
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Compile & Download Report
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Info sidebar */}
        <div className="space-y-6">
          <Card className="border border-white/5 bg-zinc-950/25 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-white tracking-tight">Active Coverage Matrix</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our reporting engine integrates metric insights across all completed modules automatically.
            </p>
            <div className="space-y-2 mt-4 font-mono text-[11px] text-zinc-500">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span>AutoML Leaderboards</span>
                <span className="text-emerald-400 font-bold">INCLUDED</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span>RAG CSV Context Logs</span>
                <span className="text-emerald-400 font-bold">INCLUDED</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span>Time-Series Predictions</span>
                <span className="text-emerald-400 font-bold">INCLUDED</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default ReportGenerator;
