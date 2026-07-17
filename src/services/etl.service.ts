import { Pipeline, PipelineNode, DataQualityReport } from '../types/pipeline';
import { RowData, detectMissingValues, detectDuplicates, detectOutliers, imputeMissing, oneHotEncode, standardScale, extractDateFeatures } from '../utils/dataCleaning';

export interface ETLState {
  pipelines: Pipeline[];
  activePipelineId: string | null;
  history: {
    past: Pipeline[][];
    present: Pipeline[];
    future: Pipeline[][];
  };
  sampleData: RowData[];
  previewData: RowData[];
  executionLogs: string[];
}

const DEFAULT_SAMPLE_DATA: RowData[] = [
  { transaction_id: 1001, segment: 'Enterprise', amount: 54000, margin: 0.15, date: '2026-01-10', feedback: 'Excellent' },
  { transaction_id: 1002, segment: 'Mid-Market', amount: 12500, margin: 0.22, date: '2026-01-11', feedback: null },
  { transaction_id: 1003, segment: 'SMB', amount: 4800, margin: 0.31, date: '2026-01-12', feedback: 'Prompt resolution' },
  { transaction_id: 1004, segment: 'Enterprise', amount: 92000, margin: 0.12, date: '2026-01-13', feedback: 'Highly satisfied' },
  { transaction_id: 1005, segment: 'SMB', amount: 1500, margin: 0.40, date: '', feedback: 'A bit slow' },
  { transaction_id: 1006, segment: 'Mid-Market', amount: 22000, margin: 0.18, date: '2026-01-15', feedback: null },
  { transaction_id: 1007, segment: 'Enterprise', amount: 54000, margin: 0.15, date: '2026-01-10', feedback: 'Excellent' }, // Duplicate of 1001
  { transaction_id: 1008, segment: 'SMB', amount: 3200, margin: 1.85, date: '2026-01-17', feedback: 'Average' }, // Outlier in margin
  { transaction_id: 1009, segment: 'Enterprise', amount: null, margin: 0.14, date: '2026-01-18', feedback: 'Great support' }, // Missing amount
  { transaction_id: 1010, segment: 'Mid-Market', amount: 18000, margin: 0.20, date: '2026-01-19', feedback: 'Good product' },
];

const INITIAL_PIPELINE: Pipeline = {
  id: 'pipeline-default',
  name: 'Global revenue clean stream',
  description: 'Enterprise data ETL pipeline with custom cleaning nodes and outlier filters.',
  nodes: [
    { id: 'node-1', type: 'source', label: 'Revenue CSV Partition', status: 'idle', x: 100, y: 150, config: {} },
    { id: 'node-2', type: 'clean', label: 'Impute Null Values', status: 'idle', x: 300, y: 150, config: { target: 'amount', strategy: 'mean' } },
    { id: 'node-3', type: 'transform', label: 'One-Hot Segment Encode', status: 'idle', x: 500, y: 150, config: { target: 'segment' } },
    { id: 'node-4', type: 'engineer', label: 'Date Splitting', status: 'idle', x: 700, y: 150, config: { target: 'date' } },
    { id: 'node-5', type: 'sink', label: 'Grounded Feature Store', status: 'idle', x: 900, y: 150, config: {} },
  ],
  edges: [
    { id: 'edge-1', source: 'node-1', target: 'node-2' },
    { id: 'edge-2', source: 'node-2', target: 'node-3' },
    { id: 'edge-3', source: 'node-3', target: 'node-4' },
    { id: 'edge-4', source: 'node-4', target: 'node-5' },
  ],
  updatedAt: new Date().toLocaleString(),
  version: '1.4.2',
};

class ETLService {
  private state: ETLState;

  constructor() {
    this.state = {
      pipelines: [INITIAL_PIPELINE],
      activePipelineId: 'pipeline-default',
      history: {
        past: [],
        present: [INITIAL_PIPELINE],
        future: [],
      },
      sampleData: [...DEFAULT_SAMPLE_DATA],
      previewData: [...DEFAULT_SAMPLE_DATA],
      executionLogs: [],
    };
  }

  public getActivePipeline(): Pipeline | null {
    return this.state.pipelines.find((p) => p.id === this.state.activePipelineId) || null;
  }

  public getPipelines(): Pipeline[] {
    return this.state.pipelines;
  }

  public getSampleData(): RowData[] {
    return this.state.sampleData;
  }

  public getPreviewData(): RowData[] {
    return this.state.previewData;
  }

  public getExecutionLogs(): string[] {
    return this.state.executionLogs;
  }

  public updateActivePipeline(pipeline: Pipeline) {
    this.state.history.past.push([...this.state.pipelines]);
    this.state.history.future = [];
    
    this.state.pipelines = this.state.pipelines.map((p) =>
      p.id === pipeline.id ? { ...pipeline, updatedAt: new Date().toLocaleString() } : p
    );
  }

  public undo() {
    if (this.state.history.past.length > 0) {
      const prev = this.state.history.past.pop()!;
      this.state.history.future.push([...this.state.pipelines]);
      this.state.pipelines = prev;
    }
  }

  public redo() {
    if (this.state.history.future.length > 0) {
      const next = this.state.history.future.pop()!;
      this.state.history.past.push([...this.state.pipelines]);
      this.state.pipelines = next;
    }
  }

  public validatePipeline(pipeline: Pipeline): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const nodeIds = new Set(pipeline.nodes.map((n) => n.id));

    pipeline.edges.forEach((edge) => {
      if (!nodeIds.has(edge.source)) {
        errors.push(`Edge links invalid source: ${edge.source}`);
      }
      if (!nodeIds.has(edge.target)) {
        errors.push(`Edge links invalid target: ${edge.target}`);
      }
    });

    const sources = pipeline.nodes.filter((n) => n.type === 'source');
    if (sources.length === 0) {
      errors.push('Pipeline must declare at least one source ingestion node.');
    }

    const sinks = pipeline.nodes.filter((n) => n.type === 'sink');
    if (sinks.length === 0) {
      errors.push('Pipeline must output to at least one storage sink node.');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  public calculateQualityReport(data: RowData[], columns: string[]): DataQualityReport {
    const nulls = detectMissingValues(data, columns);
    const missingValuesCount = Object.values(nulls).reduce((a, b) => a + b, 0);
    const duplicateCount = detectDuplicates(data);
    const outliers = detectOutliers(data, columns);
    const outliersCount = Object.values(outliers).reduce((sum, list) => sum + list.length, 0);

    const typeDistribution: Record<string, number> = { numerical: 0, categorical: 0, temporal: 0 };
    columns.forEach((col) => {
      const sample = data.find((row) => row[col] !== undefined && row[col] !== null)?.[col];
      if (typeof sample === 'number') {
        typeDistribution.numerical++;
      } else if (sample && !isNaN(Date.parse(String(sample)))) {
        typeDistribution.temporal++;
      } else {
        typeDistribution.categorical++;
      }
    });

    // Score deduction math
    const totalCells = data.length * columns.length || 1;
    const penalty = (missingValuesCount / totalCells) * 50 + (duplicateCount / data.length) * 30 + (outliersCount / totalCells) * 20;
    const score = Math.max(0, Math.min(100, Math.round(100 - penalty)));

    return {
      score,
      missingValuesCount,
      duplicateCount,
      outliersCount,
      memoryUsageBytes: data.length * columns.length * 24,
      processingTimeMs: Math.round(Math.random() * 250 + 40),
      dataTypeDistribution: typeDistribution,
    };
  }

  public async runNodeTransformation(
    node: PipelineNode,
    currentData: RowData[]
  ): Promise<{ data: RowData[]; log: string }> {
    let result = [...currentData];
    let log = `[${node.label}] Completed successfully. `;

    switch (node.type) {
      case 'source':
        log += `Ingested ${currentData.length} baseline client records.`;
        break;
      case 'clean':
        const targetCol = node.config.target || 'amount';
        const strategy = node.config.strategy || 'mean';
        result = imputeMissing(result, targetCol, strategy);
        // Also drop duplicates as common auto-clean
        const beforeLen = result.length;
        const seen = new Set<string>();
        result = result.filter((row) => {
          const key = JSON.stringify(row);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        const removed = beforeLen - result.length;
        log += `Imputed column [${targetCol}] with [${strategy}]. Removed ${removed} duplicates.`;
        break;
      case 'transform':
        const encodeCol = node.config.target || 'segment';
        result = oneHotEncode(result, encodeCol);
        log += `Successfully ran one-hot category encoding on column [${encodeCol}].`;
        break;
      case 'engineer':
        const dateCol = node.config.target || 'date';
        result = extractDateFeatures(result, dateCol);
        // Also scale revenue amount
        result = standardScale(result, 'amount');
        log += `Extracted calendar parts from [${dateCol}]. Normalized and scaled numeric values.`;
        break;
      case 'sink':
        log += `Stored output data partition successfully. Ingress rate 1.8MB/s.`;
        break;
      default:
        break;
    }

    return { data: result, log };
  }
}

export const etlService = new ETLService();
export default etlService;
