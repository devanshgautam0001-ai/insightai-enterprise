import React, { useState } from 'react';
import { Shield, AlertCircle, Trash2, UserPlus, RefreshCw } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useUIStore } from '../../store';

export const UserManagement: React.FC = () => {
  const { userRole, addNotification } = useUIStore();
  const [users, setUsers] = useState([
    { id: 1, name: 'Devansh Gautam', email: 'devanshgautam0001@gmail.com', role: 'OWNER', status: 'Active', division: 'Risk Control' },
    { id: 2, name: 'Sarah Connor', email: 's.connor@insightai.corp', role: 'ADMIN', status: 'Active', division: 'Sales operations' },
    { id: 3, name: 'Miles Dyson', email: 'm.dyson@insightai.corp', role: 'MANAGER', status: 'Active', division: 'Core Research' },
    { id: 4, name: 'Marcus Wright', email: 'm.wright@insightai.corp', role: 'ANALYST', status: 'Active', division: 'Field Operations' },
    { id: 5, name: 'John Connor', email: 'j.connor@insightai.corp', role: 'USER', status: 'Active', division: 'Tactical Recon' },
  ]);

  const handleRoleChange = (userId: number, newRole: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.email === 'devanshgautam0001@gmail.com') {
      addNotification({
        title: 'Security Constraint',
        description: 'The OWNER role cannot be modified.',
        type: 'warning'
      });
      return;
    }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleDeleteUser = (userId: number) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser?.email === 'devanshgautam0001@gmail.com') {
      addNotification({
        title: 'Access Denied',
        description: 'The system OWNER cannot be deleted.',
        type: 'error'
      });
      return;
    }
    if (userRole === 'ADMIN' && targetUser?.role === 'OWNER') {
      addNotification({
        title: 'Access Denied',
        description: 'Administrators do not have permissions to modify the OWNER.',
        type: 'error'
      });
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <div className="space-y-8 animate-fade-in" id="user-management-view">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl">Corporate User Management</h2>
          <p className="text-zinc-400 text-sm">Audit active corporate credentials, assign structural access keys, and review operations.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-300 rounded transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Reload Audit
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-brand-accent/20 border border-brand-accent/30 hover:bg-brand-accent/30 text-brand-accent rounded transition-colors">
            <UserPlus className="w-3.5 h-3.5" /> Invite Member
          </button>
        </div>
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
                  <th className="py-4 px-4 font-normal text-right">Actions</th>
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
                          <Shield className="w-3 h-3" /> OWNER
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-brand-bg-sec border border-white/10 rounded px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-brand-accent cursor-pointer font-mono"
                        >
                          <option value="USER">USER</option>
                          <option value="ANALYST">ANALYST</option>
                          <option value="MANAGER">MANAGER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium font-mono">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.email === 'devanshgautam0001@gmail.com'}
                        className={`p-1.5 rounded transition-colors ${u.email === 'devanshgautam0001@gmail.com' ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10'}`}
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
                  The executive email <code className="text-zinc-300 font-mono">devanshgautam0001@gmail.com</code> is locked down as the sole system OWNER. It is structurally impossible to revoke, delete, or downgrade this identity credential.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
