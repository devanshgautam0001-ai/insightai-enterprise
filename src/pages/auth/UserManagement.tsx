import React, { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Devansh Gautam', email: 'devanshgautam0001@gmail.com', role: 'ADMIN', status: 'Active', division: 'Risk Control' },
    { id: 2, name: 'Sarah Connor', email: 's.connor@insightai.corp', role: 'USER', status: 'Active', division: 'Sales operations' },
    { id: 3, name: 'Miles Dyson', email: 'm.dyson@insightai.corp', role: 'USER', status: 'Active', division: 'Core Research' },
    { id: 4, name: 'Marcus Wright', email: 'm.wright@insightai.corp', role: 'USER', status: 'Active', division: 'Field Operations' },
  ]);

  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  return (
    <div className="space-y-8 animate-fade-in" id="user-management-view">
      <div>
        <h2 className="font-display font-extrabold text-3xl">Corporate User Management</h2>
        <p className="text-zinc-400 text-sm">Audit active corporate credentials, assign structural access keys, and review operations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <Card className="overflow-x-auto border border-white/5 bg-white/[0.01]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 font-mono text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-4 font-normal">Officer / Name</th>
                  <th className="py-4 px-4 font-normal">Corporate Email</th>
                  <th className="py-4 px-4 font-normal">Active Division</th>
                  <th className="py-4 px-4 font-normal">System Role</th>
                  <th className="py-4 px-4 font-normal">Status Log</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-4 px-4 font-semibold text-zinc-200">{u.name}</td>
                    <td className="py-4 px-4 text-zinc-400 font-mono text-[11px]">{u.email}</td>
                    <td className="py-4 px-4 text-zinc-400 font-mono text-[11px]">{u.division}</td>
                    <td className="py-4 px-4">
                      {u.email === 'devanshgautam0001@gmail.com' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-brand-accent/15 border border-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase">
                          <Shield className="w-3 h-3" /> ADMIN
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-brand-bg-sec border border-white/10 rounded px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-brand-accent cursor-pointer font-mono"
                        >
                          <option value="USER">USER</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="ANALYST">ANALYST</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium font-mono">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Security guidelines sidebar */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <h3 className="font-display font-bold text-base flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-accent" /> Auditing Policies
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every individual officer register is backed up via secure PostgreSQL references mapped to a unique Firebase ID key.
            </p>
            <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-2.5 text-zinc-300 text-xs">
              <AlertCircle className="w-4 h-4 text-brand-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-warning">Strict Security Notice</p>
                <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                  The executive email <code className="text-zinc-300 font-mono">devanshgautam0001@gmail.com</code> is locked down as the sole system owner. It is structurally impossible to revoke or downgrade this identity credential.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
