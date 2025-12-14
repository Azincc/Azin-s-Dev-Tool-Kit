import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Button, Label } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';

interface TimeData {
  ts: number;
}

export const WorldClockTools: React.FC = () => {
  // Offset between Server Time and Local System Time (Server - Local)
  const [timeOffset, setTimeOffset] = useState<number | null>(null);
  const [uncertainty, setUncertainty] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { t, language } = useAppContext();
  const [now, setNow] = useState<number>(Date.now());

  const fetchTime = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch('https://time.tool.azin.cc/');
      const json: TimeData = await res.json();
      const end = Date.now();

      if (json.ts) {
        const serverTs = json.ts;
        const rtt = end - start;
        const offset = serverTs + rtt / 2 - end;
        setTimeOffset(offset);
        setUncertainty(Math.ceil(rtt / 2));
      }
    } catch (e) {
      console.error('Failed to fetch time', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTime();

    // Refresh API every minute (60000ms)
    const fetchInterval = setInterval(fetchTime, 60000);

    // Update local display every second
    const tickInterval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(tickInterval);
    };
  }, []);

  // Time Zones
  const zones = [
    { labelKey: 'tool.worldclock.city.beijing', zone: 'Asia/Shanghai' },
    { labelKey: 'tool.worldclock.city.utc', zone: 'UTC' },
    { labelKey: 'tool.worldclock.city.new_york', zone: 'America/New_York' },
    { labelKey: 'tool.worldclock.city.london', zone: 'Europe/London' },
    { labelKey: 'tool.worldclock.city.paris', zone: 'Europe/Paris' },
    {
      labelKey: 'tool.worldclock.city.los_angeles',
      zone: 'America/Los_Angeles',
    },
    { labelKey: 'tool.worldclock.city.tokyo', zone: 'Asia/Tokyo' },
    { labelKey: 'tool.worldclock.city.singapore', zone: 'Asia/Singapore' },
    { labelKey: 'tool.worldclock.city.sydney', zone: 'Australia/Sydney' },
  ];

  const formatTime = (timestamp: number, zone: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: zone,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date(timestamp));
  };

  // If we have an offset, Server Time = Now + Offset
  const currentServerTime = timeOffset !== null ? now + timeOffset : null;

  const getOffsetStatus = (offsetMs: number) => {
    const absOffset = Math.abs(offsetMs);
    if (absOffset < 50) return { color: 'text-green-600', message: '' };
    if (absOffset < 30000) return { color: 'text-green-500', message: '' };
    if (absOffset < 300000)
      return {
        color: 'text-yellow-500',
        message: t('tool.worldclock.warn_totp'),
      };
    if (absOffset < 3600000)
      return {
        color: 'text-orange-500',
        message: t('tool.worldclock.warn_jwt'),
      };
    return { color: 'text-red-600', message: t('tool.worldclock.err_date') };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.worldclock.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.worldclock.desc')}</p>
      </div>

      <Card>
        <CardHeader
          title={t('tool.worldclock.calibration')}
          action={
            <Button onClick={fetchTime} disabled={loading}>
              {loading ? t('tool.worldclock.syncing') : t('tool.worldclock.sync')}
            </Button>
          }
        />
        <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2">
            <Label className="text-lg">{t('tool.worldclock.server')}</Label>
            <div className="text-xl sm:text-2xl md:text-3xl font-mono text-emerald-600 dark:text-emerald-400 break-all">
              {currentServerTime ? formatTime(currentServerTime, 'Asia/Shanghai') : '--'}
              <span className="text-sm text-slate-500 ml-2">(Beijing)</span>
            </div>
            <div className="text-xs text-slate-400">
              {t('tool.worldclock.source')}: time.azin.workers.dev
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-lg">{t('tool.worldclock.local')}</Label>
            <div className="text-xl sm:text-2xl md:text-3xl font-mono text-blue-600 dark:text-blue-400 break-all">
              {formatTime(now, 'Asia/Shanghai')}
              <span className="text-sm text-slate-500 ml-2">(Beijing)</span>
            </div>
            {timeOffset !== null && (
              <div className={`text-sm ${getOffsetStatus(timeOffset).color}`}>
                {(() => {
                  const absMs = Math.abs(timeOffset);

                  const days = Math.floor(absMs / 86400000);
                  const hours = Math.floor((absMs % 86400000) / 3600000);
                  const minutes = Math.floor((absMs % 3600000) / 60000);
                  const seconds = Math.floor((absMs % 60000) / 1000);
                  const ms = Math.floor(absMs % 1000);

                  const direction =
                    timeOffset < 0 ? t('tool.worldclock.slow') : t('tool.worldclock.fast');

                  let timeStr = '';
                  if (days > 0) timeStr += `${days}${t('tool.worldclock.day')}`;
                  if (hours > 0) timeStr += `${hours}${t('tool.worldclock.hour')}`;
                  if (minutes > 0) timeStr += `${minutes}${t('tool.worldclock.minute')}`;
                  if (seconds > 0) timeStr += `${seconds}${t('tool.worldclock.second')}`;
                  timeStr += `${ms}${t('tool.worldclock.millisecond')}`;

                  let result = '';
                  if (language === 'zh') {
                    result = `${t('tool.worldclock.diff_prefix')}${direction}${timeStr}`;
                  } else {
                    result = `${t('tool.worldclock.diff_prefix')}${timeStr} ${direction}${t(
                      'tool.worldclock.diff_suffix'
                    )}`;
                  }

                  // Add uncertainty
                  if (uncertainty !== null) {
                    result += ` (±${uncertainty}ms)`;
                  }

                  if (absMs < 50) {
                    return `${t('tool.worldclock.accurate')} ${result}`;
                  }
                  return result;
                })()}
                {getOffsetStatus(timeOffset).message && (
                  <div className="mt-1 font-semibold">{getOffsetStatus(timeOffset).message}</div>
                )}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
              <h4 className="font-semibold mb-1">{t('tool.worldclock.algorithm')}</h4>
              <p>{t('tool.worldclock.algo_desc')}</p>
              <code className="block mt-1 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded w-fit">
                {t('tool.worldclock.algo_formula')}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((z) => (
          <Card key={z.labelKey} className="flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 font-semibold">
              {t(z.labelKey)}
            </div>
            <div className="p-6 text-2xl font-mono text-center text-slate-800 dark:text-white">
              {currentServerTime
                ? formatTime(currentServerTime, z.zone).split(', ')[1]
                : formatTime(now, z.zone).split(', ')[1]}
              <div className="text-xs text-slate-400 mt-2">
                {currentServerTime
                  ? formatTime(currentServerTime, z.zone).split(', ')[0]
                  : formatTime(now, z.zone).split(', ')[0]}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
