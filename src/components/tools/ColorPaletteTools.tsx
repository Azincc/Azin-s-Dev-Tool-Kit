import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Input } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';

export const ColorPaletteTools: React.FC = () => {
  const [hex, setHex] = useState<string>('#3b82f6');
  const { t } = useAppContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.color.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.color.desc')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader title={t('tool.color.picker')} />
          <CardContent className="flex flex-col items-center py-8 gap-4">
            <input
              type="color"
              value={hex}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHex(e.target.value)}
              className="w-24 h-24 rounded-full cursor-pointer overflow-hidden border-0 p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0"
            />
            <Input
              value={hex}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHex(e.target.value)}
              className="text-center font-mono bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <CardHeader title={t('tool.color.shades')} />
          <div className="flex h-32 w-full px-6 pb-6">
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w, i) => (
              <div
                key={w}
                className="flex-1 flex items-end p-2 text-xs"
                style={{
                  backgroundColor: hex,
                  filter: `brightness(${1.5 - i * 0.1})`,
                }}
              >
                <span className={i > 4 ? 'text-white' : 'text-black'}>{w}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
