import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Button, TextArea, CopyButton, Select, Label, Input } from '../components/ui/Shared';
import { useAppContext } from '../contexts/AppContext';

// --- Crontab Tools ---

const explainCron = (cron: string, lang: 'en' | 'zh'): string => {
    const fields = cron.trim().split(/\s+/);
    if (fields.length !== 5) return lang === 'zh' ? "格式错误：需要5个字段 (分 时 日 月 周)" : "Invalid format: 5 fields required (min hour day month week)";

    const [min, hour, day, month, week] = fields;
    
    let desc = "";
    
    if (lang === 'zh') {
        if (week !== '*') desc += `每周 ${week} `;
        if (month !== '*') desc += `${month}月 `;
        if (day !== '*') desc += `${day}日 `;
        if (hour !== '*') {
             if (hour.includes('/')) desc += `每隔 ${hour.substring(2)} 小时 `;
             else desc += `${hour}点 `;
        }
        if (min !== '*') {
             if (min.includes('/')) desc += `每隔 ${min.substring(2)} 分钟 `;
             else desc += `${min}分 `;
        }
        if (min === '*' && hour === '*') desc += "每分钟";
        else if (min === '0' && hour === '*') desc += "每小时整";
        
        desc += "执行";
    } else {
        desc += "Run ";
        if (min === '*' && hour === '*') desc += "every minute";
        else {
             if (min !== '*') desc += min.includes('/') ? `every ${min.substring(2)} minutes` : `at minute ${min}`;
             if (hour !== '*') desc += hour.includes('/') ? ` past every ${hour.substring(2)} hours` : ` past hour ${hour}`;
        }
        
        if (day !== '*') desc += ` on day ${day} of the month`;
        if (month !== '*') desc += ` in month ${month}`;
        if (week !== '*') desc += ` on day of week ${week}`;
    }

    return desc;
};

// Simple Cron Builder Component
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

    const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
             <div className="space-y-1">
                 <Label>{t('tool.crontab.minute')}</Label>
                 <Select value={min} onChange={(e) => updateField(0, e.target.value)}>
                     <option value="*">{t('tool.crontab.everyMin')}</option>
                     <option value="*/5">{t('tool.crontab.every5Min')}</option>
                     <option value="*/15">{t('tool.crontab.every15Min')}</option>
                     <option value="0">{t('tool.crontab.at0')}</option>
                     <option value="30">{t('tool.crontab.at30')}</option>
                     {range(0, 59).map(i => <option key={i} value={i.toString()}>{i}</option>)}
                 </Select>
             </div>
             <div className="space-y-1">
                 <Label>{t('tool.crontab.hour')}</Label>
                 <Select value={hour} onChange={(e) => updateField(1, e.target.value)}>
                     <option value="*">{t('tool.crontab.everyHour')}</option>
                     <option value="*/2">{t('tool.crontab.every2Hours')}</option>
                     <option value="0">{t('tool.crontab.midnight')}</option>
                     <option value="12">{t('tool.crontab.noon')}</option>
                     {range(0, 23).map(i => <option key={i} value={i.toString()}>{i}</option>)}
                 </Select>
             </div>
             <div className="space-y-1">
                 <Label>{t('tool.crontab.day')}</Label>
                 <Select value={day} onChange={(e) => updateField(2, e.target.value)}>
                     <option value="*">{t('tool.crontab.everyDay')}</option>
                     {range(1, 31).map(i => <option key={i} value={i.toString()}>{i}</option>)}
                 </Select>
             </div>
             <div className="space-y-1">
                 <Label>{t('tool.crontab.month')}</Label>
                 <Select value={month} onChange={(e) => updateField(3, e.target.value)}>
                     <option value="*">{t('tool.crontab.everyMonth')}</option>
                     {range(1, 12).map(i => <option key={i} value={i.toString()}>{i}</option>)}
                 </Select>
             </div>
             <div className="space-y-1">
                 <Label>{t('tool.crontab.week')}</Label>
                 <Select value={week} onChange={(e) => updateField(4, e.target.value)}>
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
    const [cron, setCron] = useState('* * * * *');
    const [explanation, setExplanation] = useState('');
    const { t, language } = useAppContext();

    useEffect(() => {
        setExplanation(explainCron(cron, language));
    }, [cron, language]);

    return (
        <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">{t('tool.crontab.title')}</h2>
                <p className="text-text-secondary">{t('tool.crontab.desc')}</p>
            </div>
            
            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>{t('tool.crontab.builder')}</Label>
                        <CronBuilder value={cron} onChange={setCron} />
                        
                        <Label className="mt-4 block">{t('tool.crontab.manual')}</Label>
                        <div className="flex gap-4">
                            <Input 
                                type="text" 
                                value={cron} 
                                onChange={(e) => setCron(e.target.value)}
                                className="flex-1 font-mono"
                                placeholder="* * * * *"
                            />
                        </div>
                        <div className="text-xs text-text-secondary">
                            {t('tool.crontab.format')}
                        </div>
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

// --- World Clock Tools ---

interface TimeData {
    ts: number;
}

export const WorldClockTools: React.FC = () => {
    // Offset between Server Time and Local System Time (Server - Local)
    const [timeOffset, setTimeOffset] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useAppContext();
    const [now, setNow] = useState(Date.now());
    
    // To display the "Server Time", we add the offset to the current local time.
    // If offset is null, we haven't synced yet.
    
    // Ref to avoid closure stale state in setInterval if we were using it for fetching,
    // but here we just need to update 'now'.
    
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
                const offset = (serverTs + rtt / 2) - end;
                setTimeOffset(offset);
                console.log(`Time Sync - RTT: ${rtt}ms, Offset: ${offset}ms`);
            }
        } catch (e) {
            console.error("Failed to fetch time", e);
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
        { name: 'Beijing', zone: 'Asia/Shanghai' },
        { name: 'UTC', zone: 'UTC' },
        { name: 'New York', zone: 'America/New_York' },
        { name: 'London', zone: 'Europe/London' },
        { name: 'Tokyo', zone: 'Asia/Tokyo' },
        { name: 'Sydney', zone: 'Australia/Sydney' },
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
            hour12: false
        }).format(new Date(timestamp));
    };
    
    // If we have an offset, Server Time = Now + Offset
    // If not, we just show dashes or local time as fallback (though requirement implies we need source of truth)
    const currentServerTime = timeOffset !== null ? now + timeOffset : null;

    const getOffsetStatus = (offsetMs: number) => {
        const absOffset = Math.abs(offsetMs);
        if (absOffset < 30000) return { color: 'text-green-500', message: '' };
        if (absOffset < 300000) return { color: 'text-yellow-500', message: 'TOTP 验证码失效，倒计时会有明显误差。' };
        if (absOffset < 3600000) return { color: 'text-orange-500', message: 'JWT/Token 登录失败，消息排序混乱。' };
        return { color: 'text-red-600', message: '日期错误，跨天业务逻辑完全崩坏。' };
    };

    return (
        <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div>
                <h2 className="text-2xl font-bold text-text-primary">{t('tool.worldclock.title')}</h2>
                <p className="text-text-secondary">{t('tool.worldclock.desc')}</p>
            </div>

            <Card>
                 <CardHeader title={t('tool.worldclock.calibration')} action={<Button onClick={fetchTime} disabled={loading}>{loading ? t('tool.worldclock.syncing') : t('tool.worldclock.sync')}</Button>} />
                 <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                         <Label className="text-lg">{t('tool.worldclock.server')}</Label>
                         <div className="text-3xl font-mono text-emerald-600 dark:text-emerald-400">
                             {currentServerTime ? formatTime(currentServerTime, 'Asia/Shanghai') : '--'}
                             <span className="text-sm text-text-secondary ml-2">(Beijing)</span>
                         </div>
                         <div className="text-xs text-text-muted">{t('tool.worldclock.source')}: time.azin.workers.dev</div>
                     </div>
                     <div className="space-y-2">
                         <Label className="text-lg">{t('tool.worldclock.local')}</Label>
                         <div className="text-3xl font-mono text-blue-600 dark:text-blue-400">
                             {formatTime(now, 'Asia/Shanghai')}
                              <span className="text-sm text-text-secondary ml-2">(Beijing)</span>
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
                                     const direction = timeOffset < 0 ? '慢' : '快';
                                     return `您的时间比北京时间${direction}${days > 0 ? `${days}天` : ''}${hours > 0 ? `${hours}时` : ''}${minutes > 0 ? `${minutes}分` : ''}${seconds > 0 ? `${seconds}秒` : ''}${ms}毫秒`;
                                 })()}
                                 {getOffsetStatus(timeOffset).message && (
                                     <div className="mt-1 font-semibold">
                                         {getOffsetStatus(timeOffset).message}
                                     </div>
                                 )}
                             </div>
                         )}
                     </div>
                 </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map(z => (
                    <Card key={z.name} className="flex flex-col">
                        <div className="p-4 border-b border-border bg-background-highlight font-semibold">
                            {z.name}
                        </div>
                        <div className="p-6 text-2xl font-mono text-center text-text-primary">
                            {currentServerTime 
                                ? formatTime(currentServerTime, z.zone).split(', ')[1] 
                                : formatTime(now, z.zone).split(', ')[1]
                            }
                             <div className="text-xs text-text-muted mt-2">
                                 {currentServerTime 
                                    ? formatTime(currentServerTime, z.zone).split(', ')[0] 
                                    : formatTime(now, z.zone).split(', ')[0]
                                 }
                             </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
