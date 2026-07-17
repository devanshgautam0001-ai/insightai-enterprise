import React from 'react';
import { Upload, AlertCircle, FileSpreadsheet, Layers, Database } from 'lucide-react';
import { useUpload } from '../../hooks/useUpload';

export const UploadZone: React.FC = () => {
  const {
    isDragging,
    isUploading,
    progress,
    error,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange
  } = useUpload();

  return (
    <div className="w-full flex flex-col gap-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative overflow-hidden flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10 min-h-64 transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-white/10 hover:border-blue-500/50 bg-white/[0.02] hover:bg-white/[0.04]'
        }`}
        id="dataset-upload-zone"
      >
        <input
          type="file"
          id="dataset-uploader-input"
          className="hidden"
          onChange={handleFileChange}
          accept=".csv,.xlsx,.json,.parquet"
          disabled={isUploading}
        />
        
        <label
          htmlFor="dataset-uploader-input"
          className="flex flex-col items-center cursor-pointer text-center space-y-4 select-none"
        >
          <div className="p-4 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center transition-transform hover:scale-105">
            <Upload className="w-10 h-10 text-zinc-400 group-hover:text-blue-500" />
          </div>
          
          <div className="space-y-1">
            <h4 className="font-display font-semibold text-base text-zinc-200">
              Drag & Drop file here or <span className="text-blue-400 hover:underline">browse files</span>
            </h4>
            <p className="text-xs text-zinc-500">
              Supports CSV, Excel (XLSX), JSON, and Parquet data formats
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider bg-white/[0.02] py-1 px-3 border border-white/5 rounded-full">
            <span className="flex items-center gap-1"><FileSpreadsheet className="w-3 h-3" /> CSV</span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> PARQUET</span>
            <span className="text-zinc-700">•</span>
            <span className="flex items-center gap-1"><Database className="w-3 h-3" /> JSON</span>
          </div>
        </label>

        {isUploading && (
          <div className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-xs font-mono text-zinc-300">
                <span className="animate-pulse">Ingesting metadata schema...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-shake">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-xs text-red-200">Ingestion Error</h5>
            <p className="text-xs text-red-400/90 mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};
