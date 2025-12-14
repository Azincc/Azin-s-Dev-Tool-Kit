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
  const [inputVal, setInputVal] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [outputVal, setOutputVal] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const { t } = useAppContext();

  // Helper to derive a key from password using PBKDF2
  const getDerivedKey = async (pass: string) => {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(pass),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    // Use a fixed salt for simplicity in this dev tool,
    // but in production, salt should be random and stored with the ciphertext.
    const salt = enc.encode('azin-dev-toolkit-salt');
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  };

  const handleEncrypt = async () => {
    if (!password) {
      setOutputVal('Error: Password required');
      setIsError(true);
      return;
    }
    try {
      setIsError(false);
      const key = await getDerivedKey(password);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const enc = new TextEncoder();
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(inputVal)
      );

      // Pack IV + Ciphertext
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      // Convert to Base64
      // Using a safer method for large buffers than String.fromCharCode(...spread)
      let binary = '';
      for (let i = 0; i < combined.byteLength; i++) {
        binary += String.fromCharCode(combined[i]);
      }
      setOutputVal(btoa(binary));
    } catch (e: any) {
      setIsError(true);
      setOutputVal('Encryption failed: ' + e.message);
    }
  };

  const handleDecrypt = async () => {
    if (!password) {
      setOutputVal('Error: Password required');
      setIsError(true);
      return;
    }
    try {
      setIsError(false);
      // Decode Base64
      const binary = atob(inputVal.trim());
      const combined = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        combined[i] = binary.charCodeAt(i);
      }

      if (combined.length < 13) throw new Error('Invalid ciphertext format');

      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
      const key = await getDerivedKey(password);

      const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);

      const dec = new TextDecoder();
      setOutputVal(dec.decode(decrypted));
    } catch (e: any) {
      setIsError(true);
      setOutputVal('Decryption failed. Wrong password or invalid data.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.encrypt.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.encrypt.subtitle')}</p>
      </div>

      <Card>
        <CardHeader title={t('tool.encrypt.card_title')} />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('tool.encrypt.input_label')}</Label>
                <TextArea
                  value={inputVal}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setInputVal(e.target.value)
                  }
                  placeholder={t('tool.encrypt.input_placeholder')}
                  className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-full h-32"
                />
              </div>

              <div className="space-y-2">
                <Label>{t('tool.encrypt.secret_key')}</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  placeholder={t('tool.encrypt.password_placeholder')}
                  className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleEncrypt} className="w-full bg-blue-600 hover:bg-blue-700">
                  {t('tool.encrypt.btn_encrypt')}
                </Button>
                <Button
                  onClick={handleDecrypt}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {t('tool.encrypt.btn_decrypt')}
                </Button>
              </div>
            </div>

            {/* Output Column */}
            <div className="space-y-2">
              <Label>{t('tool.encrypt.result')}</Label>
              <div className="relative h-full">
                <TextArea
                  readOnly
                  value={outputVal}
                  className={`w-full h-[calc(100%-2rem)] md:h-64 resize-none ${
                    isError
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200'
                  }`}
                  placeholder={t('tool.encrypt.result_placeholder')}
                />
                <div className="absolute top-2 right-2">
                  <CopyButton text={outputVal} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-slate-500 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-md border border-yellow-200 dark:border-yellow-800/30">
        <strong>{t('tool.encrypt.security_note_title')}</strong>{' '}
        {t('tool.encrypt.security_note_desc')}
      </div>
    </div>
  );
};
