import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Input, CopyButton, Slider, Label, TextArea } from '../components/ui/Shared';
import { useAppContext } from '../contexts/AppContext';

export const ColorPaletteTools: React.FC = () => {
  const [hex, setHex] = useState('#3b82f6');
  const { t } = useAppContext();
  return (
    <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.color.title')}</h2><p className="text-slate-500 dark:text-slate-400">{t('tool.color.desc')}</p></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1"><CardHeader title={t('tool.color.picker')} /><CardContent className="flex flex-col items-center py-8 gap-4"><input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-24 h-24 rounded-full cursor-pointer overflow-hidden border-0 p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:border-0" /><Input value={hex} onChange={e => setHex(e.target.value)} className="text-center font-mono bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" /></CardContent></Card>
            <Card className="col-span-2"><CardHeader title={t('tool.color.shades')} /><div className="flex h-32 w-full px-6 pb-6">{[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w, i) => (<div key={w} className="flex-1 flex items-end p-2 text-xs" style={{ backgroundColor: hex, filter: `brightness(${1.5 - (i * 0.1)})` }}><span className={i > 4 ? 'text-white' : 'text-black'}>{w}</span></div>))}</div></Card>
        </div>
    </div>
  );
};

export const ImageTools: React.FC = () => {
  const [imgBase64, setImgBase64] = useState('');
  const [qrText, setQrText] = useState(window.location.href);
  const { t } = useAppContext();

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
        <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.image.title')}</h2><p className="text-slate-500 dark:text-slate-400">{t('tool.image.desc')}</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader title={t('tool.image.base64_title')} /><CardContent className="space-y-4"><input type="file" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-200 dark:file:bg-slate-700 file:text-slate-700 dark:file:text-white" />{imgBase64 && (<div className="space-y-2"><div className="h-32 w-full bg-slate-100 dark:bg-slate-900 rounded flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700"><img src={imgBase64} alt="Preview" className="max-h-full max-w-full" /></div><div className="relative"><Input readOnly value={imgBase64.substring(0, 50) + "..."} className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white" /><div className="absolute top-1 right-1"><CopyButton text={imgBase64} /></div></div></div>)}</CardContent></Card>
            <Card><CardHeader title={t('tool.image.qr_title')} /><CardContent className="space-y-4"><Input value={qrText} onChange={e => setQrText(e.target.value)} placeholder={t('tool.image.qr_placeholder')} className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white w-full" /><div className="flex justify-center bg-white p-4 rounded-lg w-fit mx-auto border border-slate-200 dark:border-none"><img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrText)}`} alt="QR" className="w-32 h-32" /></div></CardContent></Card>
        </div>
    </div>
  );
};

export const CssGenTools: React.FC = () => {
  const [boxShadow, setBoxShadow] = useState({ x: 5, y: 5, blur: 10, spread: 0, color: '#000000' });
  const [borderRadius, setBorderRadius] = useState(8);
  const shadowStyle = `${boxShadow.x}px ${boxShadow.y}px ${boxShadow.blur}px ${boxShadow.spread}px ${boxShadow.color}40`;
  const { t } = useAppContext();

  return (
    <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.css.title')}</h2><p className="text-slate-500 dark:text-slate-400">{t('tool.css.desc')}</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card><CardHeader title={t('tool.css.controls')} /><CardContent className="space-y-6"><div className="space-y-4"><Label>{t('tool.css.border_radius')}: {borderRadius}px</Label><Slider value={borderRadius} min={0} max={50} onChange={(e) => setBorderRadius(Number(e.target.value))} /></div><div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700"><Label>{t('tool.css.box_shadow')}</Label><div className="grid grid-cols-2 gap-4"><div><Label>X</Label><Slider min={-50} max={50} value={boxShadow.x} onChange={e => setBoxShadow({...boxShadow, x: Number(e.target.value)})} /></div><div><Label>Y</Label><Slider min={-50} max={50} value={boxShadow.y} onChange={e => setBoxShadow({...boxShadow, y: Number(e.target.value)})} /></div><div><Label>{t('tool.css.blur')}</Label><Slider min={0} max={100} value={boxShadow.blur} onChange={e => setBoxShadow({...boxShadow, blur: Number(e.target.value)})} /></div><div><Label>{t('tool.css.spread')}</Label><Slider min={-20} max={50} value={boxShadow.spread} onChange={e => setBoxShadow({...boxShadow, spread: Number(e.target.value)})} /></div></div></div></CardContent></Card>
            <div className="space-y-6"><div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center"><div className="w-32 h-32 bg-blue-500 transition-all duration-200" style={{ borderRadius: `${borderRadius}px`, boxShadow: shadowStyle }}></div></div><div className="relative"><Label>{t('tool.css.output')}</Label><TextArea readOnly value={`border-radius: ${borderRadius}px;\nbox-shadow: ${shadowStyle};`} className="bg-slate-50 dark:bg-slate-950 text-purple-600 dark:text-purple-400 h-24" /><div className="absolute top-8 right-2"><CopyButton text={`border-radius: ${borderRadius}px;\nbox-shadow: ${shadowStyle};`} /></div></div></div>
        </div>
    </div>
  );
};
