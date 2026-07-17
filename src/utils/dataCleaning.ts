export interface RowData extends Record<string, any> {}

export function detectMissingValues(data: RowData[], columns: string[]): Record<string, number> {
  const result: Record<string, number> = {};
  columns.forEach((col) => {
    result[col] = data.filter((row) => row[col] === undefined || row[col] === null || row[col] === '').length;
  });
  return result;
}

export function detectDuplicates(data: RowData[], keyColumns?: string[]): number {
  const seen = new Set<string>();
  let duplicates = 0;
  data.forEach((row) => {
    const key = keyColumns
      ? keyColumns.map((col) => String(row[col])).join('|')
      : JSON.stringify(row);
    if (seen.has(key)) {
      duplicates++;
    } else {
      seen.add(key);
    }
  });
  return duplicates;
}

export function detectOutliers(data: RowData[], columns: string[]): Record<string, number[]> {
  const outliersMap: Record<string, number[]> = {};
  columns.forEach((col) => {
    const values = data
      .map((row) => Number(row[col]))
      .filter((v) => !isNaN(v));
    if (values.length < 4) return;
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const columnOutlierIndices: number[] = [];
    data.forEach((row, idx) => {
      const val = Number(row[col]);
      if (!isNaN(val) && (val < lowerBound || val > upperBound)) {
        columnOutlierIndices.push(idx);
      }
    });
    outliersMap[col] = columnOutlierIndices;
  });
  return outliersMap;
}

export function imputeMissing(data: RowData[], column: string, strategy: 'mean' | 'median' | 'mode' | 'constant', value?: any): RowData[] {
  const values = data.map((row) => row[column]).filter((v) => v !== undefined && v !== null && v !== '');
  let fillValue = value;

  if (strategy === 'mean' || strategy === 'median') {
    const numValues = values.map((v) => Number(v)).filter((v) => !isNaN(v));
    if (numValues.length > 0) {
      if (strategy === 'mean') {
        fillValue = numValues.reduce((sum, v) => sum + v, 0) / numValues.length;
      } else {
        const sorted = [...numValues].sort((a, b) => a - b);
        fillValue = sorted[Math.floor(sorted.length / 2)];
      }
    } else {
      fillValue = 0;
    }
  } else if (strategy === 'mode') {
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let modeVal = values[0];
    values.forEach((v) => {
      const strVal = String(v);
      counts[strVal] = (counts[strVal] || 0) + 1;
      if (counts[strVal] > maxCount) {
        maxCount = counts[strVal];
        modeVal = v;
      }
    });
    fillValue = modeVal;
  }

  return data.map((row) => {
    const cellVal = row[column];
    if (cellVal === undefined || cellVal === null || cellVal === '') {
      return { ...row, [column]: fillValue };
    }
    return row;
  });
}

export function oneHotEncode(data: RowData[], column: string): RowData[] {
  const uniqueValues = Array.from(new Set(data.map((row) => String(row[column] ?? ''))));
  return data.map((row) => {
    const newRow = { ...row };
    const val = String(row[column] ?? '');
    uniqueValues.forEach((uniq) => {
      const colName = `${column}_${uniq.replace(/\s+/g, '_').toLowerCase()}`;
      newRow[colName] = val === uniq ? 1 : 0;
    });
    delete newRow[column];
    return newRow;
  });
}

export function standardScale(data: RowData[], column: string): RowData[] {
  const values = data.map((row) => Number(row[column])).filter((v) => !isNaN(v));
  if (values.length === 0) return data;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance) || 1;

  return data.map((row) => {
    const val = Number(row[column]);
    return {
      ...row,
      [`${column}_scaled`]: isNaN(val) ? 0 : parseFloat(((val - mean) / stdDev).toFixed(4)),
    };
  });
}

export function extractDateFeatures(data: RowData[], column: string): RowData[] {
  return data.map((row) => {
    const dateVal = new Date(row[column]);
    const isValid = !isNaN(dateVal.getTime());
    return {
      ...row,
      [`${column}_year`]: isValid ? dateVal.getFullYear() : null,
      [`${column}_month`]: isValid ? dateVal.getMonth() + 1 : null,
      [`${column}_day`]: isValid ? dateVal.getDate() : null,
      [`${column}_day_of_week`]: isValid ? dateVal.getDay() : null,
    };
  });
}

export function generatePolynomialFeatures(data: RowData[], column: string, degree: number = 2): RowData[] {
  return data.map((row) => {
    const val = Number(row[column]);
    const newRow = { ...row };
    if (!isNaN(val)) {
      for (let d = 2; d <= degree; d++) {
        newRow[`${column}_power_${d}`] = Math.pow(val, d);
      }
    }
    return newRow;
  });
}

export function generateInteractionFeatures(data: RowData[], colA: string, colB: string): RowData[] {
  return data.map((row) => {
    const valA = Number(row[colA]);
    const valB = Number(row[colB]);
    return {
      ...row,
      [`${colA}_x_${colB}`]: isNaN(valA) || isNaN(valB) ? null : valA * valB,
    };
  });
}
