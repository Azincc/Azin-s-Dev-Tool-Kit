import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardContent, Button, Input, Select, Label, TextArea } from '../ui/Shared';
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
    const { t } = useAppContext();

    // Global unit setting
    const [globalUnit, setGlobalUnit] = useState<TimeUnit>('s');

    // Current timestamp
    const [isPaused, setIsPaused] = useState(false);
    const [nowMs, setNowMs] = useState<number>(Date.now());

    // Ts -> Date (single)
    const [tsInput, setTsInput] = useState<string>('');
    const [tsAutoDetect, setTsAutoDetect] = useState(true);
    const [tsInputUnit, setTsInputUnit] = useState<TimeUnit>('s');

    // Batch Ts -> Date
    const [batchInput, setBatchInput] = useState<string>('');
    const [batchOutput, setBatchOutput] = useState<string>('');

    // Date -> Ts
    const [dateInput, setDateInput] = useState<string>('');

    // Time Difference Calculator
    const [diffTime1, setDiffTime1] = useState<string>('');
    const [diffTime2, setDiffTime2] = useState<string>('');
    const [diffResult, setDiffResult] = useState<string>('');

    // Update current time
    useEffect(() => {
        const timer = setInterval(() => {
            if (!isPaused) {
                setNowMs(Date.now());
            }
        }, globalUnit === 's' ? 1000 : 100);
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

        const detectedLabel = tsAutoDetect ? ` (${t('tool.timestamp.detected')}: ${UNIT_LABELS[unit]})` : '';
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

        setDiffResult(`${readable}\n${details}`);
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
                        className="w-24"
                    >
                        <option value="s">Sec</option>
                        <option value="ms">Ms</option>
                        <option value="us">μs</option>
                        <option value="ns">ns</option>
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
                            <Button onClick={() => setIsPaused(!isPaused)} variant={isPaused ? 'primary' : 'outline'}>
                                {isPaused ? t('tool.timestamp.resume') : t('tool.timestamp.pause')}
                            </Button>
                            <Button onClick={() => copyToClipboard(currentTs.toString())} variant="outline" icon={<CopyIcon />}>
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
                                    className="w-24"
                                >
                                    <option value="s">Sec</option>
                                    <option value="ms">Ms</option>
                                    <option value="us">μs</option>
                                    <option value="ns">ns</option>
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
                            <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_1fr] gap-2 items-center">
                                <input
                                    type="datetime-local"
                                    onChange={(e) => setDateInput(e.target.value)}
                                    className="flex h-10 w-full sm:w-auto rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-300 [color-scheme:light] dark:[color-scheme:dark]"
                                />
                                <span className="text-slate-400 text-center text-sm">{t('tool.timestamp.or')}</span>
                                <Input
                                    value={dateInput}
                                    onChange={(e) => setDateInput(e.target.value)}
                                    placeholder="YYYY-MM-DD HH:mm:ss"
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-2">
                                {t('tool.timestamp.date_formats_hint')}
                            </p>
                        </div>
                        <div>
                            <Label>{t('tool.timestamp.result')} ({UNIT_LABELS[globalUnit]})</Label>
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
                            <input
                                type="datetime-local"
                                onChange={(e) => setDiffTime1(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-300 [color-scheme:light] dark:[color-scheme:dark]"
                            />
                            <Input
                                value={diffTime1}
                                onChange={(e) => setDiffTime1(e.target.value)}
                                placeholder={t('tool.timestamp.diff_placeholder')}
                            />
                        </div>
                        <div className="space-y-3">
                            <Label>{t('tool.timestamp.diff_time2')}</Label>
                            <input
                                type="datetime-local"
                                onChange={(e) => setDiffTime2(e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors duration-300 [color-scheme:light] dark:[color-scheme:dark]"
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
