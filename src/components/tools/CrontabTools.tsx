import React, { useState, useEffect } from 'react';
import { Card, CardContent, Label, Select } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { SEO } from '../ui/SEO';

// Helper for simple template interpolation
const formatString = (template: string, params: Record<string, string | number>) => {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return typeof params[key] !== 'undefined' ? String(params[key]) : match;
  });
};

const explainCron = (cron: string, t: (key: string) => string): string => {
  const fields = cron.trim().split(/\s+/);
  if (fields.length !== 5) return t('tool.crontab.explain.error');

  const [min, hour, day, month, week] = fields;

  let minStr = '';
  let hourStr = '';
  let dayStr = '';
  let monthStr = '';
  let weekStr = '';

  // 1. Calculate Min/Hour strings
  if (min === '*' && hour === '*') {
    minStr = t('tool.crontab.explain.special_every_minute');
  } else if (min === '0' && hour === '*') {
    minStr = t('tool.crontab.explain.special_hourly');
  } else {
    // Minute
    if (min !== '*') {
      if (min.includes('/')) {
        minStr = formatString(t('tool.crontab.explain.min_every_x'), {
          val: min.substring(2),
        });
      } else {
        minStr = formatString(t('tool.crontab.explain.min_at'), { val: min });
      }
    } else {
      // If min is *, but hour is not * (and not covered by special cases)
      // En: "Run every minute past hour X"
      // Zh: "X点 每分钟"
      // We can rely on default empty minStr? No.
      // If min is '*', it usually means "every minute" of that hour.
      minStr = t('tool.crontab.explain.min_every');
    }

    // Hour
    if (hour !== '*') {
      if (hour.includes('/')) {
        hourStr = formatString(t('tool.crontab.explain.hour_every_x'), {
          val: hour.substring(2),
        });
      } else {
        hourStr = formatString(t('tool.crontab.explain.hour_at'), {
          val: hour,
        });
      }
    } else {
      // if hour is * and min is specific? "At minute 5". (Every hour is implied).
      if (min === '*') hourStr = t('tool.crontab.explain.hour_every');
      // If min is specific (5 * * * *), "At minute 5". Hour part is empty?
      // "At minute 5 past every hour"?
      // En: "at minute 5". Zh: "每小时 5分"?
      // Let's look at existing logic:
      // Zh: hour='*' -> empty string.
      // En: hour='*' -> empty string.
      // So we keep it empty.
    }
  }

  // 2. Day/Month/Week
  if (day !== '*') {
    dayStr = formatString(t('tool.crontab.explain.day_val'), { val: day });
  }

  if (month !== '*') {
    monthStr = formatString(t('tool.crontab.explain.month_val'), {
      val: month,
    });
  }

  if (week !== '*') {
    weekStr = formatString(t('tool.crontab.explain.week_val'), { val: week });
  }

  return formatString(t('tool.crontab.explain.template'), {
    min: minStr,
    hour: hourStr,
    day: dayStr,
    month: monthStr,
    week: weekStr,
  })
    .replace(/\s+/g, ' ')
    .trim();
};

// ... CronBuilder component ...
const CronBuilder = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const { t } = useAppContext();
  const fields = value.split(' ');
  const safeFields = fields.length === 5 ? fields : ['*', '*', '*', '*', '*'];

  const [min, hour, day, month, week] = safeFields;

  const updateField = (index: number, val: string) => {
    const newFields = [...safeFields];
    newFields[index] = val;
    onChange(newFields.join(' '));
  };

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      <div className="space-y-1">
        <Label>{t('tool.crontab.minute')}</Label>
        <Select
          value={min}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField(0, e.target.value)}
        >
          <option value="*">{t('tool.crontab.everyMin')}</option>
          <option value="*/5">{t('tool.crontab.every5Min')}</option>
          <option value="*/15">{t('tool.crontab.every15Min')}</option>
          <option value="0">{t('tool.crontab.at0')}</option>
          <option value="30">{t('tool.crontab.at30')}</option>
          {range(0, 59).map((i) => (
            <option key={i} value={i.toString()}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t('tool.crontab.hour')}</Label>
        <Select
          value={hour}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField(1, e.target.value)}
        >
          <option value="*">{t('tool.crontab.everyHour')}</option>
          <option value="*/2">{t('tool.crontab.every2Hours')}</option>
          <option value="0">{t('tool.crontab.midnight')}</option>
          <option value="12">{t('tool.crontab.noon')}</option>
          {range(0, 23).map((i) => (
            <option key={i} value={i.toString()}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t('tool.crontab.day')}</Label>
        <Select
          value={day}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField(2, e.target.value)}
        >
          <option value="*">{t('tool.crontab.everyDay')}</option>
          {range(1, 31).map((i) => (
            <option key={i} value={i.toString()}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t('tool.crontab.month')}</Label>
        <Select
          value={month}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField(3, e.target.value)}
        >
          <option value="*">{t('tool.crontab.everyMonth')}</option>
          {range(1, 12).map((i) => (
            <option key={i} value={i.toString()}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t('tool.crontab.week')}</Label>
        <Select
          value={week}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateField(4, e.target.value)}
        >
          <option value="*">{t('tool.crontab.everyDay')}</option>
          <option value="0">{t('tool.crontab.sun')}</option>
          <option value="1">{t('tool.crontab.mon')}</option>
          <option value="2">{t('tool.crontab.tue')}</option>
          <option value="3">{t('tool.crontab.wed')}</option>
          <option value="4">{t('tool.crontab.thu')}</option>
          <option value="5">{t('tool.crontab.fri')}</option>
          <option value="6">{t('tool.crontab.sat')}</option>
        </Select>
      </div>
    </div>
  );
};

export const CrontabTools: React.FC = () => {
  const [cron, setCron] = useState<string>('* * * * *');
  const [explanation, setExplanation] = useState<string>('');
  const { t } = useAppContext();

  useEffect(() => {
    setExplanation(explainCron(cron, t));
  }, [cron, t]);

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <SEO pageId="crontab" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.crontab.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.crontab.desc')}</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>{t('tool.crontab.builder')}</Label>
            <CronBuilder value={cron} onChange={setCron} />

            <Label className="mt-4 block">{t('tool.crontab.manual')}</Label>
            <div className="flex gap-4">
              <input
                type="text"
                value={cron}
                onChange={(e) => setCron(e.target.value)}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-4 py-2 text-slate-900 dark:text-white font-mono"
                placeholder="* * * * *"
              />
            </div>
            <div className="text-xs text-slate-500">{t('tool.crontab.format')}</div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md">
            <span className="font-semibold">{t('tool.crontab.meaning')} </span>
            {explanation}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
