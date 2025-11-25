import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent, Button, TextArea, CopyButton, Select, Label } from '../components/ui/Shared';
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
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.crontab.title')}</h2>
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
                        <div className="text-xs text-slate-500">
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
    status: number;
    data: {
        timestamp: number;
    };
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
        try {
            const requestStart = Date.now();
            const res = await fetch('https://api.shijian.online/timestamp/');
            const json: TimeData = await res.json();
            const requestEnd = Date.now();
            
            // Assume the server time is the time at the moment the server processed it.
            // We can approximate the "current" server time at the moment of response arrival
            // by adding half the round-trip time (RTT), or just use it as is if precision isn't critical.
            // Let's stick to the simplest: Server Timestamp is correct at the time of generation.
            // We compare it to the local time when we received it (or when we requested it).
            // Let's use the average of start and end as the "local time" corresponding to the server timestamp.
            
            if (json.status === 1) {
                 const serverTs = json.data.timestamp;
                 const localTs = Date.now(); // Current local time
                 
                 // Calculate offset: Server - Local
                 // When we want to know Server Time later, we do: Local + Offset
                 const offset = serverTs - localTs;
                 setTimeOffset(offset);
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

    return (
        <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.worldclock.title')}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t('tool.worldclock.desc')}</p>
            </div>

            <Card>
                 <CardHeader title={t('tool.worldclock.calibration')} action={<Button onClick={fetchTime} disabled={loading}>{loading ? t('tool.worldclock.syncing') : t('tool.worldclock.sync')}</Button>} />
                 <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                         <Label className="text-lg">{t('tool.worldclock.server')}</Label>
                         <div className="text-3xl font-mono text-emerald-600 dark:text-emerald-400">
                             {currentServerTime ? formatTime(currentServerTime, 'Asia/Shanghai') : '--'}
                             <span className="text-sm text-slate-500 ml-2">(Beijing)</span>
                         </div>
                         <div className="text-xs text-slate-400">{t('tool.worldclock.source')}: api.shijian.online</div>
                     </div>
                     <div className="space-y-2">
                         <Label className="text-lg">{t('tool.worldclock.local')}</Label>
                         <div className="text-3xl font-mono text-blue-600 dark:text-blue-400">
                             {formatTime(now, 'Asia/Shanghai')}
                              <span className="text-sm text-slate-500 ml-2">(Beijing)</span>
                         </div>
                         {timeOffset !== null && (
                             <div className={`text-sm ${Math.abs(timeOffset) > 1000 ? 'text-red-500' : 'text-green-500'}`}>
                                 {t('tool.worldclock.offset')}: {Math.round(-timeOffset / 1000)}s
                             </div>
                         )}
                     </div>
                 </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {zones.map(z => (
                    <Card key={z.name} className="flex flex-col">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 font-semibold">
                            {z.name}
                        </div>
                        <div className="p-6 text-2xl font-mono text-center text-slate-800 dark:text-white">
                            {currentServerTime 
                                ? formatTime(currentServerTime, z.zone).split(', ')[1] 
                                : formatTime(now, z.zone).split(', ')[1]
                            }
                             <div className="text-xs text-slate-400 mt-2">
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
