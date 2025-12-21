import React, { useState, useMemo } from 'react';
import { Card, CardHeader, TextArea, Label } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { SEO } from '../ui/SEO';
import { diffLines } from 'diff';

interface DiffRow {
  leftIdx?: number;
  rightIdx?: number;
  l: string;
  r: string;
  type: 'same' | 'add' | 'remove';
}

export const DiffTools: React.FC = () => {
  const [diffLeft, setDiffLeft] = useState<string>('');
  const [diffRight, setDiffRight] = useState<string>('');
  const { t } = useAppContext();

  const diffResult = useMemo(() => {
    if (!diffLeft && !diffRight) return [];

    const changes = diffLines(diffLeft, diffRight);
    const rows: DiffRow[] = [];

    let leftLine = 1;
    let rightLine = 1;

    changes.forEach((part) => {
      // Split by newline, but handle strict ending to avoid extra empty row if ends with \n
      const lines = part.value.endsWith('\n')
        ? part.value.slice(0, -1).split('\n')
        : part.value.split('\n');

      if (part.added) {
        lines.forEach((line) => {
          rows.push({
            rightIdx: rightLine++,
            l: '',
            r: line,
            type: 'add',
          });
        });
      } else if (part.removed) {
        lines.forEach((line) => {
          rows.push({
            leftIdx: leftLine++,
            l: line,
            r: '',
            type: 'remove',
          });
        });
      } else {
        lines.forEach((line) => {
          rows.push({
            leftIdx: leftLine++,
            rightIdx: rightLine++,
            l: line,
            r: line,
            type: 'same',
          });
        });
      }
    });

    return rows;
  }, [diffLeft, diffRight]);

  return (
    <div className="space-y-6">
      <SEO pageId="diff" />
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
            placeholder="Original text..."
          />
        </div>
        <div className="flex flex-col gap-2 h-full">
          <Label>{t('tool.diff.changed')}</Label>
          <TextArea
            value={diffRight}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDiffRight(e.target.value)}
            className="flex-1 resize-none font-mono text-xs whitespace-pre bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            placeholder="Changed text..."
          />
        </div>
      </div>
      <Card>
        <CardHeader title={t('tool.diff.result')} />
        <div className="p-0 bg-white dark:bg-slate-900 overflow-auto max-h-[400px]">
          <table className="w-full font-mono text-xs border-collapse table-fixed">
            <colgroup>
              <col className="w-12" />
              <col className="w-[calc(50%-24px)]" />
              <col className="w-12" />
              <col className="w-[calc(50%-24px)]" />
            </colgroup>
            <tbody>
              {diffResult.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                  {/* Left Gutter */}
                  <td className="p-1 text-slate-400 dark:text-slate-600 text-right select-none border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    {row.leftIdx || ''}
                  </td>
                  {/* Left Content */}
                  <td
                    className={`p-1 break-all whitespace-pre-wrap border-r border-slate-200 dark:border-slate-800 ${
                      row.type === 'remove'
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-900 dark:text-red-200'
                        : row.type === 'add'
                          ? 'bg-slate-100 dark:bg-slate-900/50' // Empty placeholder for added line
                          : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {row.l}
                  </td>

                  {/* Right Gutter */}
                  <td className="p-1 text-slate-400 dark:text-slate-600 text-right select-none border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                    {row.rightIdx || ''}
                  </td>
                  {/* Right Content */}
                  <td
                    className={`p-1 break-all whitespace-pre-wrap ${
                      row.type === 'add'
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-900 dark:text-green-200'
                        : row.type === 'remove'
                          ? 'bg-slate-100 dark:bg-slate-900/50' // Empty placeholder for removed line
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
