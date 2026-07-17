import { DataEngineDataset, ColumnDefinition, DataType } from '../types/dataset';

export const DatasetService = {
  // Mock file processing to generate very realistic analytics for CSV, Parquet, Excel, JSON
  processUploadedFile(file: File): Promise<DataEngineDataset> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['csv', 'xlsx', 'json', 'parquet'];
      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        reject(new Error('Unsupported file format. Please upload CSV, Excel, JSON or Parquet.'));
        return;
      }

      // Read file size
      const bytes = file.size;
      const sizeStr = this.formatBytes(bytes);
      const memoryUsage = this.formatBytes(bytes * 1.4); // simulated in-memory size

      // Simulate a robust processing delay based on file size
      setTimeout(() => {
        try {
          const mockDataset = this.generateRealisticMockDataset(file.name, fileExtension as any, bytes, sizeStr, memoryUsage);
          resolve(mockDataset);
        } catch (e) {
          reject(new Error('Error parsing dataset structure'));
        }
      }, 1200);
    });
  },

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  generateRealisticMockDataset(
    name: string,
    fileType: 'csv' | 'xlsx' | 'json' | 'parquet',
    bytes: number,
    sizeStr: string,
    memoryUsage: string
  ): DataEngineDataset {
    const rows = fileType === 'parquet' ? 425000 : fileType === 'xlsx' ? 12400 : 85600;
    const segmentNullCount = Math.floor(rows * 0.05);
    const segmentNullPercentage = parseFloat(((segmentNullCount / rows) * 100).toFixed(2));
    const feedbackNullCount = Math.floor(rows * 0.35);
    const feedbackNullPercentage = parseFloat(((feedbackNullCount / rows) * 100).toFixed(2));
    
    const columnNames = [
      { name: 'transaction_id', type: 'numerical' as DataType, isPK: true },
      { name: 'customer_segment', type: 'categorical' as DataType, isPK: false },
      { name: 'purchase_amount', type: 'numerical' as DataType, isPK: false },
      { name: 'is_premier_member', type: 'boolean' as DataType, isPK: false },
      { name: 'checkout_timestamp', type: 'temporal' as DataType, isPK: false },
      { name: 'feedback_comments', type: 'text' as DataType, isPK: false }
    ];

    const columns: ColumnDefinition[] = columnNames.map((col, idx) => {
      const isNullable = idx === 5 || idx === 1; // feedback or segment might have nulls
      const nullCount = idx === 5 ? feedbackNullCount : idx === 1 ? segmentNullCount : 0;
      const nullPercentage = idx === 5 ? feedbackNullPercentage : idx === 1 ? segmentNullPercentage : 0;
      const uniqueCount = col.isPK 
        ? rows 
        : col.type === 'categorical' 
        ? 4 
        : col.type === 'boolean' 
        ? 2 
        : col.type === 'temporal' 
        ? Math.floor(rows * 0.8) 
        : Math.floor(rows * 0.95);
      
      const uniquePercentage = parseFloat(((uniqueCount / rows) * 100).toFixed(2));

      // Generate simulated sample values
      let sampleValues: any[] = [];
      if (col.name === 'transaction_id') {
        sampleValues = [10001, 10002, 10003, 10004, 10005];
      } else if (col.name === 'customer_segment') {
        sampleValues = ['Enterprise', 'Mid-Market', 'SMB', null, 'Enterprise'];
      } else if (col.name === 'purchase_amount') {
        sampleValues = [245.50, 1200.00, 45.99, 89.00, 450.25];
      } else if (col.name === 'is_premier_member') {
        sampleValues = [true, false, true, true, false];
      } else if (col.name === 'checkout_timestamp') {
        sampleValues = ['2026-07-13T09:30:00Z', '2026-07-13T10:15:22Z', '2026-07-13T11:00:15Z', '2026-07-13T11:12:44Z', '2026-07-13T12:05:01Z'];
      } else {
        sampleValues = ['Excellent throughput', 'Needs minor UX improvements', null, 'Highly recommended service', null];
      }

      // Frequent values
      let frequentValues = [];
      if (col.name === 'customer_segment') {
        frequentValues = [
          { value: 'Enterprise', count: Math.floor(rows * 0.45), percentage: 45 },
          { value: 'Mid-Market', count: Math.floor(rows * 0.30), percentage: 30 },
          { value: 'SMB', count: Math.floor(rows * 0.20), percentage: 20 },
          { value: 'Unknown / Null', count: nullCount, percentage: 5 }
        ];
      } else if (col.name === 'is_premier_member') {
        frequentValues = [
          { value: 'True', count: Math.floor(rows * 0.62), percentage: 62 },
          { value: 'False', count: Math.floor(rows * 0.38), percentage: 38 }
        ];
      } else {
        frequentValues = [
          { value: String(sampleValues[0]), count: 12, percentage: 0.01 },
          { value: String(sampleValues[1]), count: 8, percentage: 0.01 }
        ];
      }

      return {
        name: col.name,
        type: col.type,
        sampleValues,
        qualityScore: col.isPK ? 100 : idx === 5 ? 65 : idx === 1 ? 95 : 99,
        isNullable,
        isPrimaryKey: col.isPK,
        stats: {
          mean: col.name === 'purchase_amount' ? 406.15 : undefined,
          median: col.name === 'purchase_amount' ? 245.50 : undefined,
          stdDev: col.name === 'purchase_amount' ? 412.30 : undefined,
          min: col.name === 'purchase_amount' ? 4.99 : undefined,
          max: col.name === 'purchase_amount' ? 8450.00 : undefined,
          skewness: col.name === 'purchase_amount' ? 2.45 : undefined,
          kurtosis: col.name === 'purchase_amount' ? 6.12 : undefined,
          nullCount,
          nullPercentage,
          uniqueCount,
          uniquePercentage,
          frequentValues
        }
      };
    });

    const previewRows = Array.from({ length: 15 }).map((_, rIdx) => ({
      transaction_id: 10001 + rIdx,
      customer_segment: ['Enterprise', 'Mid-Market', 'SMB'][rIdx % 3],
      purchase_amount: parseFloat((45.5 + rIdx * 72.35).toFixed(2)),
      is_premier_member: rIdx % 2 === 0,
      checkout_timestamp: `2026-07-13T${10 + rIdx}:15:22Z`,
      feedback_comments: rIdx % 4 === 0 ? null : `Simulated feedback response review message content text ${rIdx}`
    }));

    const qualityMetrics = [
      {
        ruleName: 'Primary Key Uniqueness Check',
        description: 'Verifies transaction_id does not contain non-unique index rows',
        severity: 'high' as const,
        status: 'passed' as const,
        affectedRows: 0,
        affectedPercentage: 0
      },
      {
        ruleName: 'Customer Segment Category Boundary',
        description: 'Checks if custom categories are strictly Enterprise, Mid-Market, or SMB',
        severity: 'medium' as const,
        status: 'warning' as const,
        affectedRows: segmentNullCount,
        affectedPercentage: segmentNullPercentage
      },
      {
        ruleName: 'Negative Purchase Values Filter',
        description: 'Flags purchase_amount items that fall below 0.00',
        severity: 'high' as const,
        status: 'passed' as const,
        affectedRows: 0,
        affectedPercentage: 0
      },
      {
        ruleName: 'Highly Leaked Null comments Ratio',
        description: 'Detects nullable rates above 30% thresholds in feedback comments',
        severity: 'low' as const,
        status: 'failed' as const,
        affectedRows: Math.floor(rows * 0.35),
        affectedPercentage: 35
      }
    ];

    const duplicateCount = Math.floor(rows * 0.004); // 0.4% duplicates
    const duplicatePercentage = 0.4;

    return {
      id: `ds-${Math.random().toString(36).substr(2, 9)}`,
      name,
      size: sizeStr,
      bytes,
      rows,
      cols: columns.length,
      fileType,
      uploadedAt: new Date().toISOString().split('T')[0],
      columns,
      qualityMetrics,
      previewRows,
      duplicateCount,
      duplicatePercentage,
      memoryUsage
    };
  }
};
