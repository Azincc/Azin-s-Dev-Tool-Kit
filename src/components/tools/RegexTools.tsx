import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, TextArea, Label, Button } from '../ui/Shared';
import { TrashIcon } from '../ui/Icons';
import { useAppContext } from '../../contexts/AppContext';
import { CustomSelect } from '../CustomSelect';
import { useToast } from '../ui/Toast';

interface RegexEntry {
  id: string;
  pattern: string;
  flags: string;
  customFlag: string;
}

interface HighlightRange {
  start: number;
  end: number;
  colorBg: string;
}

interface RegexMatchResult {
  id: string;
  matches: string[];
  ranges: { start: number; end: number }[];
  error: boolean;
}

const COLORS = [
  {
    bg: 'bg-blue-100 dark:bg-blue-900/50',
    text: 'text-blue-700 dark:text-blue-200',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
    name: 'Blue',
  },
  {
    bg: 'bg-green-100 dark:bg-green-900/50',
    text: 'text-green-700 dark:text-green-200',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
    name: 'Green',
  },
  {
    bg: 'bg-purple-100 dark:bg-purple-900/50',
    text: 'text-purple-700 dark:text-purple-200',
    border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
    name: 'Purple',
  },
  {
    bg: 'bg-orange-100 dark:bg-orange-900/50',
    text: 'text-orange-700 dark:text-orange-200',
    border: 'border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500',
    name: 'Orange',
  },
  {
    bg: 'bg-pink-100 dark:bg-pink-900/50',
    text: 'text-pink-700 dark:text-pink-200',
    border: 'border-pink-200 dark:border-pink-800',
    dot: 'bg-pink-500',
    name: 'Pink',
  },
  {
    bg: 'bg-teal-100 dark:bg-teal-900/50',
    text: 'text-teal-700 dark:text-teal-200',
    border: 'border-teal-200 dark:border-teal-800',
    dot: 'bg-teal-500',
    name: 'Teal',
  },
];

// Web Worker code
const workerCode = `
self.onmessage = function(e) {
  const { regexes, text } = e.data;
  const results = regexes.map(r => {
    if (!r.pattern) return { id: r.id, matches: [], ranges: [], error: null };
    const actualFlags = r.flags === 'custom' ? r.customFlag : r.flags;
    try {
      const regex = new RegExp(r.pattern, actualFlags);
      const matches = [];
      const ranges = [];
      let match;
      
      let count = 0;
      const MAX_MATCHES = 2000;

      if (regex.global) {
        while ((match = regex.exec(text)) !== null) {
           if (count++ > MAX_MATCHES) break;
           matches.push(match[0]);
           ranges.push({ start: match.index, end: match.index + match[0].length });
           if (match[0].length === 0) regex.lastIndex++;
        }
      } else {
        match = regex.exec(text);
        if (match) {
           matches.push(match[0]);
           ranges.push({ start: match.index, end: match.index + match[0].length });
        }
      }
      return { id: r.id, matches, ranges, error: null };
    } catch (e) {
      return { id: r.id, matches: [], ranges: [], error: true };
    }
  });
  self.postMessage(results);
};
`;

const HighlightedTextArea: React.FC<{
  value: string;
  onChange: (value: string) => void;
  highlightRanges: HighlightRange[];
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, highlightRanges, placeholder, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleScroll = () => {
    if (backdropRef.current && textareaRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
      backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  const highlights = useMemo(() => {
    if (!value) return null;

    const charColors: string[] = new Array(value.length).fill('');

    // Apply ranges. 
    highlightRanges.forEach(range => {
      const start = Math.max(0, range.start);
      const end = Math.min(value.length, range.end);
      for (let i = start; i < end; i++) {
        charColors[i] = range.colorBg;
      }
    });

    const rendered = [];
    let currentClass = charColors[0];
    let currentText = '';

    for (let i = 0; i < value.length; i++) {
      if (charColors[i] !== currentClass) {
        if (currentText) {
          rendered.push(
            <span key={i - currentText.length} className={currentClass || undefined}>
              {currentText}
            </span>
          );
        }
        currentClass = charColors[i];
        currentText = value[i];
      } else {
        currentText += value[i];
      }
    }
    if (currentText) {
      rendered.push(
        <span key={value.length} className={currentClass || undefined}>
          {currentText}
        </span>
      );
    }

    if (value.endsWith('\n')) {
      rendered.push(<br key="br" />);
    }

    return rendered;
  }, [value, highlightRanges]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        ref={backdropRef}
        className="absolute inset-0 p-3 whitespace-pre-wrap break-words font-mono text-sm pointer-events-none z-0 overflow-auto text-transparent bg-transparent border border-transparent"
        aria-hidden="true"
      >
        {highlights}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        placeholder={placeholder}
        className="relative z-10 block w-full h-full p-3 bg-transparent font-mono text-sm caret-slate-900 dark:caret-white text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none overflow-auto whitespace-pre-wrap break-words"
        spellCheck={false}
      />
    </div>
  );
};

export const RegexTools: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [regexes, setRegexes] = useState<RegexEntry[]>([
    { id: '1', pattern: '', flags: 'gm', customFlag: '' },
  ]);
  const [regexResults, setRegexResults] = useState<RegexMatchResult[]>([]);
  const { t } = useAppContext();
  const { addToast } = useToast();
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) workerRef.current.terminate();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (!text && regexes.every(r => !r.pattern)) {
      setRegexResults([]);
      return;
    }

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    workerRef.current = new Worker(URL.createObjectURL(blob));

    workerRef.current.onmessage = (e) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setRegexResults(e.data);
    };

    workerRef.current.postMessage({ regexes, text });

    timerRef.current = window.setTimeout(() => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
        addToast(t('tool.regex.timeout'), 'warning');
      }
    }, 1000);

  }, [text, regexes, addToast]);

  const flagOptions = [
    { value: 'g', label: t('tool.regex.flag.g'), desc: t('tool.regex.flag.g_desc') },
    { value: 'i', label: t('tool.regex.flag.i'), desc: t('tool.regex.flag.i_desc') },
    { value: 'm', label: t('tool.regex.flag.m'), desc: t('tool.regex.flag.m_desc') },
    { value: 'gm', label: t('tool.regex.flag.gm'), desc: t('tool.regex.flag.gm_desc') },
    { value: 'gi', label: t('tool.regex.flag.gi'), desc: t('tool.regex.flag.gi_desc') },
  ];

  const handleAddRegex = () => {
    if (regexes.length >= 6) {
      addToast('Maximum 6 regex patterns allowed.', 'info', 2000);
      return;
    }
    setRegexes((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        pattern: '',
        flags: 'gm',
        customFlag: '',
      },
    ]);
  };

  const handleRemoveRegex = (id: string) => {
    if (regexes.length <= 1) return;
    setRegexes((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRegex = (id: string, field: keyof RegexEntry, value: string) => {
    setRegexes((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const combinedRanges = useMemo(() => {
    const orderedRanges: HighlightRange[] = [];
    [...regexes].reverse().forEach((regex) => {
      const result = regexResults.find(r => r.id === regex.id);
      if (!result) return;
      const originalIndex = regexes.indexOf(regex);
      const color = COLORS[originalIndex % COLORS.length];

      result.ranges.forEach(r => {
        orderedRanges.push({
          start: r.start,
          end: r.end,
          colorBg: color.bg
        });
      });
    });
    return orderedRanges;
  }, [regexResults, regexes]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t('tool.regex.title')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">{t('tool.regex.desc')}</p>
        </div>
      </div>
      <Card className="!overflow-visible">
        <CardContent className="space-y-6 p-6">
          <div className="space-y-3">
            {regexes.map((r, index) => {
              const color = COLORS[index % COLORS.length];
              return (
                <div key={r.id} className="flex gap-2 items-start group">
                  <div className={`mt-3 w-3 h-3 rounded-full flex-shrink-0 ${color.dot}`} />
                  <TextArea
                    value={r.pattern}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateRegex(r.id, 'pattern', e.target.value)
                    }
                    placeholder={t('tool.regex.pattern')}
                    className={`flex-1 min-w-0 font-mono ${color.text} bg-slate-50 dark:bg-slate-900 !min-h-[40px] !h-[40px] border-slate-300 dark:border-slate-700 focus:ring-${color.name.toLowerCase()}-500`}
                  />
                  <CustomSelect
                    options={flagOptions}
                    value={r.flags}
                    onChange={(val) => updateRegex(r.id, 'flags', val)}
                    customValue={r.customFlag}
                    onCustomChange={(val) => updateRegex(r.id, 'customFlag', val)}
                    customLabel={t('tool.regex.flag.custom')}
                    customPlaceholder="gu"
                  />
                  {regexes.length > 1 && (
                    <Button
                      variant="ghost"
                      className="h-10 w-10 px-0 text-slate-400 hover:text-red-500"
                      onClick={() => handleRemoveRegex(r.id)}
                      title="Remove Regex"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              );
            })}
            {regexes.length < 6 && (
              <Button variant="secondary" onClick={handleAddRegex} className="w-full sm:w-auto">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {t('tool.regex.add_pattern')}
              </Button>
            )}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <Label>Test String</Label>

            <HighlightedTextArea
              value={text}
              onChange={setText}
              highlightRanges={combinedRanges}
              placeholder={t('tool.regex.test_placeholder')}
              className="h-32 mb-6"
            />

            <div className="bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 p-4 min-h-[150px]">
              <Label>{t('tool.regex.matches')}</Label>
              <div className="space-y-4 mt-2">
                {regexResults.every((res) => !res.matches.length && !res.error) && (
                  <span className="text-slate-500 italic text-sm">
                    {t('tool.regex.no_matches')}
                  </span>
                )}
                {regexResults.map((res) => {
                  const regexIndex = regexes.findIndex(r => r.id === res.id);
                  if (regexIndex === -1) return null;

                  const regex = regexes[regexIndex];
                  const color = COLORS[regexIndex % COLORS.length];

                  if (!res.matches.length && !res.error) return null;

                  return (
                    <div key={res.id} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                        <div className={`w-2 h-2 rounded-full ${color.dot}`} />
                        <span>/{regex?.pattern}/</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pl-4">
                        {res.error ? (
                          <span className="text-red-400 text-sm">{t('tool.regex.invalid')}</span>
                        ) : (
                          <>
                            {res.matches.slice(0, 100).map((m, i) => (
                              <span
                                key={i}
                                className={`px-2 py-1 ${color.bg} ${color.text} rounded text-sm font-mono border ${color.border}`}
                              >
                                {m}
                              </span>
                            ))}
                            {res.matches.length > 100 && (
                              <span className="text-xs text-slate-500 self-center">
                                And {res.matches.length - 100} more...
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 p-4 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
            <p className="font-semibold">{t('tool.regex.common_rules')}</p>
            <div className="grid grid-cols-2 gap-2">
              <span>
                <code>.</code> {t('tool.regex.rule.any_char')}
              </span>
              <span>
                <code>\d</code> {t('tool.regex.rule.digit')}
              </span>
              <span>
                <code>\w</code> {t('tool.regex.rule.word_char')}
              </span>
              <span>
                <code>\s</code> {t('tool.regex.rule.whitespace')}
              </span>
              <span>
                <code>*</code> {t('tool.regex.rule.zero_or_more')}
              </span>
              <span>
                <code>+</code> {t('tool.regex.rule.one_or_more')}
              </span>
              <span>
                <code>?</code> {t('tool.regex.rule.zero_or_one')}
              </span>
              <span>
                <code>^</code> {t('tool.regex.rule.start_str')}
              </span>
              <span>
                <code>$</code> {t('tool.regex.rule.end_str')}
              </span>
              <span>
                <code>[abc]</code> {t('tool.regex.rule.any_of')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
