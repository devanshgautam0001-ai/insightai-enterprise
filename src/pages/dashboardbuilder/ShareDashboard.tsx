import React, { useState } from 'react';
import { Share2, Users, Plus, Trash2, Globe, Link2, Check } from 'lucide-react';
import { SharedUser } from '../../types/dashboard';

interface ShareDashboardProps {
  sharedUsers: SharedUser[];
  onAddUser: (email: string, role: 'viewer' | 'editor' | 'admin') => void;
  onRemoveUser: (email: string) => void;
}

export const ShareDashboard: React.FC<ShareDashboardProps> = ({
  sharedUsers,
  onAddUser,
  onRemoveUser
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('viewer');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onAddUser(email.trim(), role);
    setEmail('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="p-4 bg-zinc-950/60 border border-white/5 rounded-2xl backdrop-blur-xl text-xs space-y-4">
      {/* Header banner */}
      <div className="flex items-center space-x-2.5 pb-3.5 border-b border-white/5">
        <Share2 className="w-4 h-4 text-purple-400" />
        <div>
          <h4 className="text-xs font-bold text-white tracking-wide uppercase">Workspace Permissions</h4>
          <p className="text-[10px] font-mono text-zinc-500">Secure member authorization matrices</p>
        </div>
      </div>

      {/* Copy link share container */}
      <div className="p-3 rounded-xl border border-white/5 bg-white/[0.01] space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center text-zinc-300 font-semibold text-[10px]">
            <Globe className="w-3.5 h-3.5 text-zinc-500 mr-1.5" />
            <span>Public Iframe Integration Link</span>
          </span>
          <span className="text-[8px] bg-emerald-500/15 text-emerald-400 font-mono font-bold uppercase px-1.5 py-0.2 rounded">
            Live Shared
          </span>
        </div>
        <p className="text-[9px] text-zinc-500 leading-normal">
          Anyone with this private URL can browse, view charts, and download reports under direct Viewer bounds.
        </p>
        <div className="flex items-center space-x-2 pt-1">
          <input
            type="text"
            readOnly
            value={window.location.href}
            className="flex-1 bg-white/[0.02] border border-white/5 rounded-md px-2.5 py-1 text-zinc-400 text-[10px] focus:outline-none font-mono truncate"
          />
          <button
            onClick={handleCopyLink}
            className="px-2.5 py-1 bg-purple-500 hover:bg-purple-600 rounded text-white font-semibold transition-all flex items-center space-x-1 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
            <span>{copiedLink ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Add collaborator form */}
      <form onSubmit={handleSubmit} className="space-y-2.5 pt-1.5">
        <label className="text-[10px] uppercase font-mono text-zinc-400 font-semibold block">Authorize Collaborator</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="colleague@enterprise.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/[0.02] border border-white/5 rounded-md px-3 py-1.5 text-zinc-200 text-xs focus:outline-none focus:border-purple-500"
            required
          />
          <div className="flex gap-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-zinc-900 text-zinc-200 text-[11px] border border-white/5 rounded-md px-2.5 focus:outline-none cursor-pointer"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="px-3 bg-purple-500 hover:bg-purple-600 rounded-md text-white font-semibold transition-all flex items-center justify-center cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </form>

      {/* Collaborators list table */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold block">Active Workspace Access List</span>
        <div className="space-y-1.5 max-h-[140px] overflow-y-auto custom-scrollbar">
          {sharedUsers.map((u) => (
            <div key={u.email} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/5 text-[11px]">
              <div className="flex items-center space-x-2 truncate">
                <Users className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-zinc-200 truncate">{u.email}</span>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <span className={`font-mono text-[9px] uppercase px-1.5 py-0.2 rounded font-semibold ${
                  u.role === 'admin'
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/25'
                    : u.role === 'editor'
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/25'
                    : 'bg-zinc-800 text-zinc-400 border border-white/5'
                }`}>
                  {u.role}
                </span>
                {u.email !== 'devanshgautam0001@gmail.com' && (
                  <button
                    type="button"
                    onClick={() => onRemoveUser(u.email)}
                    className="p-1 text-zinc-500 hover:text-rose-400 rounded hover:bg-white/5 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ShareDashboard;
