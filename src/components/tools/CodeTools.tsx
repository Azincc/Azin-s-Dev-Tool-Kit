import React, { useState, useEffect } from 'react';
import { Card, CardHeader, TextArea, CopyButton, Select } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';

export const CodeTools: React.FC = () => {
  const [codeInput, setCodeInput] = useState<string>('');
  const [codeLang, setCodeLang] = useState<string>('html');
  const [codeOutput, setCodeOutput] = useState<string>('');
  const { t } = useAppContext();

  useEffect(() => {
    if (!codeInput) {
      setCodeOutput('');
      return;
    }
    if (codeLang === 'html') {
      setCodeOutput(
        codeInput
          .replace(/>\s*</g, '>\n<')
          .replace(/(<[a-zA-Z0-9]+[^>]*>)/g, '$1\n')
          .replace(/(<\/[a-zA-Z0-9]+>)/g, '\n$1')
      );
    } else if (codeLang === 'sql') {
      setCodeOutput(
        codeInput.replace(
          /\b(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY|INSERT|UPDATE|DELETE)\b/gi,
          '\n$1'
        )
      );
    } else if (codeLang === 'css') {
      setCodeOutput(
        codeInput.replace(/;/g, ';\n  ').replace(/{/g, ' {\n  ').replace(/}/g, '\n}\n')
      );
    } else {
      setCodeOutput(codeInput);
    }
  }, [codeInput, codeLang]);

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.code.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.code.desc')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <Card className="flex flex-col h-full">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 dark:text-white">{t('tool.code.input')}</h3>
            <div className="w-32">
              <Select value={codeLang} onChange={(e) => setCodeLang(e.target.value)}>
                <option value="html">HTML</option>
                <option value="sql">SQL</option>
                <option value="css">CSS</option>
              </Select>
            </div>
          </div>
          <TextArea
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            className="flex-1 w-full border-0 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-4 resize-none font-mono text-sm"
            placeholder={t('tool.code.paste')}
            spellCheck={false}
          />
        </Card>
        <Card className="flex flex-col h-full border-blue-900/30">
          <CardHeader title={t('tool.code.output')} action={<CopyButton text={codeOutput} />} />
          <TextArea
            readOnly
            value={codeOutput}
            className="flex-1 w-full border-0 bg-slate-100 dark:bg-slate-950 p-4 resize-none font-mono text-blue-600 dark:text-blue-300 text-sm"
          />
        </Card>
      </div>
    </div>
  );
};
