import React, { useState } from 'react';
import { Card, CardContent, Button, Input, Label, CopyButton } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { SEO } from '../ui/SEO';

export const PasswordTools: React.FC = () => {
  const [passLength, setPassLength] = useState<number>(16);
  const [passCount, setPassCount] = useState<number>(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const { t } = useAppContext();

  const generatePasswords = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const res = [];
    for (let i = 0; i < passCount; i++) {
      let pass = '';
      for (let j = 0; j < passLength; j++)
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
      res.push(pass);
    }
    setPasswords(res);
  };

  return (
    <div className="space-y-6">
      <SEO pageId="pass" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.pass.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.pass.desc')}</p>
      </div>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="w-32">
              <Label>{t('tool.pass.length')}</Label>
              <Input
                type="number"
                value={passLength}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassLength(Math.max(1, parseInt(e.target.value) || 1))
                }
                min={4}
                max={128}
                className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <div className="w-32">
              <Label>{t('tool.pass.count')}</Label>
              <Input
                type="number"
                value={passCount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassCount(Math.max(1, parseInt(e.target.value) || 1))
                }
                min={1}
                max={50}
                className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>
            <Button onClick={generatePasswords}>{t('tool.pass.generate')}</Button>
          </div>
          <div className="grid gap-2">
            {passwords.map((p, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-slate-100 dark:bg-slate-950 p-2 px-4 rounded border border-slate-200 dark:border-slate-800 group"
              >
                <span className="font-mono text-emerald-600 dark:text-emerald-400 break-all">
                  {p}
                </span>
                <div className="opacity-0 group-hover:opacity-100">
                  <CopyButton text={p} />
                </div>
              </div>
            ))}
            {passwords.length === 0 && (
              <div className="text-slate-500 text-center py-4">{t('tool.pass.click_generate')}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
