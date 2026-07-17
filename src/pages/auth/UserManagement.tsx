import React, { useEffect, useState } from 'react';
import { Shield, AlertCircle, Trash2, RefreshCw, Check, X, ShieldAlert, ShieldCheck, Search, SlidersHorizontal, Loader2, User } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useUIStore } from '../../store';
import { api } from '../../lib/api';

interface DbUser {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  photoUrl: string | null;
  provider: string | null;
  role: string;
  status: string;
  approved: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const UserManagement: React.FC = () => {
  const { addNotification } = useUIStore();
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'email'>('date');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get<DbUser[]>('/api/users');
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      addNotification({
        title: 'Error Loading Users',
        description: err.message || 'Could not retrieve corporate user directories.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (uid: string) => {
    try {
      const updated = await api.put<DbUser>(`/api/users/${uid}/approve`, {});
      setUsers(prev => prev.map(u => u.uid === uid ? updated : u));
      addNotification({
        title: 'User Approved',
        description: `${updated.displayName || updated.email} has been approved and activated.`,
        type: 'success'
      });
    } catch (err: any) {
      addNotification({
        title: 'Approval Failed',
        description: err.message || 'Could not approve corporate user.',
        type: 'error'
      });
    }
  };

  const handleReject = async (uid: string) => {
    try {
      const updated = await api.put<DbUser>(`/api/users/${uid}/reject`, {});
      setUsers(prev => prev.map(u => u.uid === uid ? updated : u));
      addNotification({
        title: 'User Rejected',
        description: `${updated.displayName || updated.email} has been rejected.`,
        type: 'warning'
      });
    } catch (err: any) {
      addNotification({
        title: 'Rejection Failed',
        description: err.message || 'Could not reject user.',
        type: 'error'
      });
    }
  };

  const handleSuspend = async (uid: string) => {
    try {
      const updated = await api.put<DbUser>(`/api/users/${uid}/suspend`, {});
      setUsers(prev => prev.map(u => u.uid === uid ? updated : u));
      addNotification({
        title: 'User Suspended',
        description: `${updated.displayName || updated.email} has been suspended.`,
        type: 'warning'
      });
    } catch (err: any) {
      addNotification({
        title: 'Suspension Failed',
        description: err.message || 'Could not suspend user.',
        type: 'error'
      });
    }
  };

  const handleActivate = async (uid: string) => {
    try {
      const updated = await api.put<DbUser>(`/api/users/${uid}/activate`, {});
      setUsers(prev => prev.map(u => u.uid === uid ? updated : u));
      addNotification({
        title: 'User Re-activated',
        description: `${updated.displayName || updated.email} has been successfully unsuspended.`,
        type: 'success'
      });
    } catch (err: any) {
      addNotification({
        title: 'Activation Failed',
        description: err.message || 'Could not re-activate user.',
        type: 'error'
      });
    }
  };

  const handleRoleChange = async (uid: string, newRole: string) => {
    const targetUser = users.find(u => u.uid === uid);
    if (targetUser?.email === 'devanshgautam0001@gmail.com') {
      addNotification({
        title: 'Security Constraint',
        description: 'The OWNER role cannot be modified.',
        type: 'warning'
      });
      return;
    }
    try {
      const updated = await api.put<DbUser>(`/api/users/${uid}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.uid === uid ? updated : u));
      addNotification({
        title: 'Role Updated',
        description: `Successfully assigned role ${newRole} to ${updated.displayName || updated.email}.`,
        type: 'success'
      });
    } catch (err: any) {
      addNotification({
        title: 'Role Assignment Failed',
        description: err.message || 'Could not reassign corporate system role.',
        type: 'error'
      });
    }
  };

  const handleDeleteUser = async (uid: string) => {
    const targetUser = users.find(u => u.uid === uid);
    if (targetUser?.email === 'devanshgautam0001@gmail.com') {
      addNotification({
        title: 'Access Denied',
        description: 'The system OWNER cannot be deleted.',
        type: 'error'
      });
      return;
    }
    if (!window.confirm(`Are you absolutely sure you want to delete ${targetUser?.displayName || targetUser?.email}?`)) {
      return;
    }
    try {
      await api.delete(`/api/users/${uid}`);
      setUsers(prev => prev.filter(u => u.uid !== uid));
      addNotification({
        title: 'User Deleted',
        description: 'Successfully removed user from system records.',
        type: 'success'
      });
    } catch (err: any) {
      addNotification({
        title: 'Deletion Failed',
        description: err.message || 'Could not delete user credential.',
        type: 'error'
      });
    }
  };

  // Search and filter logic
  const filteredUsers = users.filter(u => {
    const nameMatch = (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || emailMatch;

    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'name') {
      return (a.displayName || '').localeCompare(b.displayName || '');
    } else {
      return a.email.localeCompare(b.email);
    }
  });

  return (
    <div className="space-y-8 animate-fade-in" id="user-management-view">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="font-display font-extrabold text-3xl text-zinc-100">User Approval & Credentials Control</h2>
          <p className="text-zinc-400 text-sm">Audit active corporate credentials, approve pending registrations, assign roles, and handle security suspension policies.</p>
        </div>
        <div>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 text-zinc-300 rounded transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Reload Registry
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-zinc-950/40 border-white/5 space-y-1">
          <p className="text-zinc-500 text-[10px] uppercase font-mono font-bold tracking-wider">Total Registers</p>
          <p className="text-2xl font-extrabold text-zinc-100 font-mono">{users.length}</p>
        </Card>
        <Card className="p-4 bg-zinc-950/40 border-white/5 space-y-1">
          <p className="text-zinc-500 text-[10px] uppercase font-mono font-bold tracking-wider">Awaiting Approval</p>
          <p className="text-2xl font-extrabold text-amber-500 font-mono">
            {users.filter(u => u.status === 'PENDING').length}
          </p>
        </Card>
        <Card className="p-4 bg-zinc-950/40 border-white/5 space-y-1">
          <p className="text-zinc-500 text-[10px] uppercase font-mono font-bold tracking-wider">Active Approved</p>
          <p className="text-2xl font-extrabold text-emerald-500 font-mono">
            {users.filter(u => u.status === 'APPROVED' && u.isActive).length}
          </p>
        </Card>
        <Card className="p-4 bg-zinc-950/40 border-white/5 space-y-1">
          <p className="text-zinc-500 text-[10px] uppercase font-mono font-bold tracking-wider">Suspended / Rejected</p>
          <p className="text-2xl font-extrabold text-rose-500 font-mono">
            {users.filter(u => u.status === 'SUSPENDED' || u.status === 'REJECTED').length}
          </p>
        </Card>
      </div>

      {/* Control panel & filters */}
      <Card className="p-4 bg-zinc-950/20 border-white/5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name, email, or credential key..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-accent focus:border-brand-accent font-sans"
            />
          </div>

          {/* Filters drop downs */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono shrink-0">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters:
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-900/80 border border-white/10 rounded px-2.5 py-1.5 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-brand-accent cursor-pointer"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="REJECTED">REJECTED</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-zinc-900/80 border border-white/10 rounded px-2.5 py-1.5 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-brand-accent cursor-pointer"
            >
              <option value="ALL">ALL ROLES</option>
              <option value="OWNER">OWNER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
              <option value="NONE">NONE</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-900/80 border border-white/10 rounded px-2.5 py-1.5 text-[11px] font-mono text-zinc-300 focus:outline-none focus:border-brand-accent cursor-pointer"
            >
              <option value="date">SORT: JOINED DATE</option>
              <option value="name">SORT: FULL NAME</option>
              <option value="email">SORT: EMAIL ADDR</option>
            </select>
          </div>
        </div>
      </Card>

      {/* User listing table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="overflow-x-auto border border-white/5 bg-white/[0.01]">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-brand-accent" />
                <p className="text-zinc-400 font-mono text-xs">Querying Postgres User Records...</p>
              </div>
            ) : sortedUsers.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <User className="w-8 h-8 mx-auto text-zinc-600" />
                <p className="text-zinc-400 font-semibold text-sm">No Corporate Users Found</p>
                <p className="text-zinc-500 text-xs">Try clearing search phrases or filter tags.</p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 font-mono text-zinc-500 uppercase tracking-wider text-[10px] bg-zinc-950/20">
                    <th className="py-4 px-4 font-normal">Registered Officer</th>
                    <th className="py-4 px-4 font-normal">Access Email</th>
                    <th className="py-4 px-4 font-normal">System Role</th>
                    <th className="py-4 px-4 font-normal">Approval Status</th>
                    <th className="py-4 px-4 font-normal">Active State</th>
                    <th className="py-4 px-4 font-normal text-right">System Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sortedUsers.map(u => {
                    const isOwner = u.email === 'devanshgautam0001@gmail.com';
                    return (
                      <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2.5">
                            {u.photoUrl ? (
                              <img src={u.photoUrl} alt="" className="w-7 h-7 rounded-full border border-white/10" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 font-bold uppercase text-[10px]">
                                {u.displayName ? u.displayName.substring(0, 2) : u.email.substring(0, 2)}
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-zinc-200">{u.displayName || 'Enterprise Officer'}</p>
                              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">UID: {u.uid.substring(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-zinc-400 font-mono text-[11px]">{u.email}</td>
                        <td className="py-4 px-4">
                          {isOwner ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-brand-accent/15 border border-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase tracking-wider">
                              <Shield className="w-3 h-3" /> OWNER
                            </span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                              className="bg-zinc-900 border border-white/10 rounded px-2 py-1 text-[11px] text-zinc-300 focus:outline-none focus:border-brand-accent cursor-pointer font-mono"
                            >
                              <option value="NONE">NONE</option>
                              <option value="USER">USER</option>
                              <option value="ADMIN">ADMIN</option>
                              <option value="OWNER">OWNER</option>
                            </select>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium font-mono border ${
                            u.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' :
                            u.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/25 text-amber-400' :
                            u.status === 'SUSPENDED' ? 'bg-zinc-500/10 border-white/10 text-zinc-400' :
                            'bg-rose-500/10 border-rose-500/25 text-rose-400'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                            u.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            ● {u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Approve (Check) Button */}
                            {u.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleApprove(u.uid)}
                                  className="p-1.5 rounded text-emerald-500 hover:bg-emerald-500/15 border border-emerald-500/10 transition-colors"
                                  title="Approve Account"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleReject(u.uid)}
                                  className="p-1.5 rounded text-rose-500 hover:bg-rose-500/15 border border-rose-500/10 transition-colors"
                                  title="Reject Account"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}

                            {/* Suspend Button */}
                            {u.status === 'APPROVED' && !isOwner && (
                              <button
                                onClick={() => handleSuspend(u.uid)}
                                className="p-1.5 rounded text-rose-400 hover:bg-rose-500/15 border border-rose-500/10 transition-colors"
                                title="Suspend Account"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Unsuspend/Activate Button */}
                            {(u.status === 'SUSPENDED' || u.status === 'REJECTED') && !isOwner && (
                              <button
                                onClick={() => handleActivate(u.uid)}
                                className="p-1.5 rounded text-emerald-500 hover:bg-emerald-500/15 border border-emerald-500/10 transition-colors"
                                title="Activate / Unsuspend"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteUser(u.uid)}
                              disabled={isOwner}
                              className={`p-1.5 rounded border transition-colors ${
                                isOwner ? 'text-zinc-600 border-transparent cursor-not-allowed' : 'text-zinc-500 border-transparent hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/10'
                              }`}
                              title="Delete Officer Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* Security guidelines sidebar */}
        <div className="space-y-6">
          <Card className="p-5 bg-zinc-950/40 border-white/5 space-y-4">
            <h3 className="font-display font-bold text-base flex items-center gap-2 text-zinc-100">
              <Shield className="w-5 h-5 text-brand-accent" /> System Policies
            </h3>
            <div className="space-y-3 text-xs text-zinc-400 leading-relaxed">
              <p>
                Every user credential is authenticated using Firebase Identity tokens, cross-referenced with a secure database record on login.
              </p>
              <p>
                Approved users will gain authorized tokens allowing secure communication with Postgres telemetry databases and Gemini predictive models.
              </p>
            </div>
            <div className="p-3.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-2.5 text-zinc-300 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-500">Corporate Integrity Check</p>
                <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                  The executive email <code className="text-zinc-300 font-mono">devanshgautam0001@gmail.com</code> is hardcoded as the sole system OWNER. It is structurally impossible to delete, modify, or suspend this identity credential.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
