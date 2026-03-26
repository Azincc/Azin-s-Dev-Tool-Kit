import React, { useEffect, useState } from 'react';
import { Card, CardHeader, TextArea, CopyButton, Button } from '../ui/Shared';
import { TrashIcon } from '../ui/Icons';
import { useAppContext } from '../../contexts/AppContext';
import { SEO } from '../ui/SEO';

type JsonEscapeMode = 'escape' | 'unescape';

const ESCAPE_EXAMPLE = `{
  "toolkit": "Azin's Dev Toolkit",
  "message": "Line 1\\nLine 2",
  "path": "C:\\\\Users\\\\Azin_cc\\\\demo",
  "unicode": "你好"
}`;

const UNESCAPE_EXAMPLE = `"{\\n  \\"toolkit\\": \\"Azin's Dev Toolkit\\",\\n  \\"message\\": \\"Line 1\\\\nLine 2\\",\\n  \\"path\\": \\"C:\\\\\\\\Users\\\\\\\\Azin_cc\\\\\\\\demo\\",\\n  \\"unicode\\": \\"你好\\"\\n}"`;

const escapeJsonString = (value: string, wrapInQuotes: boolean) => {
  const escaped = JSON.stringify(value);
  return wrapInQuotes ? escaped : escaped.slice(1, -1);
};

export const JsonEscapeTools: React.FC = () => {
  const [mode, setMode] = useState<JsonEscapeMode>('escape');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [wrapInQuotes, setWrapInQuotes] = useState(true);
  const { t } = useAppContext();

  const unescapeJsonString = (value: string) => {
    if (!value) return '';

    const trimmed = value.trim();
    const content =
      trimmed.length >= 2 && trimmed.startsWith('"') && trimmed.endsWith('"')
        ? trimmed.slice(1, -1)
        : value;

    let result = '';

    for (let i = 0; i < content.length; i += 1) {
      const char = content[i];

      if (char !== '\\') {
        result += char;
        continue;
      }

      const next = content[i + 1];

      if (!next) {
        throw new Error(t('tool.jsonEscape.errorTrailingSlash'));
      }

      switch (next) {
        case '"':
        case '\\':
        case '/':
          result += next;
          i += 1;
          break;
        case 'b':
          result += '\b';
          i += 1;
          break;
        case 'f':
          result += '\f';
          i += 1;
          break;
        case 'n':
          result += '\n';
          i += 1;
          break;
        case 'r':
          result += '\r';
          i += 1;
          break;
        case 't':
          result += '\t';
          i += 1;
          break;
        case 'u': {
          const unicode = content.slice(i + 2, i + 6);
          if (!/^[0-9a-fA-F]{4}$/.test(unicode)) {
            throw new Error(t('tool.jsonEscape.errorUnicode'));
          }
          result += String.fromCharCode(Number.parseInt(unicode, 16));
          i += 5;
          break;
        }
        default:
          throw new Error(t('tool.jsonEscape.errorInvalid'));
      }
    }

    return result;
  };

  useEffect(() => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const result =
        mode === 'escape' ? escapeJsonString(input, wrapInQuotes) : unescapeJsonString(input);
      setOutput(result);
      setError(null);
    } catch (e) {
      setOutput('');
      setError((e as Error).message || t('tool.jsonEscape.errorInvalid'));
    }
  }, [input, mode, wrapInQuotes, t]);

  const placeholder =
    mode === 'escape'
      ? t('tool.jsonEscape.placeholderEscape')
      : t('tool.jsonEscape.placeholderUnescape');
  const hint =
    mode === 'escape' ? t('tool.jsonEscape.hintEscape') : t('tool.jsonEscape.hintUnescape');
  const handleLoadExample = () => {
    setInput(mode === 'escape' ? ESCAPE_EXAMPLE : UNESCAPE_EXAMPLE);
    setError(null);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <SEO pageId="jsonEscape" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.jsonEscape.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.jsonEscape.desc')}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
        {[
          { id: 'escape', label: t('tool.jsonEscape.escape') },
          { id: 'unescape', label: t('tool.jsonEscape.unescape') },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id as JsonEscapeMode)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === item.id
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {item.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleLoadExample}
            className="text-xs"
          >
            {t('tool.jsonEscape.example')}
          </Button>
          {mode === 'escape' && (
            <Button
              type="button"
              size="sm"
              variant={wrapInQuotes ? 'primary' : 'outline'}
              onClick={() => setWrapInQuotes((prev) => !prev)}
              className="text-xs"
            >
              {t('tool.jsonEscape.wrapQuotes')}
            </Button>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">{hint}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <Card className="flex flex-col h-full">
          <CardHeader
            title={t('tool.json.input')}
            action={
              input && (
                <button
                  onClick={() => {
                    setInput('');
                    setOutput('');
                    setError(null);
                  }}
                  className="text-slate-400 hover:text-red-400"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )
            }
          />
          <div className="flex-1 p-2 bg-slate-50 dark:bg-slate-900">
            <TextArea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full border-0 bg-transparent text-slate-900 dark:text-white resize-none p-2 font-mono text-sm"
              spellCheck={false}
            />
          </div>
        </Card>

        <Card className="flex flex-col h-full border-blue-900/30">
          <CardHeader
            title={error ? t('tool.json.error') : t('tool.json.output')}
            action={<CopyButton text={output} />}
          />
          <div className="flex-1 p-0 bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
            {error ? (
              <div className="p-4 text-red-500 dark:text-red-400 font-mono text-sm">{error}</div>
            ) : (
              <TextArea
                readOnly
                value={output}
                placeholder={t('tool.jsonEscape.resultPlaceholder')}
                className="w-full h-full border-0 bg-transparent resize-none p-4 font-mono text-emerald-600 dark:text-emerald-400 text-sm"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
