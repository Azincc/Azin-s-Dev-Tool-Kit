import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Input,
  Select,
  Label,
  TextArea,
} from '../ui/Shared';
import { DateTimePicker } from '../ui/date-time-picker';
import { useAppContext } from '../../contexts/AppContext';
import { SEO } from '../ui/SEO';
import { CopyIcon } from '../ui/Icons';
import { toast } from '../ui/ToastWrapper';

type TimeUnit = 's' | 'ms' | 'us' | 'ns';

const UNIT_MULTIPLIERS: Record<TimeUnit, number> = {
  s: 1000,
  ms: 1,
  us: 0.001,
  ns: 0.000001,
};

const UNIT_LABELS: Record<TimeUnit, string> = {
  s: 'Sec',
  ms: 'Ms',
  us: 'μs',
  ns: 'ns',
};

// Default offset for Time Difference: 1y 2mo 3d 4h 5m 6s 7ms
const DEFAULT_DIFF_OFFSET_MS =
  365 * 24 * 60 * 60 * 1000 + // 1 year
  2 * 30 * 24 * 60 * 60 * 1000 + // 2 months (approx 30 days)
  3 * 24 * 60 * 60 * 1000 + // 3 days
  4 * 60 * 60 * 1000 + // 4 hours
  5 * 60 * 1000 + // 5 minutes
  6 * 1000 + // 6 seconds
  7; // 7 milliseconds

// Auto-detect timestamp unit based on digit count
const detectUnit = (ts: number): TimeUnit => {
  const len = ts.toString().length;
  if (len <= 10) return 's';
  if (len <= 13) return 'ms';
  if (len <= 16) return 'us';
  return 'ns';
};

// Convert any timestamp to milliseconds
const toMs = (ts: number, unit: TimeUnit): number => {
  return ts * UNIT_MULTIPLIERS[unit];
};

// Convert milliseconds to target unit
const fromMs = (ms: number, unit: TimeUnit): number => {
  return Math.floor(ms / UNIT_MULTIPLIERS[unit]);
};

// Format duration in human-readable form
const formatDuration = (diffMs: number, t: (key: string) => string): string => {
  const abs = Math.abs(diffMs);
  const sign = diffMs < 0 ? '-' : '';

  const days = Math.floor(abs / 86400000);
  const hours = Math.floor((abs % 86400000) / 3600000);
  const minutes = Math.floor((abs % 3600000) / 60000);
  const seconds = Math.floor((abs % 60000) / 1000);
  const ms = abs % 1000;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}${t('tool.timestamp.unit.day')}`);
  if (hours > 0) parts.push(`${hours}${t('tool.timestamp.unit.hour')}`);
  if (minutes > 0) parts.push(`${minutes}${t('tool.timestamp.unit.minute')}`);
  if (seconds > 0) parts.push(`${seconds}${t('tool.timestamp.unit.second')}`);
  if (ms > 0 || parts.length === 0) parts.push(`${ms}${t('tool.timestamp.unit.ms')}`);

  return sign + parts.join(' ');
};

export const TimestampTools: React.FC = () => {
  const { t, language } = useAppContext();

  // Global unit setting
  const [globalUnit, setGlobalUnit] = useState<TimeUnit>('s');

  // Static entry time (captured on mount, used for input defaults)
  const [entryTs] = useState<number>(() => Date.now());

  // Real-time current timestamp (for display)
  const [isPaused, setIsPaused] = useState(false);
  const [nowMs, setNowMs] = useState<number>(Date.now());

  // Ts -> Date (single) - default to entry timestamp
  const [tsInput, setTsInput] = useState<string>(entryTs.toString());
  const [tsAutoDetect, setTsAutoDetect] = useState(true);
  const [tsInputUnit, setTsInputUnit] = useState<TimeUnit>('s');

  // Batch Ts -> Date
  const [batchInput, setBatchInput] = useState<string>('');
  const [batchOutput, setBatchOutput] = useState<string>('');

  // Date -> Ts - default to entry date
  const [dateInput, setDateInput] = useState<string>(
    new Date(entryTs).toISOString().slice(0, 19).replace('T', ' ')
  );

  // Time Difference Calculator - defaults based on static entry time
  const [diffTime1, setDiffTime1] = useState<string>((entryTs - DEFAULT_DIFF_OFFSET_MS).toString());
  const [diffTime2, setDiffTime2] = useState<string>(entryTs.toString());
  const [diffResult, setDiffResult] = useState<string>('');

  // Memoized callbacks for DateTimePicker to prevent re-renders from timer updates
  const handleDateInputChange = useCallback((date: Date | undefined) => {
    setDateInput(date ? date.toISOString().slice(0, 19).replace('T', ' ') : '');
  }, []);

  const handleDiffTime1Change = useCallback((date: Date | undefined) => {
    setDiffTime1(date ? date.getTime().toString() : '');
  }, []);

  const handleDiffTime2Change = useCallback((date: Date | undefined) => {
    setDiffTime2(date ? date.getTime().toString() : '');
  }, []);

  // Memoized values for DateTimePicker
  const dateInputValue = useMemo(() => {
    return dateInput ? new Date(dateInput) : undefined;
  }, [dateInput]);

  const diffTime1Value = useMemo(() => {
    return diffTime1 && !isNaN(Number(diffTime1)) ? new Date(Number(diffTime1)) : undefined;
  }, [diffTime1]);

  const diffTime2Value = useMemo(() => {
    return diffTime2 && !isNaN(Number(diffTime2)) ? new Date(Number(diffTime2)) : undefined;
  }, [diffTime2]);

  // Memoized i18n strings for DateTimePicker
  const datePickerPlaceholder = useMemo(() => t('tool.timestamp.select_date_time'), [t]);
  const datePickerTimeLabel = useMemo(() => t('tool.timestamp.time'), [t]);

  // Update current time (real-time)
  useEffect(() => {
    const timer = setInterval(
      () => {
        if (!isPaused) {
          setNowMs(Date.now());
        }
      },
      globalUnit === 's' ? 1000 : 100
    );
    return () => clearInterval(timer);
  }, [isPaused, globalUnit]);

  // Current timestamp in selected unit
  const currentTs = useMemo(() => fromMs(nowMs, globalUnit), [nowMs, globalUnit]);

  // Ts -> Date conversion
  const tsResult = useMemo(() => {
    if (!tsInput) return '';
    const ts = parseInt(tsInput, 10);
    if (isNaN(ts)) return t('tool.timestamp.error.invalid_ts');

    const unit = tsAutoDetect ? detectUnit(ts) : tsInputUnit;
    const ms = toMs(ts, unit);
    const date = new Date(ms);

    if (isNaN(date.getTime())) return t('tool.timestamp.error.invalid_ts');

    const detectedLabel = tsAutoDetect
      ? ` (${t('tool.timestamp.detected')}: ${UNIT_LABELS[unit]})`
      : '';
    return date.toLocaleString() + detectedLabel;
  }, [tsInput, tsAutoDetect, tsInputUnit, t]);

  // Batch conversion
  useEffect(() => {
    if (!batchInput.trim()) {
      setBatchOutput('');
      return;
    }
    const lines = batchInput.split('\n');
    const results = lines.map((line) => {
      const ts = parseInt(line.trim(), 10);
      if (isNaN(ts)) return `${line} → ${t('tool.timestamp.error.invalid_ts')}`;
      const unit = detectUnit(ts);
      const ms = toMs(ts, unit);
      const date = new Date(ms);
      if (isNaN(date.getTime())) return `${line} → ${t('tool.timestamp.error.invalid_ts')}`;
      return `${line} → ${date.toLocaleString()} (${UNIT_LABELS[unit]})`;
    });
    setBatchOutput(results.join('\n'));
  }, [batchInput, t]);

  // Date -> Ts conversion
  const dateResult = useMemo(() => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return t('tool.timestamp.error.invalid_date');
    return fromMs(d.getTime(), globalUnit).toString();
  }, [dateInput, globalUnit]);

  // Time difference calculation
  useEffect(() => {
    if (!diffTime1 || !diffTime2) {
      setDiffResult('');
      return;
    }

    const parseTime = (input: string): number | null => {
      // Try parsing as timestamp first
      const ts = parseInt(input, 10);
      if (!isNaN(ts) && input.match(/^\d+$/)) {
        const unit = detectUnit(ts);
        return toMs(ts, unit);
      }
      // Try parsing as date string
      const d = new Date(input);
      if (!isNaN(d.getTime())) return d.getTime();
      return null;
    };

    const t1 = parseTime(diffTime1);
    const t2 = parseTime(diffTime2);

    if (t1 === null || t2 === null) {
      setDiffResult(t('tool.timestamp.error.invalid_input'));
      return;
    }

    const diffMs = t2 - t1;
    const readable = formatDuration(diffMs, t);

    // Natural language comparison
    let comparison: string;
    if (diffMs === 0) {
      comparison = t('tool.timestamp.diff_equal');
    } else if (diffMs > 0) {
      // t1 is earlier than t2
      comparison = t('tool.timestamp.diff_earlier').replace('{duration}', readable);
    } else {
      // t1 is later than t2
      comparison = t('tool.timestamp.diff_later').replace('{duration}', readable.replace('-', ''));
    }

    // Also show in multiple units
    const abs = Math.abs(diffMs);
    const sign = diffMs < 0 ? '-' : '+';
    const details = [
      `${sign}${abs}ms`,
      `${sign}${(abs / 1000).toFixed(2)}s`,
      `${sign}${(abs / 60000).toFixed(2)}min`,
      `${sign}${(abs / 3600000).toFixed(4)}h`,
      `${sign}${(abs / 86400000).toFixed(4)}d`,
    ].join(' | ');

    setDiffResult(`${comparison}\n${details}`);
  }, [diffTime1, diffTime2, t]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('common.copied') || 'Copied!');
  };

  return (
    <div className="space-y-6">
      <SEO pageId="timestamp" />

      {/* Header with global unit toggle */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {t('tool.timestamp.title')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">{t('tool.timestamp.desc')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Label className="mb-0 whitespace-nowrap">{t('tool.timestamp.global_unit')}:</Label>
          <Select
            value={globalUnit}
            onChange={(e) => setGlobalUnit(e.target.value as TimeUnit)}
            className="w-32"
          >
            <option value="s">{t('tool.timestamp.unit_label.sec')}</option>
            <option value="ms">{t('tool.timestamp.unit_label.ms')}</option>
            <option value="us">{t('tool.timestamp.unit_label.us')}</option>
            <option value="ns">{t('tool.timestamp.unit_label.ns')}</option>
          </Select>
        </div>
      </div>

      {/* Current Timestamp */}
      <Card>
        <CardHeader title={t('tool.timestamp.current')} />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-4xl md:text-6xl font-mono text-blue-600 dark:text-blue-400 font-bold">
                {currentTs}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {UNIT_LABELS[globalUnit]} • {new Date(nowMs).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsPaused(!isPaused)}
                variant={isPaused ? 'primary' : 'outline'}
              >
                {isPaused ? t('tool.timestamp.resume') : t('tool.timestamp.pause')}
              </Button>
              <Button
                onClick={() => copyToClipboard(currentTs.toString())}
                variant="outline"
                icon={<CopyIcon />}
              >
                {t('common.copy')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timestamp to Date */}
        <Card>
          <CardHeader title={t('tool.timestamp.ts_to_date')} />
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>{t('tool.timestamp.timestamp')}</Label>
              <Input
                value={tsInput}
                onChange={(e) => setTsInput(e.target.value)}
                placeholder={currentTs.toString()}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tsAutoDetect}
                  onChange={(e) => setTsAutoDetect(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {t('tool.timestamp.auto_detect')}
                </span>
              </label>
              {!tsAutoDetect && (
                <Select
                  value={tsInputUnit}
                  onChange={(e) => setTsInputUnit(e.target.value as TimeUnit)}
                  className="w-32"
                >
                  <option value="s">{t('tool.timestamp.unit_label.sec')}</option>
                  <option value="ms">{t('tool.timestamp.unit_label.ms')}</option>
                  <option value="us">{t('tool.timestamp.unit_label.us')}</option>
                  <option value="ns">{t('tool.timestamp.unit_label.ns')}</option>
                </Select>
              )}
            </div>
            <div>
              <Label>{t('tool.timestamp.result')}</Label>
              <div className="relative">
                <Input value={tsResult} readOnly className="pr-10" />
                {tsResult && !tsResult.includes('Invalid') && (
                  <button
                    onClick={() => copyToClipboard(tsResult.split(' (')[0])}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date to Timestamp */}
        <Card>
          <CardHeader title={t('tool.timestamp.date_to_ts')} />
          <CardContent className="p-6 space-y-4">
            <div>
              <Label>{t('tool.timestamp.date_time')}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                <DateTimePicker
                  value={dateInputValue}
                  onChange={handleDateInputChange}
                  placeholder={datePickerPlaceholder}
                  locale={language}
                  timeLabel={datePickerTimeLabel}
                />
                <Input
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  placeholder={t('tool.timestamp.date_format_placeholder')}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">{t('tool.timestamp.date_formats_hint')}</p>
            </div>
            <div>
              <Label>
                {t('tool.timestamp.result')} ({UNIT_LABELS[globalUnit]})
              </Label>
              <div className="relative">
                <Input value={dateResult} readOnly className="pr-10" />
                {dateResult && !dateResult.includes('Invalid') && (
                  <button
                    onClick={() => copyToClipboard(dateResult)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500"
                  >
                    <CopyIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Conversion */}
      <Card>
        <CardHeader title={t('tool.timestamp.batch_title')} />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>{t('tool.timestamp.batch_input')}</Label>
              <TextArea
                value={batchInput}
                onChange={(e) => setBatchInput(e.target.value)}
                placeholder={t('tool.timestamp.batch_placeholder')}
                className="h-40 font-mono"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label className="mb-0">{t('tool.timestamp.batch_output')}</Label>
                {batchOutput && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(batchOutput)}
                    icon={<CopyIcon />}
                  >
                    {t('common.copy')}
                  </Button>
                )}
              </div>
              <TextArea
                value={batchOutput}
                readOnly
                className="h-40 font-mono bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Difference Calculator */}
      <Card>
        <CardHeader title={t('tool.timestamp.diff_title')} />
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>{t('tool.timestamp.diff_time1')}</Label>
              <DateTimePicker
                value={diffTime1Value}
                onChange={handleDiffTime1Change}
                placeholder={datePickerPlaceholder}
                locale={language}
                timeLabel={datePickerTimeLabel}
              />
              <Input
                value={diffTime1}
                onChange={(e) => setDiffTime1(e.target.value)}
                placeholder={t('tool.timestamp.diff_placeholder')}
              />
            </div>
            <div className="space-y-3">
              <Label>{t('tool.timestamp.diff_time2')}</Label>
              <DateTimePicker
                value={diffTime2Value}
                onChange={handleDiffTime2Change}
                placeholder={datePickerPlaceholder}
                locale={language}
                timeLabel={datePickerTimeLabel}
              />
              <Input
                value={diffTime2}
                onChange={(e) => setDiffTime2(e.target.value)}
                placeholder={t('tool.timestamp.diff_placeholder')}
              />
            </div>
          </div>
          <div>
            <Label>{t('tool.timestamp.diff_result')}</Label>
            <TextArea
              value={diffResult}
              readOnly
              className="h-20 font-mono bg-slate-50 dark:bg-slate-900"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
