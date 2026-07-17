import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SQLPreview } from '../../components/copilot/SQLPreview';
import { Terminal, ArrowRight, Table, Server } from 'lucide-react';

export const SQLGenerator: React.FC = () => {
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [generatedSQL, setGeneratedSQL] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('transaction_ledger');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalLanguage.trim()) return;

    // Simulate SQL generation based on schema and input words
    const lower = naturalLanguage.toLowerCase();
    let query = '';

    if (lower.includes('count') || lower.includes('how many')) {
      query = `SELECT COUNT(*) as record_count, segment \nFROM ${selectedSchema}\nGROUP BY segment\nORDER BY record_count DESC;`;
    } else if (lower.includes('margin') || lower.includes('profit')) {
      query = `SELECT \n  AVG(margin) as average_margin, \n  MAX(margin) as peak_margin, \n  segment\nFROM ${selectedSchema}\nGROUP BY segment\nHAVING average_margin > 0.10;`;
    } else {
      query = `SELECT \n  amount, \n  margin, \n  segment, \n  session_duration \nFROM ${selectedSchema}\nWHERE segment IS NOT NULL\nORDER BY amount DESC\nLIMIT 25;`;
    }

    setGeneratedSQL(query);
  };

  const schemas = [
    { id: 'transaction_ledger', label: 'transaction_ledger (Financial)', rows: 105 },
    { id: 'model_features', label: 'model_features (AutoML Weight mappings)', rows: 45 },
    { id: 'predictive_history', label: 'predictive_history (Inference records)', rows: 12 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Structured SQL Engine</h2>
        <p className="text-sm text-zinc-400">
          Translate pure natural language statements into production-ready query operations automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-white/5 bg-zinc-950/40 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-white tracking-tight">Natural Language Translation Request</h3>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Target Database Structure</label>
                <select
                  value={selectedSchema}
                  onChange={(e) => setSelectedSchema(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
                >
                  {schemas.map((sc) => (
                    <option key={sc.id} value={sc.id} className="bg-zinc-950 text-white">
                      {sc.label} - {sc.rows} rows detected
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Query instruction</label>
                <Input
                  value={naturalLanguage}
                  onChange={(e) => setNaturalLanguage(e.target.value)}
                  placeholder="e.g. Find average margins grouped by customer segments where amount is over 10k"
                  className="text-xs border-white/10"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="sm">
                  Generate Structured Query
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </form>
          </Card>

          {generatedSQL && (
            <div className="animate-fade-in space-y-2">
              <SQLPreview sql={generatedSQL} />
            </div>
          )}
        </div>

        {/* Database specs */}
        <div className="space-y-6">
          <Card className="border border-white/5 bg-zinc-950/25 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-white tracking-tight">Connected Schema Catalog</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                <div className="flex items-center gap-2 font-semibold text-zinc-200">
                  <Table className="w-4 h-4 text-emerald-400" />
                  <span>transaction_ledger</span>
                </div>
                <div className="font-mono text-[10px] text-zinc-500 grid grid-cols-2 gap-1.5 pl-6">
                  <div>• amount (float64)</div>
                  <div>• margin (float64)</div>
                  <div>• segment (string)</div>
                  <div>• churn_flag (int)</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
                <div className="flex items-center gap-2 font-semibold text-zinc-200">
                  <Table className="w-4 h-4 text-purple-400" />
                  <span>model_features</span>
                </div>
                <div className="font-mono text-[10px] text-zinc-500 grid grid-cols-2 gap-1.5 pl-6">
                  <div>• feature_id (int)</div>
                  <div>• score (float)</div>
                  <div>• status (string)</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default SQLGenerator;
