import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, Input, CopyButton } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import QRCode from 'qrcode';

export const ImageTools: React.FC = () => {
  const [imgBase64, setImgBase64] = useState<string>('');
  const [qrText, setQrText] = useState<string>(window.location.href);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const { t } = useAppContext();

  useEffect(() => {
    generateQR();
  }, [qrText]);

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(qrText || ' ', {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImgBase64(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.image.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.image.desc')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title={t('tool.image.base64_title')} />
          <CardContent className="space-y-4">
            <input
              type="file"
              onChange={handleImageUpload}
              className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-200 dark:file:bg-slate-700 file:text-slate-700 dark:file:text-white"
            />
            {imgBase64 && (
              <div className="space-y-2">
                <div className="h-32 w-full bg-slate-100 dark:bg-slate-900 rounded flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={imgBase64} alt="Preview" className="max-h-full max-w-full" />
                </div>
                <div className="relative">
                  <Input
                    readOnly
                    value={imgBase64.substring(0, 50) + '...'}
                    className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <div className="absolute top-1 right-1">
                    <CopyButton text={imgBase64} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader title={t('tool.image.qr_title')} />
          <CardContent className="space-y-4">
            <Input
              value={qrText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQrText(e.target.value)}
              placeholder={t('tool.image.qr_placeholder')}
              className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-full"
            />
            <div className="flex justify-center bg-white p-4 rounded-lg w-fit mx-auto border border-slate-200 dark:border-none">
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR"
                  className="w-32 h-32"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
