import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Input, Label, CopyButton } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';

export const HashTools: React.FC = () => {
  const [hashInput, setHashInput] = useState<string>('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const { t } = useAppContext();

  const calculateHashes = async (text: string) => {
    setHashInput(text);
    if (!text) {
      setHashes({});
      return;
    }
    const encode = (str: string) => new TextEncoder().encode(str);
    const toHex = (buf: ArrayBuffer) =>
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    const sha1 = await crypto.subtle.digest('SHA-1', encode(text));
    const sha256 = await crypto.subtle.digest('SHA-256', encode(text));
    const sha512 = await crypto.subtle.digest('SHA-512', encode(text));
    setHashes({
      sha1: toHex(sha1),
      sha256: toHex(sha256),
      sha512: toHex(sha512),
    });
  };

  const handleFileHash = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    const toHex = (buf: ArrayBuffer) =>
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    const sha256 = await crypto.subtle.digest('SHA-256', buffer);
    setHashInput(`File: ${file.name}`);
    setHashes({
      sha256: toHex(sha256),
      sha1: t('tool.hash.skipped'),
      sha512: t('tool.hash.skipped'),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.hash.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.hash.desc')}</p>
      </div>
      <Card>
        <CardHeader title={t('tool.hash.input_source')} />
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('tool.hash.text')}</Label>
              <Input
                value={hashInput.startsWith('File:') ? '' : hashInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  calculateHashes(e.target.value)
                }
                placeholder={t('tool.hash.type_placeholder')}
                className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('tool.hash.or_file')}</Label>
              <input
                type="file"
                onChange={handleFileHash}
                className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
          </div>
          <div className="space-y-4">
            {['sha1', 'sha256', 'sha512'].map((algo) => (
              <div key={algo}>
                <div className="flex justify-between mb-1">
                  <Label className="text-blue-600 dark:text-blue-400">{algo.toUpperCase()}</Label>
                  <CopyButton text={hashes[algo] || ''} />
                </div>
                <div className="bg-slate-100 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-600 dark:text-slate-300 break-all">
                  {hashes[algo] || t('tool.hash.waiting')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
