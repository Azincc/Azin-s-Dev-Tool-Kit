import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, TextArea, Input, Label, Button } from '../components/ui/Shared';
import { useAppContext } from '../contexts/AppContext';

export const EditorTools: React.FC = () => {
  const [text, setText] = useState('');
  const { t } = useAppContext();
  const stats = useMemo(() => ({
    chars: text.length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text.split(/\r\n|\r|\n/).length,
  }), [text]);

  const handleDedupe = () => setText([...new Set(text.split('\n'))].join('\n'));
  const handleLorem = () => setText(prev => prev + (prev ? "\n" : "") + "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");

  return (
    <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.editor.title')}</h2><p className="text-slate-500 dark:text-slate-400">{t('tool.editor.desc')}</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><Card className="h-full flex flex-col"><CardHeader title="Editor" /><TextArea value={text} onChange={e => setText(e.target.value)} className="flex-1 min-h-[400px] border-0 p-4 resize-none" placeholder="Paste text here..." /></Card></div>
            <div className="space-y-6">
                <Card><CardHeader title="Statistics" /><CardContent className="grid grid-cols-2 gap-4"><div className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-center"><div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.chars}</div><div className="text-xs text-slate-500 uppercase">Chars</div></div><div className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-center"><div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.words}</div><div className="text-xs text-slate-500 uppercase">Words</div></div><div className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-center col-span-2"><div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.lines}</div><div className="text-xs text-slate-500 uppercase">Lines</div></div></CardContent></Card>
                <Card><CardHeader title="Actions" /><CardContent className="flex flex-col gap-2"><Button variant="secondary" onClick={handleLorem}>Insert Lorem</Button><Button variant="secondary" onClick={handleDedupe}>Dedupe Lines</Button><Button variant="secondary" onClick={() => setText(text.toUpperCase())}>UPPER CASE</Button><Button variant="danger" onClick={() => setText('')}>Clear</Button></CardContent></Card>
            </div>
        </div>
    </div>
  );
};

export const RegexTools: React.FC = () => {
  const [text, setText] = useState('');
  const [regexPattern, setRegexPattern] = useState('');
  const [regexFlags, setRegexFlags] = useState('gm');
  const { t } = useAppContext();
  
  const regexMatches = useMemo(() => {
    if (!regexPattern) return [];
    try { return text.match(new RegExp(regexPattern, regexFlags)) || []; } catch { return null; }
  }, [text, regexPattern, regexFlags]);

  return (
    <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.regex.title')}</h2><p className="text-slate-500 dark:text-slate-400">{t('tool.regex.desc')}</p></div>
        <Card>
            <CardContent className="space-y-4 p-6">
                <div className="flex gap-2"><Input value={regexPattern} onChange={e => setRegexPattern(e.target.value)} placeholder="Pattern (e.g. \d+)" className="flex-1 font-mono text-emerald-600 dark:text-emerald-400" /><Input value={regexFlags} onChange={e => setRegexFlags(e.target.value)} placeholder="Flags" className="w-24 font-mono" /></div>
                <TextArea value={text} onChange={e => setText(e.target.value)} placeholder="Test string..." className="h-32" />
                <div className="bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-700 p-4 min-h-[150px]"><Label>Matches ({regexMatches?.length || 0})</Label><div className="flex flex-wrap gap-2 mt-2">{regexMatches === null ? <span className="text-red-400">Invalid Regex</span> : regexMatches.length === 0 ? <span className="text-slate-500 italic">No matches found</span> : regexMatches.map((m, i) => <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded text-sm font-mono border border-blue-200 dark:border-blue-800">{m}</span>)}</div></div>
            </CardContent>
        </Card>
    </div>
  );
};

export const DiffTools: React.FC = () => {
  const [diffLeft, setDiffLeft] = useState('');
  const [diffRight, setDiffRight] = useState('');
  const { t } = useAppContext();
  const diffResult = useMemo(() => {
      const a = diffLeft.split('\n');
      const b = diffRight.split('\n');
      const max = Math.max(a.length, b.length);
      const res = [];
      for(let i=0; i<max; i++) {
          const l = a[i] || "";
          const r = b[i] || "";
          res.push({ idx: i+1, l, r, type: l === r ? 'same' : 'diff' });
      }
      return res;
  }, [diffLeft, diffRight]);

  return (
    <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.diff.title')}</h2><p className="text-slate-500 dark:text-slate-400">{t('tool.diff.desc')}</p></div>
        <div className="grid grid-cols-2 gap-4 h-[400px]"><div className="flex flex-col gap-2 h-full"><Label>Original</Label><TextArea value={diffLeft} onChange={e => setDiffLeft(e.target.value)} className="flex-1 resize-none font-mono text-xs whitespace-pre" /></div><div className="flex flex-col gap-2 h-full"><Label>Changed</Label><TextArea value={diffRight} onChange={e => setDiffRight(e.target.value)} className="flex-1 resize-none font-mono text-xs whitespace-pre" /></div></div>
        <Card><CardHeader title="Result" /><div className="p-0 bg-slate-100 dark:bg-slate-950 overflow-auto max-h-[400px]"><table className="w-full font-mono text-xs border-collapse"><tbody>{diffResult.map((row) => (<tr key={row.idx} className={row.type === 'diff' ? 'bg-yellow-100 dark:bg-yellow-900/20' : ''}><td className="w-12 p-1 text-slate-400 dark:text-slate-600 text-right select-none border-r border-slate-200 dark:border-slate-800">{row.idx}</td><td className={`p-1 w-1/2 border-r border-slate-200 dark:border-slate-800 ${row.type === 'diff' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-200' : 'text-slate-600 dark:text-slate-400'}`}>{row.l}</td><td className={`p-1 w-1/2 ${row.type === 'diff' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-200' : 'text-slate-600 dark:text-slate-400'}`}>{row.r}</td></tr>))}</tbody></table></div></Card>
    </div>
  );
};