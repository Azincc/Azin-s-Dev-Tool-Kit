import React, { useState, useMemo } from 'react';
import { Card, CardHeader, TextArea, Label } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';

export const DiffTools: React.FC = () => {
  const [diffLeft, setDiffLeft] = useState<string>('');
  const [diffRight, setDiffRight] = useState<string>('');
  const { t } = useAppContext();
  const diffResult = useMemo(() => {
    const a = diffLeft.split('\n');
    const b = diffRight.split('\n');
    const max = Math.max(a.length, b.length);
    const res = [];
    for (let i = 0; i < max; i++) {
      const l = a[i] || '';
      const r = b[i] || '';
      res.push({ idx: i + 1, l, r, type: l === r ? 'same' : 'diff' });
    }
    return res;
  }, [diffLeft, diffRight]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.diff.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.diff.desc')}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 h-[400px]">
        <div className="flex flex-col gap-2 h-full">
          <Label>{t('tool.diff.original')}</Label>
          <TextArea
            value={diffLeft}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDiffLeft(e.target.value)}
            className="flex-1 resize-none font-mono text-xs whitespace-pre bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
        <div className="flex flex-col gap-2 h-full">
          <Label>{t('tool.diff.changed')}</Label>
          <TextArea
            value={diffRight}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDiffRight(e.target.value)}
            className="flex-1 resize-none font-mono text-xs whitespace-pre bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>
      </div>
      <Card>
        <CardHeader title={t('tool.diff.result')} />
        <div className="p-0 bg-white dark:bg-slate-900 overflow-auto max-h-[400px]">
          <table className="w-full font-mono text-xs border-collapse">
            <tbody>
              {diffResult.map((row) => (
                <tr
                  key={row.idx}
                  className={row.type === 'diff' ? 'bg-yellow-100 dark:bg-yellow-900/20' : ''}
                >
                  <td className="w-12 p-1 text-slate-400 dark:text-slate-600 text-right select-none border-r border-slate-200 dark:border-slate-800">
                    {row.idx}
                  </td>
                  <td
                    className={`p-1 w-1/2 border-r border-slate-200 dark:border-slate-800 ${
                      row.type === 'diff'
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {row.l}
                  </td>
                  <td
                    className={`p-1 w-1/2 ${
                      row.type === 'diff'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-200'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {row.r}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
