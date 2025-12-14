import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Label, Slider, TextArea, CopyButton } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';

export const CssGenTools: React.FC = () => {
  const [boxShadow, setBoxShadow] = useState({
    x: 5,
    y: 5,
    blur: 10,
    spread: 0,
    color: '#000000',
  });
  const [borderRadius, setBorderRadius] = useState<number>(8);
  const shadowStyle = `${boxShadow.x}px ${boxShadow.y}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color}40`;
  const { t } = useAppContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.css.title')}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.css.desc')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader title={t('tool.css.controls')} />
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>
                {t('tool.css.border_radius')}: {borderRadius}px
              </Label>
              <Slider
                value={borderRadius}
                min={0}
                max={50}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBorderRadius(Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Label>{t('tool.css.box_shadow')}</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>X</Label>
                  <Slider
                    min={-50}
                    max={50}
                    value={boxShadow.x}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBoxShadow({ ...boxShadow, x: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Y</Label>
                  <Slider
                    min={-50}
                    max={50}
                    value={boxShadow.y}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBoxShadow({ ...boxShadow, y: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>{t('tool.css.blur')}</Label>
                  <Slider
                    min={0}
                    max={100}
                    value={boxShadow.blur}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBoxShadow({
                        ...boxShadow,
                        blur: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>{t('tool.css.spread')}</Label>
                  <Slider
                    min={-20}
                    max={50}
                    value={boxShadow.spread}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setBoxShadow({
                        ...boxShadow,
                        spread: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <div
              className="w-32 h-32 bg-blue-500 transition-all duration-200"
              style={{
                borderRadius: `${borderRadius}px`,
                boxShadow: shadowStyle,
              }}
            ></div>
          </div>
          <div className="relative">
            <Label>{t('tool.css.output')}</Label>
            <TextArea
              readOnly
              value={`border-radius: ${borderRadius}px;\nbox-shadow: ${shadowStyle};`}
              className="bg-slate-50 dark:bg-slate-950 text-purple-600 dark:text-purple-400 h-24"
            />
            <div className="absolute top-8 right-2">
              <CopyButton text={`border-radius: ${borderRadius}px;\nbox-shadow: ${shadowStyle};`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
