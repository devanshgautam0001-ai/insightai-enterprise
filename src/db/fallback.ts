import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'fallback_db');

function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
}

export function readTable(tableName: string): any[] {
  ensureDbDir();
  const file = path.join(DB_DIR, `${tableName}.json`);
  if (!fs.existsSync(file)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
}

export function writeTable(tableName: string, data: any[]) {
  ensureDbDir();
  const file = path.join(DB_DIR, `${tableName}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// Global flag to track fallback state
export let useFallback = false;
export function setUseFallback(val: boolean) {
  useFallback = val;
  if (val) {
    console.log("[Database] Local persistent database mode activated.");
  }
}

function getRowValue(row: any, key: string) {
  if (!row) return undefined;
  if (row[key] !== undefined) return row[key];
  
  // Try converting camelCase to snake_case
  const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  if (row[snakeKey] !== undefined) return row[snakeKey];
  
  // Try converting snake_case to camelCase
  const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  if (row[camelKey] !== undefined) return row[camelKey];
  
  return undefined;
}

// Simple helper to match string conditions
function matchesCondition(row: any, column: string, value: any): boolean {
  const rowValue = getRowValue(row, column);
  if (rowValue === undefined) {
    return false;
  }
  if (rowValue === null && value === null) {
    return true;
  }
  return String(rowValue) === String(value);
}

function parseSelectedColumns(sql: string): string[] {
  const cleanSql = sql.replace(/\s+/g, ' ').trim();
  const lowerSql = cleanSql.toLowerCase();

  // 1. Check for RETURNING clause first (typically for INSERT, UPDATE, DELETE)
  const returningIdx = lowerSql.lastIndexOf(' returning ');
  if (returningIdx !== -1) {
    const colsStr = cleanSql.slice(returningIdx + 11).trim();
    return colsStr.split(',').map(c => {
      const part = c.trim().split('.').pop() || '';
      return part.replace(/"/g, '').trim();
    });
  }

  // 2. Check for SELECT clause
  if (lowerSql.startsWith('select ')) {
    const fromIdx = lowerSql.indexOf(' from ');
    if (fromIdx !== -1) {
      const colsStr = cleanSql.slice(7, fromIdx).trim();
      return colsStr.split(',').map(c => {
        const aliasMatch = c.match(/ as\s+"?([a-zA-Z0-9_]+)"?/i);
        if (aliasMatch) {
          return aliasMatch[1];
        }
        const part = c.trim().split('.').pop() || '';
        return part.replace(/"/g, '').trim();
      });
    }
  }

  return [];
}

function formatResult(queryText: string, rows: any[], rowMode?: string) {
  // Parse any date-like strings into real Date objects and add mapped camel/snake keys
  const processedRows = rows.map(row => {
    const copy = { ...row };
    
    // First, populate both snake_case and camelCase keys for all existing keys
    for (const key in row) {
      const val = row[key];
      if (key.includes('_')) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        copy[camelKey] = val;
      }
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (snakeKey !== key) {
        copy[snakeKey] = val;
      }
    }

    // Next, convert dates and ensure they are populated for both keys as well
    for (const key in copy) {
      const val = copy[key];
      if (typeof val === 'string' && (key === 'created_at' || key === 'updated_at' || key === 'last_login' || key.endsWith('_at') || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val))) {
        const parsedDate = new Date(val);
        if (!isNaN(parsedDate.getTime())) {
          copy[key] = parsedDate;
          
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          copy[camelKey] = parsedDate;
          
          const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
          copy[snakeKey] = parsedDate;
        }
      }
    }
    return copy;
  });

  if (rowMode === 'array') {
    const selectedColumns = parseSelectedColumns(queryText);
    const arrayRows = processedRows.map(row => {
      return selectedColumns.map(col => {
        const val = getRowValue(row, col);
        return val === undefined ? null : val;
      });
    });
    return {
      rows: arrayRows,
      rowCount: arrayRows.length,
      fields: selectedColumns.map(col => ({ name: col }))
    };
  }
  return { rows: processedRows, rowCount: processedRows.length };
}

export async function executeFallbackQuery(sql: any, params: any = []): Promise<{ rows: any[]; rowCount: number }> {
  // Unpack pg QueryConfig objects (e.g. { text: '...', values: [...] })
  const queryText = typeof sql === 'string' ? sql : (sql?.text || '');
  const queryParams = Array.isArray(params) && params.length > 0 ? params : (sql?.values || []);

  const cleanSql = queryText.replace(/\s+/g, ' ').trim();
  const lowerSql = cleanSql.toLowerCase();

  // 1. Handle DDL (CREATE TABLE, ALTER TABLE, etc.)
  if (lowerSql.startsWith('create table') || lowerSql.startsWith('alter table') || lowerSql.startsWith('drop table')) {
    console.log(`[SQL Fallback Mock DDL] Executing: ${cleanSql.slice(0, 80)}...`);
    return { rows: [], rowCount: 0 };
  }

  // 2. Extract Table Name
  let tableName = '';
  const insertMatch = cleanSql.match(/insert\s+into\s+"?([a-zA-Z0-9_]+)"?/i);
  const selectMatch = cleanSql.match(/from\s+"?([a-zA-Z0-9_]+)"?/i);
  const updateMatch = cleanSql.match(/update\s+"?([a-zA-Z0-9_]+)"?/i);
  const deleteMatch = cleanSql.match(/delete\s+from\s+"?([a-zA-Z0-9_]+)"?/i);

  if (insertMatch) {
    tableName = insertMatch[1];
  } else if (selectMatch) {
    tableName = selectMatch[1];
  } else if (updateMatch) {
    tableName = updateMatch[1];
  } else if (deleteMatch) {
    tableName = deleteMatch[1];
  }

  if (!tableName) {
    // If it's a generic "SELECT 1" or similar query
    if (lowerSql.includes('select 1') || lowerSql.includes('select now()')) {
      const row = { result: 1, now: new Date() };
      if (sql?.rowMode === 'array') {
        return { rows: [[1, row.now]], rowCount: 1, fields: [{ name: 'result' }, { name: 'now' }] } as any;
      }
      return { rows: [row], rowCount: 1 } as any;
    }
    console.warn(`[SQL Fallback] Could not determine table name for query: ${cleanSql}`);
    return { rows: [], rowCount: 0 };
  }

  // Load current table state
  let tableData = readTable(tableName);

  // 3. Handle INSERT
  if (insertMatch) {
    const isUpsert = lowerSql.includes('on conflict');
    const colsMatch = cleanSql.match(/insert\s+into\s+"?[a-zA-Z0-9_]+"?\s*\(([^)]+)\)/i);
    if (!colsMatch) {
      throw new Error(`[SQL Fallback] Unable to parse columns for INSERT into ${tableName}`);
    }
    const columns = colsMatch[1].split(',').map((c: string) => c.trim().replace(/"/g, ''));
    
    // Parse the values (...) clause
    const valsMatch = cleanSql.match(/values\s*\(([^)]+)\)/i);
    if (!valsMatch) {
      throw new Error(`[SQL Fallback] Unable to parse values clause for INSERT into ${tableName}`);
    }
    const valTokens = valsMatch[1].split(',').map((v: string) => v.trim().replace(/"/g, ''));

    console.log("[SQL Fallback INSERT Debug]", { queryText, columns, valTokens, queryParams });

    const newRow: any = {};
    const nextId = tableData.length > 0 ? Math.max(...tableData.map((r: any) => parseInt(r.id || 0, 10))) + 1 : 1;

    columns.forEach((col: string, idx: number) => {
      const valToken = valTokens[idx];
      if (!valToken || valToken.toLowerCase() === 'default' || valToken.toLowerCase() === 'null') {
        if (col === 'id') {
          newRow[col] = nextId;
        } else if (col === 'created_at' || col === 'updated_at' || col === 'last_login') {
          newRow[col] = new Date().toISOString();
        } else {
          newRow[col] = null;
        }
      } else if (valToken.startsWith('$')) {
        const paramIdx = parseInt(valToken.slice(1), 10) - 1;
        newRow[col] = queryParams[paramIdx];
      } else {
        let val: any = valToken;
        if (val.startsWith("'") && val.endsWith("'")) {
          val = val.slice(1, -1);
        } else if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1);
        } else if (val.toLowerCase() === 'true') {
          val = true;
        } else if (val.toLowerCase() === 'false') {
          val = false;
        } else if (!isNaN(Number(val))) {
          val = Number(val);
        }
        newRow[col] = val;
      }
    });

    if (isUpsert) {
      const conflictTargetMatch = cleanSql.match(/on conflict\s*\(\s*"?([a-zA-Z0-9_]+)"?\s*\)/i);
      const conflictCol = conflictTargetMatch ? conflictTargetMatch[1] : 'uid';
      const existingIdx = tableData.findIndex((r: any) => matchesCondition(r, conflictCol, newRow[conflictCol]));
      if (existingIdx !== -1) {
        tableData[existingIdx] = {
          ...tableData[existingIdx],
          ...newRow,
          updated_at: new Date().toISOString()
        };
        writeTable(tableName, tableData);
        return formatResult(queryText, [tableData[existingIdx]], sql?.rowMode) as any;
      }
    }

    tableData.push(newRow);
    writeTable(tableName, tableData);
    return formatResult(queryText, [newRow], sql?.rowMode) as any;
  }

  // Parse filters from WHERE clause
  const parseFilters = (): Array<{ column: string; value: any }> => {
    const filters: Array<{ column: string; value: any }> = [];
    
    // Match table.column = $X pattern
    const regex1 = /"?([a-zA-Z0-9_]+)"?\."?([a-zA-Z0-9_]+)"?\s*=\s*\$([0-9]+)/g;
    let m;
    while ((m = regex1.exec(cleanSql)) !== null) {
      const col = m[2];
      const paramIdx = parseInt(m[3], 10) - 1;
      filters.push({ column: col, value: queryParams[paramIdx] });
    }

    // Match column = $X pattern (excluding table prefix)
    const regex2 = /(?:where|and)\s+"?([a-zA-Z0-9_]+)"?\s*=\s*\$([0-9]+)/gi;
    while ((m = regex2.exec(cleanSql)) !== null) {
      const col = m[1];
      const paramIdx = parseInt(m[2], 10) - 1;
      if (!filters.some(f => f.column === col)) {
        filters.push({ column: col, value: queryParams[paramIdx] });
      }
    }

    return filters;
  };

  const filters = parseFilters();

  const applyFilters = (rows: any[]): any[] => {
    return rows.filter(row => {
      for (const filter of filters) {
        if (!matchesCondition(row, filter.column, filter.value)) {
          return false;
        }
      }
      return true;
    });
  };

  // 4. Handle UPDATE
  if (updateMatch) {
    const setsStrMatch = cleanSql.match(/set\s+(.+?)\s+(?:where|$)/i);
    if (!setsStrMatch) {
      throw new Error(`[SQL Fallback] Unable to parse SET clause for UPDATE in ${tableName}`);
    }
    const setsStr = setsStrMatch[1];
    const sets: Record<string, any> = {};
    const setRegex = /"?([a-zA-Z0-9_]+)"?\s*=\s*\$([0-9]+)/g;
    let sm;
    while ((sm = setRegex.exec(setsStr)) !== null) {
      sets[sm[1]] = queryParams[parseInt(sm[2], 10) - 1];
    }

    const matchedRows = applyFilters(tableData);
    matchedRows.forEach(row => {
      Object.assign(row, sets);
      row.updated_at = new Date().toISOString();
    });

    writeTable(tableName, tableData);
    return formatResult(queryText, matchedRows, sql?.rowMode) as any;
  }

  // 5. Handle DELETE
  if (deleteMatch) {
    const matchedRows = applyFilters(tableData);
    const remainingRows = tableData.filter(row => !matchedRows.includes(row));
    writeTable(tableName, remainingRows);
    return formatResult(queryText, matchedRows, sql?.rowMode) as any;
  }

  // 6. Handle SELECT
  if (selectMatch) {
    let filteredRows = applyFilters(tableData);

    // Handle ORDER BY
    const orderMatch = cleanSql.match(/order\s+by\s+"?([a-zA-Z0-9_]+)"?\."?([a-zA-Z0-9_]+)"?(?:\s+(asc|desc))?/i) ||
                       cleanSql.match(/order\s+by\s+"?([a-zA-Z0-9_]+)"?(?:\s+(asc|desc))?/i);
    if (orderMatch) {
      const col = orderMatch[2] || orderMatch[1];
      const direction = (orderMatch[3] || 'asc').toLowerCase();
      filteredRows.sort((a, b) => {
        const valA = a[col];
        const valB = b[col];
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return direction === 'asc' ? valA - valB : valB - valA;
        }
        
        const strA = String(valA);
        const strB = String(valB);
        return direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }

    // Handle LIMIT
    const limitMatch = cleanSql.match(/limit\s+([0-9]+)/i);
    if (limitMatch) {
      const limit = parseInt(limitMatch[1], 10);
      filteredRows = filteredRows.slice(0, limit);
    }

    return formatResult(queryText, filteredRows, sql?.rowMode) as any;
  }

  return { rows: [], rowCount: 0 };
}

