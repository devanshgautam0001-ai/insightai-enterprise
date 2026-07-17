import React from 'react';
import { Database, X, FileSpreadsheet, FileJson, FileText } from 'lucide-react';

interface FileContextCardProps {
  fileName: string;
  onRemove?: () => void;
}

export const FileContextCard: React.FC<FileContextCardProps> = ({ fileName, onRemove }) => {
  const getIcon = () => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'json':
        return <FileJson className="w-4 h-4 text-amber-400" />;
      case 'parquet':
        return <Database className="w-4 h-4 text-blue-400" />;
      default:
        return <FileText className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-mono text-zinc-300 hover:border-white/10 transition-all">
      <div className="flex items-center gap-2">
        {getIcon()}
        <span className="truncate max-w-[120px]">{fileName}</span>
      </div>
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-zinc-500 hover:text-red-400 p-0.5 rounded transition-colors"
          title="Remove from context"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
export default FileContextCard;
