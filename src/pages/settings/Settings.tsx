import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, Save, CreditCard, Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useUIStore } from '../../store';

export const Settings: React.FC = () => {
  const { userRole, addNotification } = useUIStore();
  const [apiKeyInput, setApiKeyInput] = useState('AI_STUDIO_INJECTED_ENTERPRISE_KEY_2026');
  const [showKey, setShowKey] = useState(false);
  const [billingPlan, setBillingPlan] = useState('Enterprise Tier');
  const [isSaving, setIsSaving] = useState(false);

  const isOwner = userRole === 'OWNER';

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addNotification({
        title: 'Console Settings Updated',
        description: 'Identity credentials and security configurations successfully saved.',
        type: 'success'
      });
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="settings-view">
      <div>
        <h2 className="font-display font-extrabold text-3xl">Console Settings</h2>
        <p className="text-zinc-400 text-sm">Configure secure key exchanges, profile preferences, and subscription channels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h3 className="font-display font-bold text-lg">Identity & Credentials</h3>
              <p className="text-xs text-zinc-500">Access tokens required for remote cluster calculations.</p>
            </div>

            <div className="space-y-4">
              <Input
                label="Secure API Credentials Key"
                type={showKey ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                icon={<Key className="w-4 h-4" />}
                className="font-mono text-xs"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 font-mono"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showKey ? 'Mask credentials key' : 'Reveal raw credentials key'}
              </button>
            </div>
          </Card>

          {/* Billing Configuration (OWNER restricted) */}
          <Card className="space-y-6 relative overflow-hidden">
            {!isOwner && (
              <div className="absolute inset-0 bg-brand-bg-sec/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6 border border-red-500/10">
                <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <h4 className="font-display font-bold text-sm text-zinc-200">Billing Management Restricted</h4>
                <p className="text-[11px] text-zinc-400 max-w-md mt-1 leading-normal">
                  Identity verification failed: Subscription billing changes are structurally restricted to the system <span className="font-mono text-xs bg-brand-accent/15 text-brand-accent px-1.5 py-0.5 rounded font-bold">OWNER</span> only.
                </p>
              </div>
            )}

            <div className="border-b border-white/5 pb-4">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-accent" /> Billing & Corporate Subscription
              </h3>
              <p className="text-xs text-zinc-500">Manage Stripe subscription plans, enterprise clusters, and active cards.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 font-mono mb-1.5">Active Subscription Plan</label>
                  <select
                    value={billingPlan}
                    onChange={(e) => setBillingPlan(e.target.value)}
                    disabled={!isOwner}
                    className="w-full bg-brand-bg-sec border border-white/10 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-brand-accent disabled:opacity-50 cursor-pointer font-mono"
                  >
                    <option value="Enterprise Tier">Enterprise Cluster Tier ($1,250/mo)</option>
                    <option value="Scaleup Tier">Scaleup Sandbox Tier ($350/mo)</option>
                    <option value="Developer Custom">Developer Custom ($0/mo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 font-mono mb-1.5">Registered Payment Source</label>
                  <div className="bg-brand-bg-sec border border-white/5 rounded px-3 py-2 text-xs text-zinc-400 flex items-center justify-between font-mono">
                    <span>Stripe **** **** **** 4242</span>
                    <span className="text-[10px] text-zinc-500">Exp 12/28</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Audit policies */}
        <div className="space-y-6">
          <Card className="space-y-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-4">
                <h3 className="font-display font-bold text-lg">Enforced Audit Logs</h3>
                <p className="text-xs text-zinc-500">Security policies active under active division.</p>
              </div>

              <div className="flex gap-2.5 items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-bold">TLS 1.3 Audit Log Enforced</p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">SHA-256 signatures are auto-injected on every compilation dispatch.</p>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full mt-6">
              <Save className="w-4 h-4 mr-2 animate-pulse" /> {isSaving ? 'Synchronizing...' : 'Save Settings'}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
