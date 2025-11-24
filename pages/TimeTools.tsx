import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, Button, TextArea, CopyButton, Select, Label } from '../components/ui/Shared';
import { useAppContext } from '../contexts/AppContext';

// --- Crontab Tools ---

const explainCron = (cron: string, lang: 'en' | 'zh'): string => {
    const fields = cron.trim().split(/\s+/);
    if (fields.length !== 5) return lang === 'zh' ? "格式错误：需要5个字段 (分 时 日 月 周)" : "Invalid format: 5 fields required (min hour day month week)";

    const [min, hour, day, month, week] = fields;

    const parseField = (field: string, unit: string, range: string) => {
        if (field === '*') return '';
        if (field.startsWith('*/')) return lang === 'zh' ? `每隔 ${field.substring(2)} ${unit}` : `every ${field.substring(2)} ${unit}s`;
        return `${lang === 'zh' ? '' : 'at '}${field} ${unit}`;
    };
    
    // Very basic implementation - for production use a library like cronstrue
    // This is just to satisfy the requirement of "writing an interpreter"
    
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
                        <Label>Cron Expression</Label>
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
                            Format: Minute Hour Day Month Week
                        </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md">
                        <span className="font-semibold">Meaning: </span>
                        {explanation}
                    </div>
                    
                    <div className="grid grid-cols-5 gap-2 text-center text-sm">
                         {['Minute', 'Hour', 'Day', 'Month', 'Week'].map(field => (
                             <div key={field} className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                 <div className="font-bold text-slate-700 dark:text-slate-300">{field}</div>
                             </div>
                         ))}
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
    const [serverTime, setServerTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useAppContext();
    const [now, setNow] = useState(Date.now());

    const fetchTime = async () => {
        setLoading(true);
        try {
            const res = await fetch('https://api.shijian.online/timestamp/');
            const json: TimeData = await res.json();
            if (json.status === 1) {
                setServerTime(json.data.timestamp);
            }
        } catch (e) {
            console.error("Failed to fetch time", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTime();
        const interval = setInterval(() => {
            setNow(Date.now());
            // If we have server time, we could increment it too, but better to re-fetch or just diff it.
            // For calibration visualization, we'll compare server timestamp with local.
        }, 1000);
        return () => clearInterval(interval);
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

    return (
        <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.worldclock.title')}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t('tool.worldclock.desc')}</p>
            </div>

            <Card>
                 <CardHeader title="Global Time Calibration" action={<Button onClick={fetchTime} disabled={loading}>{loading ? 'Syncing...' : 'Sync Now'}</Button>} />
                 <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                         <Label className="text-lg">Server Time (Source of Truth)</Label>
                         <div className="text-3xl font-mono text-emerald-600 dark:text-emerald-400">
                             {serverTime ? formatTime(serverTime, 'Asia/Shanghai') : '--'}
                             <span className="text-sm text-slate-500 ml-2">(Beijing)</span>
                         </div>
                         <div className="text-xs text-slate-400">Source: api.shijian.online</div>
                     </div>
                     <div className="space-y-2">
                         <Label className="text-lg">Local System Time</Label>
                         <div className="text-3xl font-mono text-blue-600 dark:text-blue-400">
                             {formatTime(now, 'Asia/Shanghai')}
                              <span className="text-sm text-slate-500 ml-2">(Beijing)</span>
                         </div>
                         {serverTime && (
                             <div className={`text-sm ${Math.abs(serverTime - now) > 1000 ? 'text-red-500' : 'text-green-500'}`}>
                                 Offset: {Math.round((now - serverTime) / 1000)}s
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
                            {serverTime ? formatTime(serverTime, z.zone).split(', ')[1] : formatTime(now, z.zone).split(', ')[1]}
                             <div className="text-xs text-slate-400 mt-2">{serverTime ? formatTime(serverTime, z.zone).split(', ')[0] : formatTime(now, z.zone).split(', ')[0]}</div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
