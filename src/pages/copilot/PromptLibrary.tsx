import React, { useState } from 'react';
import { useCopilot } from '../../hooks/useCopilot';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Library, Plus, Trash2, Copy, Check, Search } from 'lucide-react';
import { SavedPrompt } from '../../types/copilot';

export const PromptLibrary: React.FC = () => {
  const { prompts, addCustomPrompt, removeCustomPrompt } = useCopilot();
  const [search, setSearch] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const [newCategory, setNewCategory] = useState('Custom Prompt');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (p: SavedPrompt) => {
    navigator.clipboard.writeText(p.prompt);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) return;
    addCustomPrompt(newTitle, newPrompt, newCategory);
    setNewTitle('');
    setNewPrompt('');
  };

  const filtered = prompts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Structured Prompt Catalog</h2>
          <p className="text-sm text-zinc-400">
            A comprehensive vault of production analytics formulas, SQL blueprints, and ML tuning scripts.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompt templates..."
            className="pl-9 text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Prompt List */}
        <div className="xl:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
          {filtered.map((p) => (
            <Card key={p.id} className="border border-white/5 bg-zinc-950/20 p-5 flex flex-col justify-between hover:border-white/10 transition-all">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider">
                    {p.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(p)}
                      className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-400 hover:text-white transition-all"
                      title="Copy formula text"
                    >
                      {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {p.id.startsWith('custom-') && (
                      <button
                        onClick={() => removeCustomPrompt(p.id)}
                        className="p-1.5 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-500 hover:text-red-400 transition-all"
                        title="Delete custom"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white tracking-tight">{p.title}</h4>
                  <p className="text-xs text-zinc-400 font-mono bg-black/40 p-3 rounded-xl border border-white/[0.03] leading-relaxed">
                    {p.prompt}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="text-center text-zinc-500 py-12 italic text-xs font-mono">
              No prompts match your query criteria
            </div>
          )}
        </div>

        {/* Creator panel */}
        <Card className="border border-white/5 bg-zinc-950/40 p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Library className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-white tracking-tight font-sans">Contribute Prompt</h3>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Title</label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Impute customer margins..."
                className="text-xs border-white/10"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Prompt Text</label>
              <textarea
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
                placeholder="Write the full analytical description of the instruction formula..."
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all h-24 resize-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Category Tag</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
              >
                <option value="Custom Prompt" className="bg-zinc-950 text-white">Custom Tag</option>
                <option value="Business Analytics" className="bg-zinc-950 text-white">Business Analytics</option>
                <option value="Database & SQL" className="bg-zinc-950 text-white">Database & SQL</option>
                <option value="Python & Pandas" className="bg-zinc-950 text-white">Python & Pandas</option>
                <option value="Machine Learning" className="bg-zinc-950 text-white">Machine Learning</option>
              </select>
            </div>

            <Button type="submit" className="w-full text-xs">
              <Plus className="w-4 h-4 mr-1.5" />
              Save Formula
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
export default PromptLibrary;
