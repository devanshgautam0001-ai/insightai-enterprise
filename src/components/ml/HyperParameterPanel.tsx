import React from 'react';
import { Card } from '../ui/Card';
import { Hyperparameter } from '../../types/model';
import { Sliders } from 'lucide-react';

interface HyperparameterPanelProps {
  hyperparameters: Hyperparameter[];
  onChange?: (name: string, value: any) => void;
  isReadOnly?: boolean;
}

export const HyperParameterPanel: React.FC<HyperparameterPanelProps> = ({
  hyperparameters,
  onChange,
  isReadOnly = false,
}) => {
  return (
    <Card className="border border-white/5 bg-zinc-950/25">
      <div className="flex items-center gap-2.5 mb-5">
        <Sliders className="w-5 h-5 text-purple-400" />
        <div>
          <h4 className="text-sm font-semibold text-white tracking-tight">Hyperparameter Tuning Grid</h4>
          <p className="text-[10px] font-mono text-zinc-500 uppercase">
            {isReadOnly ? 'MODEL CONFIGURATION SETTINGS' : 'FINE-TUNE OPTIMIZATION COEFFICIENTS'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {hyperparameters.map((hp) => (
          <div key={hp.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-3 border-b border-white/5 last:border-b-0">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-zinc-300 font-mono block">
                {hp.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-500 capitalize block">
                Type: {hp.type} {hp.range ? `| Bounds: [${hp.range[0]} - ${hp.range[1]}]` : ''}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isReadOnly ? (
                <span className="font-mono text-sm text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-lg">
                  {String(hp.value)}
                </span>
              ) : (
                <>
                  {hp.type === 'boolean' && (
                    <button
                      type="button"
                      onClick={() => onChange?.(hp.name, !hp.value)}
                      className={`w-10 h-6 rounded-full transition-colors relative focus:outline-none ${
                        hp.value ? 'bg-purple-600' : 'bg-zinc-800'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                          hp.value ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  )}

                  {hp.type === 'categorical' && hp.options && (
                    <select
                      value={hp.value}
                      onChange={(e) => onChange?.(hp.name, e.target.value)}
                      className="bg-white/[0.02] border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-purple-500/50"
                    >
                      {hp.options.map((opt) => (
                        <option key={opt} value={opt} className="bg-zinc-950 text-white">
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {(hp.type === 'int' || hp.type === 'float') && hp.range && (
                    <div className="flex items-center gap-3 w-44">
                      <input
                        type="range"
                        min={hp.range[0]}
                        max={hp.range[1]}
                        step={hp.type === 'int' ? 1 : 0.01}
                        value={hp.value}
                        onChange={(e) => onChange?.(hp.name, Number(e.target.value))}
                        className="w-full accent-purple-500"
                      />
                      <span className="text-xs font-mono text-white bg-white/5 px-2 py-0.5 rounded-md min-w-[36px] text-center border border-white/5">
                        {hp.value}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        {hyperparameters.length === 0 && (
          <p className="text-xs text-zinc-500 text-center font-mono py-4">No fine-tuning parameters required.</p>
        )}
      </div>
    </Card>
  );
};
export default HyperParameterPanel;
