import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Input, Button, CopyButton, TextArea, Label } from '../components/ui/Shared';
import { useAppContext } from '../contexts/AppContext';

export const HashTools: React.FC = () => {
  const [hashInput, setHashInput] = useState('');
  const [hashes, setHashes] = useState<any>({});
  const { t } = useAppContext();

  const calculateHashes = async (text: string) => {
    setHashInput(text);
    if (!text) { setHashes({}); return; }
    const encode = (str: string) => new TextEncoder().encode(str);
    const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    const sha1 = await crypto.subtle.digest('SHA-1', encode(text));
    const sha256 = await crypto.subtle.digest('SHA-256', encode(text));
    const sha512 = await crypto.subtle.digest('SHA-512', encode(text));
    setHashes({ sha1: toHex(sha1), sha256: toHex(sha256), sha512: toHex(sha512) });
  };

  const handleFileHash = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const buffer = await file.arrayBuffer();
      const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      const sha256 = await crypto.subtle.digest('SHA-256', buffer);
      setHashInput(`File: ${file.name}`);
      setHashes({ sha256: toHex(sha256), sha1: t('tool.hash.skipped'), sha512: t('tool.hash.skipped') });
  };

  return (
    <div className="space-y-6">
      <div><h2 className="text-2xl font-bold text-text-primary">{t('tool.hash.title')}</h2><p className="text-text-secondary">{t('tool.hash.desc')}</p></div>
      <Card>
          <CardHeader title={t('tool.hash.input_source')} />
          <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label>{t('tool.hash.text')}</Label>
                      <Input value={hashInput.startsWith("File:") ? "" : hashInput} onChange={(e) => calculateHashes(e.target.value)} placeholder={t('tool.hash.type_placeholder')} className="w-full" />
                  </div>
                  <div className="space-y-2">
                      <Label>{t('tool.hash.or_file')}</Label>
                      <input type="file" onChange={handleFileHash} className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-text-inverse hover:file:bg-brand-hover" />
                  </div>
              </div>
              <div className="space-y-4">
                  {['sha1', 'sha256', 'sha512'].map(algo => (
                      <div key={algo}>
                          <div className="flex justify-between mb-1"><Label className="text-brand-primary">{algo.toUpperCase()}</Label><CopyButton text={hashes[algo]} /></div>
                          <div className="bg-background-secondary p-3 rounded border border-border font-mono text-xs text-text-secondary break-all">{hashes[algo] || t('tool.hash.waiting')}</div>
                      </div>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  );
};

export const EncryptTools: React.FC = () => {
  const [aesInput, setAesInput] = useState('');
  const [aesKey, setAesKey] = useState('secret-key');
  const [aesOutput, setAesOutput] = useState('');
  const { t } = useAppContext();
  
  const simpleEncrypt = () => {
      let res = '';
      for(let i=0; i<aesInput.length; i++) { res += String.fromCharCode(aesInput.charCodeAt(i) ^ aesKey.charCodeAt(i % aesKey.length)); }
      setAesOutput(btoa(res));
  };

  return (
    <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-text-primary">{t('tool.encrypt.title')}</h2><p className="text-text-secondary">{t('tool.encrypt.desc')}</p></div>
        <Card>
            <CardHeader title={t('tool.encrypt.demo_title')} />
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>{t('tool.encrypt.message')}</Label><TextArea value={aesInput} onChange={e => setAesInput(e.target.value)} className="w-full" /></div>
                    <div className="space-y-2"><Label>{t('tool.encrypt.secret_key')}</Label><Input value={aesKey} onChange={e => setAesKey(e.target.value)} className="w-full" /><Button onClick={simpleEncrypt} className="w-full mt-2">{t('tool.encrypt.action')}</Button></div>
                </div>
                <div className="space-y-2"><Label>{t('tool.encrypt.result')}</Label><div className="relative"><TextArea readOnly value={aesOutput} className="bg-background-secondary text-emerald-600 dark:text-emerald-400 w-full" /><div className="absolute top-2 right-2"><CopyButton text={aesOutput} /></div></div></div>
            </CardContent>
        </Card>
    </div>
  );
};

export const JwtTools: React.FC = () => {
  const [jwtToken, setJwtToken] = useState('');
  const [jwtDecoded, setJwtDecoded] = useState<{header:string, payload:string} | null>(null);
  const { t } = useAppContext();

  const decodeJwt = (token: string) => {
      setJwtToken(token);
      try {
          const parts = token.split('.');
          if (parts.length !== 3) throw new Error(t('tool.jwt.invalid'));
          const header = JSON.stringify(JSON.parse(atob(parts[0])), null, 2);
          const payload = JSON.stringify(JSON.parse(atob(parts[1])), null, 2);
          setJwtDecoded({ header, payload });
      } catch (e) { setJwtDecoded(null); }
  };

  return (
    <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-text-primary">{t('tool.jwt.title')}</h2><p className="text-text-secondary">{t('tool.jwt.desc')}</p></div>
        <Card>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="space-y-2"><Label>{t('tool.jwt.encoded')}</Label><TextArea value={jwtToken} onChange={e => decodeJwt(e.target.value)} className="h-64 text-xs w-full" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." /></div>
                <div className="space-y-4">
                    <div className="space-y-1"><Label className="text-brand-primary">{t('tool.jwt.header')}</Label><pre className="bg-background-secondary p-3 rounded border border-border text-xs text-text-secondary h-24 overflow-auto w-full">{jwtDecoded?.header}</pre></div>
                    <div className="space-y-1"><Label className="text-purple-600 dark:text-purple-400">{t('tool.jwt.payload')}</Label><pre className="bg-background-secondary p-3 rounded border border-border text-xs text-text-secondary h-32 overflow-auto w-full">{jwtDecoded?.payload}</pre></div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
};

export const PasswordTools: React.FC = () => {
  const [passLength, setPassLength] = useState(16);
  const [passCount, setPassCount] = useState(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const { t } = useAppContext();

  const generatePasswords = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
      const res = [];
      for(let i=0; i<passCount; i++) {
          let pass = "";
          for(let j=0; j<passLength; j++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
          res.push(pass);
      }
      setPasswords(res);
  };

  return (
    <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-text-primary">{t('tool.pass.title')}</h2><p className="text-text-secondary">{t('tool.pass.desc')}</p></div>
        <Card>
            <CardContent className="space-y-4 pt-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="w-32"><Label>{t('tool.pass.length')}</Label><Input type="number" value={passLength} onChange={e => setPassLength(Math.max(1, parseInt(e.target.value) || 1))} min={4} max={128} className="text-text-primary" /></div>
                    <div className="w-32"><Label>{t('tool.pass.count')}</Label><Input type="number" value={passCount} onChange={e => setPassCount(Math.max(1, parseInt(e.target.value) || 1))} min={1} max={50} className="text-text-primary" /></div>
                    <Button onClick={generatePasswords}>{t('tool.pass.generate')}</Button>
                </div>
                <div className="grid gap-2">
                    {passwords.map((p, i) => (<div key={i} className="flex justify-between items-center bg-background-secondary p-2 px-4 rounded border border-border group"><span className="font-mono text-emerald-600 dark:text-emerald-400 break-all">{p}</span><div className="opacity-0 group-hover:opacity-100"><CopyButton text={p} /></div></div>))}
                    {passwords.length === 0 && <div className="text-text-secondary text-center py-4">{t('tool.pass.click_generate')}</div>}
                </div>
            </CardContent>
        </Card>
    </div>
  );
};
