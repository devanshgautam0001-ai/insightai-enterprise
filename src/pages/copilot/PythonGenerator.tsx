import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PythonPreview } from '../../components/copilot/PythonPreview';
import { Code, ArrowRight, Cpu } from 'lucide-react';

export const PythonGenerator: React.FC = () => {
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const lower = description.toLowerCase();
    let script = '';

    if (lower.includes('clean') || lower.includes('null') || lower.includes('missing')) {
      script = `import pandas as pd\nimport numpy as np\n\n# Load active transaction logs\ndf = pd.read_csv("transaction_ledger.csv")\n\n# Impute missing indicators in columns via median bounds\nnum_cols = df.select_dtypes(include=[np.number]).columns\nfor col in num_cols:\n    df[col] = df[col].fillna(df[col].median())\n\n# Clean categorical features\nif "segment" in df.columns:\n    df["segment"] = df["segment"].fillna("Unknown")\n\nprint("DataFrame clean. Remaining nulls: ", df.isnull().sum().sum())`;
    } else if (lower.includes('outlier') || lower.includes('bounds')) {
      script = `import pandas as pd\n\n# Outlier mitigation via Interquartile Range (IQR)\ndf = pd.read_csv("transaction_ledger.csv")\n\nQ1 = df["amount"].quantile(0.25)\nQ3 = df["amount"].quantile(0.75)\nIQR = Q3 - Q1\n\nlower_bound = Q1 - 1.5 * IQR\nupper_bound = Q3 + 1.5 * IQR\n\nfiltered_df = df[(df["amount"] >= lower_bound) & (df["amount"] <= upper_bound)]\nprint(f"Removed {len(df) - len(filtered_df)} outliers.")`;
    } else {
      script = `import pandas as pd\nfrom sklearn.model_selection import train_test_split\n\n# Prepare dataframe for downstream XGBoost modeling\ndf = pd.read_csv("transaction_ledger.csv")\n\nX = df[["amount", "margin", "session_duration"]]\ny = df["churn_flag"]\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(f"Split dataset: {len(X_train)} training records, {len(X_test)} testing records.")`;
    }

    setCode(script);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Structured Python Engine</h2>
        <p className="text-sm text-zinc-400">
          Generate clean Python & Pandas notebooks to automate data preparation, pipeline cleaning, and scikit-learn splits.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card className="border border-white/5 bg-zinc-950/40 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-white tracking-tight">Natural Language Python Request</h3>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Pipeline Objective</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Write pandas outlier mitigation code using IQR bounds for transaction amount"
                  className="text-xs border-white/10"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="sm">
                  Generate Pandas Script
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </form>
          </Card>

          {code && (
            <div className="animate-fade-in space-y-2">
              <PythonPreview python={code} />
            </div>
          )}
        </div>

        {/* Informational Panel */}
        <div className="space-y-6">
          <Card className="border border-white/5 bg-zinc-950/25 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold text-white tracking-tight">AutoML Code Integration</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every generated python snippet integrates seamlessly with active model registries.
            </p>
            <ul className="list-disc pl-4 space-y-2 text-xs text-zinc-400 mt-3 font-mono">
              <li>Direct integration with Scikit-Learn pipelines.</li>
              <li>Pre-configured for local pandas sandbox testing.</li>
              <li>Fully vectorized mathematical operations.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default PythonGenerator;
