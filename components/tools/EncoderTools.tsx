import React, { useState, useEffect } from 'react';
import { Card, CardHeader, TextArea, CopyButton } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { TrashIcon } from '../ui/Icons';

export const EncoderTools: React.FC = () => {
  const [encodeInput, setEncodeInput] = useState<string>('');
  const [encodeMode, setEncodeMode] = useState<string>('base64_enc');
  const [encodeOutput, setEncodeOutput] = useState<string>('');
  const { t } = useAppContext();

  const stringToHex = (str: string) =>
    str
      .split('')
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join(' ');
  const hexToString = (str: string) =>
    str
      .replace(/\s/g, '')
      .match(/.{1,2}/g)
      ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
      .join('') || '';

  useEffect(() => {
    if (!encodeInput) {
      setEncodeOutput('');
      return;
    }
    try {
      let res = '';
      switch (encodeMode) {
        case 'base64_enc':
          res = btoa(encodeInput);
          break;
        case 'base64_dec':
          res = atob(encodeInput);
          break;
        case 'url_enc':
          res = encodeURIComponent(encodeInput);
          break;
        case 'url_dec':
          res = decodeURIComponent(encodeInput);
          break;
        case 'hex_bin':
          res = stringToHex(encodeInput);
          break;
        case 'bin_hex':
          res = hexToString(encodeInput);
          break;
      }
      setEncodeOutput(res);
    } catch (e) {
      setEncodeOutput('Conversion Error');
    }
  }, [encodeInput, encodeMode]);

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.encoder.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.encoder.desc')}</p>
      </div>

      <div className="flex flex-wrap gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
        {[
          { id: 'base64_enc', l: t('tool.encoder.base64_enc') },
          { id: 'base64_dec', l: t('tool.encoder.base64_dec') },
          { id: 'url_enc', l: t('tool.encoder.url_enc') },
          { id: 'url_dec', l: t('tool.encoder.url_dec') },
          { id: 'hex_bin', l: t('tool.encoder.hex_bin') },
          { id: 'bin_hex', l: t('tool.encoder.bin_hex') },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setEncodeMode(m.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              encodeMode === m.id
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {m.l}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <Card className="flex flex-col h-full">
          <CardHeader
            title={t('tool.encoder.input')}
            action={
              encodeInput && (
                <button
                  onClick={() => {
                    setEncodeInput('');
                    setEncodeOutput('');
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
              value={encodeInput}
              onChange={(e) => setEncodeInput(e.target.value)}
              className="w-full h-full border-0 bg-transparent text-slate-900 dark:text-white resize-none p-2 font-mono text-sm"
              placeholder={t('tool.encoder.type')}
            />
          </div>
        </Card>
        <Card className="flex flex-col h-full border-blue-900/30">
          <CardHeader
            title={t('tool.encoder.result')}
            action={<CopyButton text={encodeOutput} />}
          />
          <div className="flex-1 p-0 bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
            <TextArea
              readOnly
              value={encodeOutput}
              className="w-full h-full border-0 bg-transparent resize-none p-4 font-mono text-emerald-600 dark:text-emerald-400 text-sm"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
