import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, Button, CopyButton, Select } from '../components/ui/Shared';
import { TrashIcon, FileTextIcon, ShuffleIcon } from '../components/ui/Icons';
import { useAppContext } from '../contexts/AppContext';
import { useLocation } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export const CsvTools: React.FC = () => {
  const { t } = useAppContext();
  const location = useLocation();
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [currentSheet, setCurrentSheet] = useState<string>('');
  const workbookRef = useRef<XLSX.WorkBook | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.state?.data && Array.isArray(location.state.data) && location.state.data.length > 0) {
        const d = location.state.data;
        setData(d);
        setHeaders(Object.keys(d[0] as object));
        setFileName('imported_data');
        // Clear state to avoid reloading on simple refreshes or nav
        window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const ext = file.name.split('.').pop()?.toLowerCase();

    // Reset previous workbook data
    workbookRef.current = null;
    setSheetNames([]);
    setCurrentSheet('');

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setHeaders(Object.keys(results.data[0] as object));
            setData(results.data);
          }
        }
      });
    } else if (['xls', 'xlsx'].includes(ext || '')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        
        workbookRef.current = wb;
        setSheetNames(wb.SheetNames);
        
        if (wb.SheetNames.length > 0) {
           loadSheet(wb.SheetNames[0]);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const loadSheet = (sheetName: string) => {
    if (!workbookRef.current) return;
    setCurrentSheet(sheetName);
    const ws = workbookRef.current.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(ws);
    
    if (jsonData.length > 0) {
        setHeaders(Object.keys(jsonData[0] as object));
        setData(jsonData);
    } else {
        setHeaders([]);
        setData([]);
    }
  };

  const handleSheetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      loadSheet(e.target.value);
  };

  const filteredData = data.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const exportJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.split('.')[0] || 'export'}.json`;
    link.click();
  };

  const exportSql = () => {
    if (data.length === 0) return;
    const table = fileName.split('.')[0].replace(/[^a-zA-Z0-9_]/g, '_') || 'table_name';
    const cols = headers.map(h => h.replace(/[^a-zA-Z0-9_]/g, '_')).join(', ');
    
    const statements = data.map(row => {
      const values = headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') return val;
        return `'${String(val).replace(/'/g, "''")}'`;
      }).join(', ');
      return `INSERT INTO ${table} (${cols}) VALUES (${values});`;
    }).join('\n');

    const blob = new Blob([statements], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.split('.')[0] || 'export'}.sql`;
    link.click();
  };

  const exportCsv = () => {
    if (data.length === 0) return;
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName.split('.')[0] || 'export'}.csv`;
    link.click();
  };

  const exportExcel = () => {
    if (data.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName.split('.')[0] || 'export'}.xlsx`);
  };

  const clearData = () => {
    setData([]);
    setHeaders([]);
    setFileName('');
    setSearchTerm('');
    setSheetNames([]);
    setCurrentSheet('');
    workbookRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.csv.title')}</h2>
          <p className="text-slate-500 dark:text-slate-400">{t('tool.csv.desc')}</p>
        </div>
        {data.length > 0 && (
           <div className="flex gap-2">
             <Button onClick={exportJson} variant="secondary" size="sm">{t('tool.csv.toJson')}</Button>
             <Button onClick={exportSql} variant="secondary" size="sm">{t('tool.csv.toSql')}</Button>
             <Button onClick={exportCsv} variant="secondary" size="sm">{t('tool.csv.toCsv')}</Button>
             <Button onClick={exportExcel} variant="secondary" size="sm">{t('tool.csv.toExcel')}</Button>
             <Button onClick={clearData} variant="danger" size="sm" className="px-2"><TrashIcon className="w-4 h-4" /></Button>
           </div>
        )}
      </div>

      <Card className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.xlsx,.xls"
              className="hidden"
            />
            <Button onClick={() => fileInputRef.current?.click()} variant="primary">
              <FileTextIcon className="w-4 h-4 mr-2" />
              {t('tool.csv.import')}
            </Button>
            {fileName && <span className="text-sm font-mono text-slate-600 dark:text-slate-400">{fileName}</span>}
          </div>

          {sheetNames.length > 1 && (
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">{t('tool.csv.rows') /* reusing label for 'Sheet' if lazy, but better add specific label */}:</span>
                <Select value={currentSheet} onChange={handleSheetChange} className="w-40">
                    {sheetNames.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
            </div>
          )}
          
          {data.length > 0 && (
            <div className="flex items-center gap-4">
               <div className="text-xs text-slate-500">
                 {data.length} {t('tool.csv.rows')} × {headers.length} {t('tool.csv.cols')}
               </div>
               <input
                 type="text"
                 placeholder={t('tool.csv.search')}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="px-3 py-1.5 text-sm rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
               />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          {data.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShuffleIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>{t('tool.csv.desc')}</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-900 dark:text-slate-400 sticky top-0 z-10">
                <tr>
                  {headers.map((header) => (
                    <th key={header} className="px-6 py-3 border-b border-slate-200 dark:border-slate-700 font-medium whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 100).map((row, i) => (
                  <tr key={i} className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                    {headers.map((header) => (
                      <td key={`${i}-${header}`} className="px-6 py-4 whitespace-nowrap text-slate-900 dark:text-slate-300 font-mono text-xs">
                         {row[header] !== null && row[header] !== undefined ? String(row[header]) : ''}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredData.length > 100 && (
                   <tr>
                     <td colSpan={headers.length} className="px-6 py-4 text-center text-slate-500 italic">
                       {t('tool.json.output') ? `Showing first 100 of ${filteredData.length} rows` : `... ${filteredData.length - 100} more rows ...`}
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};
