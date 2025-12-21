import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, TextArea, Button, Label } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { SEO } from '../ui/SEO';

export const EditorTools: React.FC = () => {
  const [text, setText] = useState<string>('');
  const { t } = useAppContext();
  const stats = useMemo(
    () => ({
      chars: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text.split(/\r\n|\r|\n/).length,
    }),
    [text]
  );

  const handleDedupe = () => setText([...new Set(text.split('\n'))].join('\n'));
  const handleLorem = () =>
    setText(
      (prev) =>
        prev +
        (prev ? '\n' : '') +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    );

  return (
    <div className="space-y-6">
      <SEO pageId="editor" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.editor.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.editor.desc')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader title={t('tool.editor.editor')} />
            <TextArea
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
              className="flex-1 min-h-[400px] border-0 p-4 resize-none bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder={t('tool.editor.placeholder')}
            />
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title={t('tool.editor.stats')} />
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.chars}
                </div>
                <div className="text-xs text-slate-500 uppercase">{t('tool.editor.chars')}</div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.words}
                </div>
                <div className="text-xs text-slate-500 uppercase">{t('tool.editor.words')}</div>
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-center col-span-2">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.lines}
                </div>
                <div className="text-xs text-slate-500 uppercase">{t('tool.editor.lines')}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title={t('tool.editor.actions')} />
            <CardContent className="flex flex-col gap-2">
              <Button variant="secondary" onClick={handleLorem}>
                {t('tool.editor.lorem')}
              </Button>
              <Button variant="secondary" onClick={handleDedupe}>
                {t('tool.editor.dedupe')}
              </Button>
              <Button variant="secondary" onClick={() => setText(text.toUpperCase())}>
                {t('tool.editor.uppercase')}
              </Button>
              <Button variant="danger" onClick={() => setText('')}>
                {t('tool.editor.clear')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
