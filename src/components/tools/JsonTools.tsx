import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  TextArea,
  CopyButton,
  Select,
  Label,
} from '../ui/Shared';
import { TrashIcon, TableIcon } from '../ui/Icons';
import { useAppContext } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../ui/SEO';
import { convert, detectFormat, FormatType, jsonToTypeScript, jsonToGo, jsonToJava, jsonToXml, jsonToCsv } from '../../utils/converters';
import { useDebounce } from '../../hooks/useDebounce';

const DEFAULT_JSON = `{
  "toolkit": "Azin's Dev Toolkit",
  "description": "A powerful collection of developer tools",
  "features": ["JSON Formatter", "Hash Calculator", "Encryption Tools", "Regex Tester", "World Clock"],
  "version": "0.0.5",
  "author": "Azin",
  "url": "https://tool.azin.cc"
}`;

export const JsonTools: React.FC = () => {
  const [input, setInput] = useState<string>(DEFAULT_JSON);
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<string>('format');
  const [sourceFormat, setSourceFormat] = useState<FormatType>('json');
  const [targetFormat, setTargetFormat] = useState<FormatType>('json');
  const [error, setError] = useState<string | null>(null);
  const { t } = useAppContext();
  const navigate = useNavigate();
  const debouncedInput = useDebounce(input, 300);

  const handleAutoDetect = () => {
    if (!input.trim()) return;
    const detected = detectFormat(input);
    if (detected) {
      setSourceFormat(detected);
    }
  };

  useEffect(() => {
    if (!debouncedInput.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const parsed = JSON.parse(debouncedInput);
      setError(null);
      switch (mode) {
        case 'format':
          setOutput(JSON.stringify(parsed, null, 2));
          break;
        case 'minify':
          setOutput(JSON.stringify(parsed));
          break;
        case 'toTS':
          setOutput(jsonToTypeScript(parsed));
          break;
        case 'toGo':
          setOutput(jsonToGo(parsed));
          break;
        case 'toJava':
          setOutput(jsonToJava(parsed));
          break;
        case 'toXML':
          setOutput(jsonToXml(parsed));
          break;
        case 'toCSV':
          setOutput(jsonToCsv(parsed));
          break;
        default:
          setOutput(JSON.stringify(parsed, null, 2));
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }, [debouncedInput, mode]);

  const handleDownloadCsv = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'converted.csv';
    link.click();
  };

  const handleOpenInCsvTool = () => {
    if (!input) return;
    try {
      const parsed = JSON.parse(input);
      const data = Array.isArray(parsed) ? parsed : [parsed];
      navigate('/csv', { state: { data } });
    } catch (e) {
      // ignore
    }
  };

  const handleConvert = () => {
    if (!input.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const result = convert(input, sourceFormat, targetFormat, { indent: 2 });
      setOutput(result);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  useEffect(() => {
    if (
      mode === 'format' ||
      mode === 'minify' ||
      mode === 'toTS' ||
      mode === 'toGo' ||
      mode === 'toJava' ||
      mode === 'toXML' ||
      mode === 'toCSV'
    ) {
      return;
    }
    handleConvert();
  }, [sourceFormat, targetFormat]);

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <SEO pageId="json" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.json.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.json.desc')}</p>
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
        {[
          { id: 'format', l: t('tool.json.prettify') },
          { id: 'minify', l: t('tool.json.minify') },
          { id: 'toTS', l: t('tool.json.toTS') },
          { id: 'toGo', l: t('tool.json.toGo') },
          { id: 'toJava', l: t('tool.json.toJava') },
          { id: 'toXML', l: t('tool.json.toXML') },
          { id: 'toCSV', l: t('tool.json.toCSV') },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              mode === m.id
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {m.l}
          </button>
        ))}
      </div>

      {mode === 'format' ||
      mode === 'minify' ||
      mode === 'toTS' ||
      mode === 'toGo' ||
      mode === 'toJava' ||
      mode === 'toXML' ||
      mode === 'toCSV' ? (
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
                placeholder='{"name": "Azin"}'
                className="w-full h-full border-0 bg-transparent text-slate-900 dark:text-white resize-none p-2 font-mono text-sm"
                spellCheck={false}
              />
            </div>
          </Card>
          <Card className="flex flex-col h-full border-blue-900/30">
            <CardHeader
              title={error ? t('tool.json.error') : t('tool.json.output')}
              action={
                <div className="flex items-center gap-2">
                  {mode === 'toCSV' && !error && output && (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleOpenInCsvTool}
                        className="text-xs"
                        title={t('tool.json.openCsv')}
                      >
                        <TableIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleDownloadCsv}
                        className="text-xs"
                      >
                        {t('tool.csv.download')}
                      </Button>
                    </>
                  )}
                  <CopyButton text={output} />
                </div>
              }
            />
            <div className="flex-1 p-0 bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
              {error ? (
                <div className="p-4 text-red-500 dark:text-red-400 font-mono text-sm">{error}</div>
              ) : (
                <TextArea
                  readOnly
                  value={output}
                  className="w-full h-full border-0 bg-transparent resize-none p-4 font-mono text-emerald-600 dark:text-emerald-400 text-sm"
                />
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4 flex-1 flex flex-col min-h-0">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Label className="block mb-2 text-sm font-medium">
                {t('tool.json.sourceFormat')}
              </Label>
              <Select
                value={sourceFormat}
                onChange={(e) => setSourceFormat(e.target.value as FormatType)}
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="xml">XML</option>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <Label className="block mb-2 text-sm font-medium">
                {t('tool.json.targetFormat')}
              </Label>
              <Select
                value={targetFormat}
                onChange={(e) => setTargetFormat(e.target.value as FormatType)}
              >
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
                <option value="xml">XML</option>
              </Select>
            </div>
            <Button onClick={handleAutoDetect} variant="secondary" className="text-xs">
              {t('tool.json.autoDetect')}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
            <Card className="flex flex-col h-full">
              <CardHeader
                title={`${t('tool.json.input')} (${sourceFormat.toUpperCase()})`}
                action={
                  input && (
                    <button
                      onClick={() => {
                        setInput('');
                        setOutput('');
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
                  placeholder={
                    sourceFormat === 'json'
                      ? '{"key": "value"}'
                      : sourceFormat === 'yaml'
                        ? 'key: value'
                        : '<root><key>value</key></root>'
                  }
                  className="w-full h-full border-0 bg-transparent text-slate-900 dark:text-white resize-none p-2 font-mono text-sm"
                  spellCheck={false}
                />
              </div>
            </Card>
            <Card className="flex flex-col h-full border-blue-900/30">
              <CardHeader
                title={
                  error
                    ? t('tool.json.error')
                    : `${t('tool.json.output')} (${targetFormat.toUpperCase()})`
                }
                action={<CopyButton text={output} />}
              />
              <div className="flex-1 p-0 bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
                {error ? (
                  <div className="p-4 text-red-500 dark:text-red-400 font-mono text-sm">
                    {error}
                  </div>
                ) : (
                  <TextArea
                    readOnly
                    value={output}
                    className="w-full h-full border-0 bg-transparent resize-none p-4 font-mono text-emerald-600 dark:text-emerald-400 text-sm"
                  />
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
