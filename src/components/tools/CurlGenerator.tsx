import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Button,
  Label,
  Input,
  Select,
  TextArea,
  CopyButton,
} from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { SEO } from '../ui/SEO';

interface HeaderItem {
  id: number;
  key: string;
  value: string;
}

export const CurlGenerator: React.FC = () => {
  const { t } = useAppContext();
  const [url, setUrl] = useState<string>('https://api.example.com/data');
  const [method, setMethod] = useState<string>('GET');
  const [headers, setHeaders] = useState<HeaderItem[]>([
    { id: 1, key: 'Content-Type', value: 'application/json' },
    { id: 2, key: 'Authorization', value: 'Bearer token123' },
  ]);
  const [body, setBody] = useState<string>('{\n  "key": "value"\n}');
  const [generated, setGenerated] = useState<string>('');

  const addHeader = () => {
    setHeaders([...headers, { id: Date.now(), key: '', value: '' }]);
  };

  const updateHeader = (id: number, field: 'key' | 'value', val: string) => {
    setHeaders(headers.map((h) => (h.id === id ? { ...h, [field]: val } : h)));
  };

  const removeHeader = (id: number) => {
    setHeaders(headers.filter((h) => h.id !== id));
  };

  useEffect(() => {
    let cmd = `curl -X ${method} '${url}'`;

    headers.forEach((h) => {
      if (h.key) cmd += ` \\\n  -H '${h.key}: ${h.value}'`;
    });

    if (method !== 'GET' && method !== 'HEAD' && body) {
      // Simple check to avoid newlines breaking shell too easily, but ideally should escape quotes
      const safeBody = body.replace(/'/g, "'\\''");
      cmd += ` \\\n  -d '${safeBody}'`;
    }

    setGenerated(cmd);
  }, [url, method, headers, body]);

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <SEO pageId="curl" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.curl.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.curl.desc')}</p>
      </div>

      <div className="flex flex-col gap-6 flex-1 min-h-0">
        <Card className="flex-[3] flex flex-col min-h-0 overflow-auto">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <Label>{t('tool.curl.url')}</Label>
              <div className="flex gap-2">
                <Select
                  value={method}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMethod(e.target.value)}
                  className="w-32"
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                  <option>PATCH</option>
                </Select>
                <Input
                  value={url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>{t('tool.curl.headers')}</Label>
                <Button onClick={addHeader} variant="secondary" size="sm">
                  {t('tool.curl.add_header')}
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {headers.map((h) => (
                  <div key={h.id} className="flex gap-2">
                    <Input
                      value={h.key}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateHeader(h.id, 'key', e.target.value)
                      }
                      placeholder="Key"
                      className="flex-1 focus:relative focus:z-10"
                    />
                    <Input
                      value={h.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateHeader(h.id, 'value', e.target.value)
                      }
                      placeholder="Value"
                      className="flex-1 focus:relative focus:z-10"
                    />
                    <Button onClick={() => removeHeader(h.id)} variant="danger" className="px-2">
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {method !== 'GET' && (
              <div className="space-y-1 flex-1">
                <Label>{t('tool.curl.body')}</Label>
                <TextArea
                  value={body}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value)}
                  className="font-mono text-sm h-32"
                  placeholder="{}"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col min-h-0">
          <CardContent className="p-6 h-full flex flex-col">
            <Label className="mb-2 block">{t('tool.curl.output')}</Label>
            <div className="relative flex-1 bg-slate-100 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-800 dark:text-green-400 overflow-auto group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={generated} />
              </div>
              <pre className="whitespace-pre-wrap break-all">{generated}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
