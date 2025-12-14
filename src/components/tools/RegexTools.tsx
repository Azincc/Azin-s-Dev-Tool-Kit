import React, { useState, useMemo } from 'react';
import { Card, CardContent, TextArea, Label } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { CustomSelect } from '../CustomSelect';

export const RegexTools: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [regexPattern, setRegexPattern] = useState<string>('');
  const [regexFlags, setRegexFlags] = useState<string>('gm');
  const [customFlag, setCustomFlag] = useState<string>('');
  const { t } = useAppContext();

  const flagOptions = [
    {
      value: 'g',
      label: t('tool.regex.flag.g'),
      desc: t('tool.regex.flag.g_desc'),
    },
    {
      value: 'i',
      label: t('tool.regex.flag.i'),
      desc: t('tool.regex.flag.i_desc'),
    },
    {
      value: 'm',
      label: t('tool.regex.flag.m'),
      desc: t('tool.regex.flag.m_desc'),
    },
    {
      value: 'gm',
      label: t('tool.regex.flag.gm'),
      desc: t('tool.regex.flag.gm_desc'),
    },
    {
      value: 'gi',
      label: t('tool.regex.flag.gi'),
      desc: t('tool.regex.flag.gi_desc'),
    },
  ];

  const actualFlags = regexFlags === 'custom' ? customFlag : regexFlags;

  const regexMatches = useMemo(() => {
    if (!regexPattern) return [];
    try {
      return text.match(new RegExp(regexPattern, actualFlags)) || [];
    } catch {
      return null;
    }
  }, [text, regexPattern, actualFlags]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.regex.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.regex.desc')}</p>
      </div>
      <Card className="!overflow-visible">
        <CardContent className="space-y-4 p-6">
          <div className="flex gap-2 items-start">
            <TextArea
              value={regexPattern}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setRegexPattern(e.target.value)
              }
              placeholder={t('tool.regex.pattern') + ' (e.g. \\d+)'}
              className="flex-1 min-w-0 font-mono text-emerald-600 dark:text-emerald-400 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white !min-h-[40px] !h-[40px]"
            />
            <CustomSelect
              options={flagOptions}
              value={regexFlags}
              onChange={setRegexFlags}
              customValue={customFlag}
              onCustomChange={setCustomFlag}
              customLabel={t('tool.regex.flag.custom')}
              customPlaceholder="gu"
            />
          </div>
          <TextArea
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
            placeholder={t('tool.regex.test_placeholder')}
            className="h-32 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
          <div className="bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-700 p-4 min-h-[150px]">
            <Label>
              {t('tool.regex.matches')} ({regexMatches?.length || 0})
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {regexMatches === null ? (
                <span className="text-red-400">{t('tool.regex.invalid')}</span>
              ) : regexMatches.length === 0 ? (
                <span className="text-slate-500 italic">{t('tool.regex.no_matches')}</span>
              ) : (
                regexMatches.map((m, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 rounded text-sm font-mono border border-blue-200 dark:border-blue-800"
                  >
                    {m}
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 p-4 bg-slate-50 dark:bg-slate-900 rounded border border-slate-100 dark:border-slate-800">
            <p className="font-semibold">{t('tool.regex.common_rules')}</p>
            <div className="grid grid-cols-2 gap-2">
              <span>
                <code>.</code> {t('tool.regex.rule.any_char')}
              </span>
              <span>
                <code>\d</code> {t('tool.regex.rule.digit')}
              </span>
              <span>
                <code>\w</code> {t('tool.regex.rule.word_char')}
              </span>
              <span>
                <code>\s</code> {t('tool.regex.rule.whitespace')}
              </span>
              <span>
                <code>*</code> {t('tool.regex.rule.zero_or_more')}
              </span>
              <span>
                <code>+</code> {t('tool.regex.rule.one_or_more')}
              </span>
              <span>
                <code>?</code> {t('tool.regex.rule.zero_or_one')}
              </span>
              <span>
                <code>^</code> {t('tool.regex.rule.start_str')}
              </span>
              <span>
                <code>$</code> {t('tool.regex.rule.end_str')}
              </span>
              <span>
                <code>[abc]</code> {t('tool.regex.rule.any_of')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
