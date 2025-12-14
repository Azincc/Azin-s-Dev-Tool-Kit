import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Input,
  Button,
  TextArea,
  Label,
  CopyButton,
} from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';

export const EncryptTools: React.FC = () => {
  const [aesInput, setAesInput] = useState<string>('');
  const [aesKey, setAesKey] = useState<string>('secret-key');
  const [aesOutput, setAesOutput] = useState<string>('');
  const { t } = useAppContext();

  const simpleEncrypt = () => {
    let res = '';
    for (let i = 0; i < aesInput.length; i++) {
      res += String.fromCharCode(aesInput.charCodeAt(i) ^ aesKey.charCodeAt(i % aesKey.length));
    }
    setAesOutput(btoa(res));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.encrypt.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.encrypt.desc')}</p>
      </div>
      <Card>
        <CardHeader title={t('tool.encrypt.demo_title')} />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('tool.encrypt.message')}</Label>
              <TextArea
                value={aesInput}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setAesInput(e.target.value)
                }
                className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('tool.encrypt.secret_key')}</Label>
              <Input
                value={aesKey}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAesKey(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-full"
              />
              <Button onClick={simpleEncrypt} className="w-full mt-2">
                {t('tool.encrypt.action')}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t('tool.encrypt.result')}</Label>
            <div className="relative">
              <TextArea
                readOnly
                value={aesOutput}
                className="bg-slate-100 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 w-full"
              />
              <div className="absolute top-2 right-2">
                <CopyButton text={aesOutput} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
