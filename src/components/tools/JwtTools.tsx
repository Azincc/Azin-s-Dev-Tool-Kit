import React, { useState } from 'react';
import { Card, CardContent, Label, TextArea } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';

export const JwtTools: React.FC = () => {
  const [jwtToken, setJwtToken] = useState<string>('');
  const [jwtDecoded, setJwtDecoded] = useState<{
    header: string;
    payload: string;
  } | null>(null);
  const { t } = useAppContext();

  const decodeJwt = (token: string) => {
    setJwtToken(token);
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error(t('tool.jwt.invalid'));
      const header = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
      const payload = JSON.stringify(JSON.parse(atob(parts[1])), null, 2);
      setJwtDecoded({ header, payload });
    } catch (e) {
      setJwtDecoded(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.jwt.title')}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.jwt.desc')}</p>
      </div>
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          <div className="space-y-2">
            <Label>{t('tool.jwt.encoded')}</Label>
            <TextArea
              value={jwtToken}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => decodeJwt(e.target.value)}
              className="h-64 text-xs bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-full"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-blue-600 dark:text-blue-400">{t('tool.jwt.header')}</Label>
              <pre className="bg-slate-100 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-300 h-24 overflow-auto w-full">
                {jwtDecoded?.header}
              </pre>
            </div>
            <div className="space-y-1">
              <Label className="text-purple-600 dark:text-purple-400">
                {t('tool.jwt.payload')}
              </Label>
              <pre className="bg-slate-100 dark:bg-slate-950 p-3 rounded border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-300 h-32 overflow-auto w-full">
                {jwtDecoded?.payload}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
