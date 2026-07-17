import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, Save } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Settings: React.FC = () => {
  const [apiKeyInput, setApiKeyInput] = useState('AI_STUDIO_INJECTED_ENTERPRISE_KEY_2026');
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in" id="settings-view">
      <div>
        <h2 className="font-display font-extrabold text-3xl">Console Settings</h2>
        <p className="text-zinc-400 text-sm">Configure secure key exchanges and profile preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 space-y-6">
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

        {/* Audit policies */}
        <Card className="space-y-6 flex flex-col justify-between">
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

          <Button className="w-full mt-6">
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </Button>
        </Card>
      </div>
    </div>
  );
};
