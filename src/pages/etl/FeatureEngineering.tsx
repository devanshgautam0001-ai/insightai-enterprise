import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ColumnSelector } from '../../components/etl/ColumnSelector';
import { PreviewTable } from '../../components/etl/PreviewTable';
import { useCleaning } from '../../hooks/useCleaning';
import { Cpu, Sparkles, Sliders, Calendar } from 'lucide-react';
import { generatePolynomialFeatures, generateInteractionFeatures, extractDateFeatures, standardScale } from '../../utils/dataCleaning';
import { useUIStore } from '../../store';

export const FeatureEngineering: React.FC = () => {
  const { data, setData, columns } = useCleaning();
  const { addNotification } = useUIStore();

  const [activeEngine, setActiveEngine] = useState<'poly' | 'interaction' | 'date' | 'scale'>('poly');
  const [colA, setColA] = useState(columns[1] || 'amount');
  const [colB, setColB] = useState(columns[2] || 'margin');
  const [degree, setDegree] = useState(2);
  const [processing, setProcessing] = useState(false);

  React.useEffect(() => {
    useUIStore.setState({ isFeatureEngineeringCompleted: true });
  }, []);

  const handleApplyEngineering = () => {
    setProcessing(true);
    setTimeout(() => {
      let updated = [...data];

      if (activeEngine === 'poly') {
        updated = generatePolynomialFeatures(updated, colA, degree);
        addNotification({
          title: 'Polynomial Features Generated',
          description: `Created power variants up to degree ${degree} for ${colA}.`,
          type: 'success'
        });
      } else if (activeEngine === 'interaction') {
        updated = generateInteractionFeatures(updated, colA, colB);
        addNotification({
          title: 'Interaction Feature Generated',
          description: `Created multiplicative index [${colA}_x_${colB}].`,
          type: 'success'
        });
      } else if (activeEngine === 'date') {
        updated = extractDateFeatures(updated, 'date');
        addNotification({
          title: 'Temporal Features Extracted',
          description: `Extracted calendar parameters for [date] column.`,
          type: 'success'
        });
      } else if (activeEngine === 'scale') {
        updated = standardScale(updated, colA);
        addNotification({
          title: 'Z-Score Normalization Complete',
          description: `Standardized column [${colA}] around zero mean.`,
          type: 'success'
        });
      }

      setData(updated);
      setProcessing(false);
      useUIStore.setState({ isFeatureEngineeringCompleted: true });
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="feature-engineering-page">
      <div className="space-y-1">
        <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <span>Feature Engineering Core</span>
        </h3>
        <p className="text-xs text-zinc-400">Synthesize interaction indices, calendar partitions, and polynomial scalar vectors instantly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Engine tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => setActiveEngine('poly')}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeEngine === 'poly'
                  ? 'border-amber-500/50 bg-amber-500/[0.03] text-amber-400'
                  : 'border-white/5 bg-white/[0.01] text-zinc-400 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5 mb-2" />
              <h4 className="text-xs font-bold font-display">Polynomial Powers</h4>
              <p className="text-[10px] text-zinc-500 mt-1">Generate polynomial variables to capture non-linear fits.</p>
            </button>

            <button
              onClick={() => setActiveEngine('interaction')}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeEngine === 'interaction'
                  ? 'border-amber-500/50 bg-amber-500/[0.03] text-amber-400'
                  : 'border-white/5 bg-white/[0.01] text-zinc-400 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <Sliders className="w-5 h-5 mb-2" />
              <h4 className="text-xs font-bold font-display">Interaction Cross</h4>
              <p className="text-[10px] text-zinc-500 mt-1">Cross multiply discrete variables into interactive indices.</p>
            </button>

            <button
              onClick={() => setActiveEngine('date')}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeEngine === 'date'
                  ? 'border-amber-500/50 bg-amber-500/[0.03] text-amber-400'
                  : 'border-white/5 bg-white/[0.01] text-zinc-400 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5 mb-2" />
              <h4 className="text-xs font-bold font-display">Calendar Parts</h4>
              <p className="text-[10px] text-zinc-500 mt-1">Split raw calendar timestamps into custom numeric parts.</p>
            </button>

            <button
              onClick={() => setActiveEngine('scale')}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeEngine === 'scale'
                  ? 'border-amber-500/50 bg-amber-500/[0.03] text-amber-400'
                  : 'border-white/5 bg-white/[0.01] text-zinc-400 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <Sliders className="w-5 h-5 mb-2" />
              <h4 className="text-xs font-bold font-display">Z-Score Normalizer</h4>
              <p className="text-[10px] text-zinc-500 mt-1">Standardize distribution parameters around zero mean.</p>
            </button>
          </div>

          <Card className="p-6 bg-white/[0.01] border border-white/5">
            <PreviewTable data={data} columns={Object.keys(data[0] || {})} />
          </Card>
        </div>

        {/* Feature config selection */}
        <Card className="p-6 space-y-6 bg-white/[0.01] border border-white/5 h-fit relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-amber-500/20 via-transparent to-transparent" />
          
          <div>
            <h4 className="font-display font-bold text-sm text-zinc-200">Synthesize Parameter</h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">Customize properties and execute the pipeline compiler.</p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            {activeEngine === 'poly' && (
              <>
                <ColumnSelector
                  columns={columns.filter((c) => typeof data[0]?.[c] === 'number')}
                  selectedColumn={colA}
                  onSelect={setColA}
                  label="Target Polynomial Column"
                />
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-500">Degree Powers</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(Number(e.target.value))}
                    className="w-full bg-white/[0.02] border border-white/10 hover:border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value={2}>Square (x²)</option>
                    <option value={3}>Cubic (x³)</option>
                    <option value={4}>Biquadratic (x⁴)</option>
                  </select>
                </div>
              </>
            )}

            {activeEngine === 'interaction' && (
              <>
                <ColumnSelector
                  columns={columns.filter((c) => typeof data[0]?.[c] === 'number')}
                  selectedColumn={colA}
                  onSelect={setColA}
                  label="Column Factor A"
                />
                <div className="h-[1px] bg-white/5" />
                <ColumnSelector
                  columns={columns.filter((c) => typeof data[0]?.[c] === 'number' && c !== colA)}
                  selectedColumn={colB}
                  onSelect={setColB}
                  label="Column Factor B"
                />
              </>
            )}

            {activeEngine === 'date' && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs text-zinc-400 leading-relaxed">
                Will extract <span className="text-white font-bold">Year, Month, Day, and Day of Week</span> features from target date parameters automatically.
              </div>
            )}

            {activeEngine === 'scale' && (
              <ColumnSelector
                columns={columns.filter((c) => typeof data[0]?.[c] === 'number')}
                selectedColumn={colA}
                onSelect={setColA}
                label="Normalizing Column"
              />
            )}
          </div>

          <div className="pt-6 border-t border-white/5">
            <Button
              onClick={handleApplyEngineering}
              disabled={processing}
              isLoading={processing}
              className="w-full bg-amber-500 hover:bg-amber-600 border-none text-zinc-950 font-bold text-xs py-2.5"
            >
              Generate Synthesized Vector
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default FeatureEngineering;
