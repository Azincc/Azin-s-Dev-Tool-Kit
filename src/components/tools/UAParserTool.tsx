import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Label, TextArea } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { SEO } from '../ui/SEO';
import { UAParser } from 'ua-parser-js';

// Define a type that matches the structure we use from UAParser result
interface UAResult {
  browser: { name?: string; version?: string; major?: string };
  os: { name?: string; version?: string };
  device: { vendor?: string; model?: string; type?: string };
  engine: { name?: string; version?: string };
  cpu: { architecture?: string };
}

export const UAParserTool: React.FC = () => {
  const { t } = useAppContext();
  const [uaString, setUaString] = useState<string>('');
  const [result, setResult] = useState<UAResult | null>(null);
  const parserRef = React.useRef(new UAParser());

  const parse = () => {
    parserRef.current.setUA(uaString);
    setResult(parserRef.current.getResult() as UAResult);
  };

  useEffect(() => {
    // Auto parse if not empty
    if (uaString) parse();
  }, [uaString]);

  const useCurrent = () => {
    setUaString(navigator.userAgent);
  };

  // Initialize with current user agent on mount
  useEffect(() => {
    setUaString(navigator.userAgent);
  }, []);

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <SEO pageId="ua" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.ua.title')}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.ua.desc')}</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label>{t('tool.ua.input')}</Label>
              <TextArea
                value={uaString}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setUaString(e.target.value)
                }
                placeholder="Mozilla/5.0..."
                className="font-mono text-sm h-24"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={useCurrent} variant="secondary" size="sm">
              {t('tool.ua.current')}
            </Button>
          </div>

          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">
                  {t('tool.ua.browser')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Name:</span>{' '}
                    <span className="font-mono">{result.browser.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Version:</span>{' '}
                    <span className="font-mono">{result.browser.version || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Major:</span>{' '}
                    <span className="font-mono">{result.browser.major || '-'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold mb-3 text-purple-600 dark:text-purple-400">
                  {t('tool.ua.os')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Name:</span>{' '}
                    <span className="font-mono">{result.os.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Version:</span>{' '}
                    <span className="font-mono">{result.os.version || '-'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">
                  {t('tool.ua.device')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Vendor:</span>{' '}
                    <span className="font-mono">{result.device.vendor || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Model:</span>{' '}
                    <span className="font-mono">{result.device.model || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Type:</span>{' '}
                    <span className="font-mono">{result.device.type || 'Desktop/Unknown'}</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold mb-3 text-rose-600 dark:text-rose-400">
                  {t('tool.ua.engine')} / {t('tool.ua.cpu')}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Engine:</span>{' '}
                    <span className="font-mono">{result.engine.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Eng. Ver:</span>{' '}
                    <span className="font-mono">{result.engine.version || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CPU:</span>{' '}
                    <span className="font-mono">{result.cpu.architecture || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
