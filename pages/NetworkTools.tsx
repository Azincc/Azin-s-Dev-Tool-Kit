import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Label, Input, CopyButton, Select, TextArea } from '../components/ui/Shared';
import { useAppContext } from '../contexts/AppContext';
import { UAParser } from 'ua-parser-js';

// --- Subnet Calculator ---

const ipToLong = (ip: string): number | null => {
    const parts = ip.split('.');
    if (parts.length !== 4) return null;

    let result = 0;
    for (const part of parts) {
        const n = parseInt(part, 10);
        if (isNaN(n) || n < 0 || n > 255) return null;
        result = (result << 8) | n;
    }
    return result >>> 0;
};

const longToIp = (long: number): string => {
    return [
        (long >>> 24) & 0xFF,
        (long >>> 16) & 0xFF,
        (long >>> 8) & 0xFF,
        long & 0xFF
    ].join('.');
};

export const SubnetCalculator: React.FC = () => {
    const { t } = useAppContext();
    const [ip, setIp] = useState('192.168.1.1');
    const [mask, setMask] = useState('24');
    const [result, setResult] = useState<any>(null);

    const calculate = () => {
        const ipLong = ipToLong(ip);
        const cidr = parseInt(mask, 10);

        if (ipLong === null || isNaN(cidr) || cidr < 0 || cidr > 32) return;

        // Ensure 32-bit unsigned arithmetic
        // 0xFFFFFFFF << 32 in JS is 0xFFFFFFFF (shift count wraps mod 32).
        // For /0, we want mask to be 0.
        const maskLong = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;

        const networkLong = (ipLong & maskLong) >>> 0;
        const broadcastLong = (networkLong | (~maskLong & 0xFFFFFFFF)) >>> 0;

        const firstIp = longToIp((networkLong + 1) >>> 0);
        const lastIp = longToIp((broadcastLong - 1) >>> 0);
        const networkAddr = longToIp(networkLong);
        const broadcastAddr = longToIp(broadcastLong);

        // Calculate host count
        let hostCount = 0;
        if (cidr === 32) hostCount = 0; // Single IP
        else if (cidr === 31) hostCount = 0; // Point-to-point (usually)
        else {
            hostCount = (broadcastLong - networkLong) - 1;
            if (hostCount < 0) hostCount = 0;
        }

        let binaryMask = '';
        for (let i = 0; i < 32; i++) {
            if (i > 0 && i % 8 === 0) binaryMask += '.';
            binaryMask += (maskLong >>> (31 - i)) & 1;
        }

        setResult({
            cidr: `${networkAddr}/${cidr}`,
            netmask: longToIp(maskLong),
            network: networkAddr,
            broadcast: broadcastAddr,
            first: firstIp,
            last: lastIp,
            hosts: hostCount.toLocaleString(),
            binary: binaryMask
        });
    };

    return (
        <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.subnet.title')}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t('tool.subnet.desc')}</p>
            </div>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="space-y-1 md:col-span-1">
                            <Label>{t('tool.subnet.ip')}</Label>
                            <Input value={ip} onChange={(e: any) => setIp(e.target.value)} placeholder="192.168.1.1" />
                        </div>
                        <div className="space-y-1 md:col-span-1">
                            <Label>{t('tool.subnet.mask')}</Label>
                            <Select value={mask} onChange={(e: any) => setMask(e.target.value)}>
                                {Array.from({ length: 33 }, (_, i) => (
                                    <option key={32 - i} value={32 - i}>/{32 - i}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="md:col-span-1">
                            <Button onClick={calculate} variant="primary" className="w-full">{t('tool.subnet.calculate')}</Button>
                        </div>
                    </div>

                    {result && (
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-200">{t('tool.subnet.results')}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <Label className="text-xs">{t('tool.subnet.cidr')}</Label>
                                    <div className="text-lg font-mono font-medium">{result.cidr}</div>
                                </div>
                                <div>
                                    <Label className="text-xs">{t('tool.subnet.netmask')}</Label>
                                    <div className="text-lg font-mono font-medium">{result.netmask}</div>
                                </div>
                                <div>
                                    <Label className="text-xs">{t('tool.subnet.network')}</Label>
                                    <div className="text-lg font-mono font-medium">{result.network}</div>
                                </div>
                                <div>
                                    <Label className="text-xs">{t('tool.subnet.broadcast')}</Label>
                                    <div className="text-lg font-mono font-medium">{result.broadcast}</div>
                                </div>
                                <div>
                                    <Label className="text-xs">{t('tool.subnet.first')}</Label>
                                    <div className="text-lg font-mono font-medium">{result.first}</div>
                                </div>
                                <div>
                                    <Label className="text-xs">{t('tool.subnet.last')}</Label>
                                    <div className="text-lg font-mono font-medium">{result.last}</div>
                                </div>
                                <div>
                                    <Label className="text-xs">{t('tool.subnet.hosts')}</Label>
                                    <div className="text-lg font-mono font-medium">{result.hosts}</div>
                                </div>
                                <div className="md:col-span-2 lg:col-span-4">
                                    <Label className="text-xs">{t('tool.subnet.binary')}</Label>
                                    <div className="text-sm font-mono text-slate-500 break-all">{result.binary}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// --- User Agent Parser ---

export const UAParserTool: React.FC = () => {
    const { t } = useAppContext();
    const [uaString, setUaString] = useState('');
    const [result, setResult] = useState<any>(null);
    const parserRef = React.useRef(new UAParser());

    const parse = () => {
        parserRef.current.setUA(uaString);
        setResult(parserRef.current.getResult());
    };

    useEffect(() => {
        // Auto parse if not empty
        if (uaString) parse();
    }, [uaString]);

    const useCurrent = () => {
        setUaString(navigator.userAgent);
    };

    // Initialize with current user agent on mount
    useEffect(() => {
        setUaString(navigator.userAgent);
    }, []);

    return (
        <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.ua.title')}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t('tool.ua.desc')}</p>
            </div>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <div className="flex gap-2 items-end">
                        <div className="flex-1 space-y-1">
                            <Label>{t('tool.ua.input')}</Label>
                            <TextArea
                                value={uaString}
                                onChange={(e: any) => setUaString(e.target.value)}
                                placeholder="Mozilla/5.0..."
                                className="font-mono text-sm h-24"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={useCurrent} variant="secondary" size="sm">{t('tool.ua.current')}</Button>
                    </div>

                    {result && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">{t('tool.ua.browser')}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-mono">{result.browser.name || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Version:</span> <span className="font-mono">{result.browser.version || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Major:</span> <span className="font-mono">{result.browser.major || '-'}</span></div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold mb-3 text-purple-600 dark:text-purple-400">{t('tool.ua.os')}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Name:</span> <span className="font-mono">{result.os.name || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Version:</span> <span className="font-mono">{result.os.version || '-'}</span></div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">{t('tool.ua.device')}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Vendor:</span> <span className="font-mono">{result.device.vendor || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Model:</span> <span className="font-mono">{result.device.model || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Type:</span> <span className="font-mono">{result.device.type || 'Desktop/Unknown'}</span></div>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                <h4 className="font-semibold mb-3 text-rose-600 dark:text-rose-400">{t('tool.ua.engine')} / {t('tool.ua.cpu')}</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-slate-500">Engine:</span> <span className="font-mono">{result.engine.name || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Eng. Ver:</span> <span className="font-mono">{result.engine.version || '-'}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">CPU:</span> <span className="font-mono">{result.cpu.architecture || '-'}</span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// --- Curl Generator ---

interface HeaderItem {
    id: number;
    key: string;
    value: string;
}

export const CurlGenerator: React.FC = () => {
    const { t } = useAppContext();
    const [url, setUrl] = useState('https://api.example.com/data');
    const [method, setMethod] = useState('GET');
    const [headers, setHeaders] = useState<HeaderItem[]>([
        { id: 1, key: 'Content-Type', value: 'application/json' },
        { id: 2, key: 'Authorization', value: 'Bearer token123' }
    ]);
    const [body, setBody] = useState('{\n  "key": "value"\n}');
    const [generated, setGenerated] = useState('');

    const addHeader = () => {
        setHeaders([...headers, { id: Date.now(), key: '', value: '' }]);
    };

    const updateHeader = (id: number, field: 'key' | 'value', val: string) => {
        setHeaders(headers.map(h => h.id === id ? { ...h, [field]: val } : h));
    };

    const removeHeader = (id: number) => {
        setHeaders(headers.filter(h => h.id !== id));
    };

    useEffect(() => {
        let cmd = `curl -X ${method} '${url}'`;

        headers.forEach(h => {
            if (h.key) cmd += ` \\\n  -H '${h.key}: ${h.value}'`;
        });

        if (method !== 'GET' && method !== 'HEAD' && body) {
            // Simple check to avoid newlines breaking shell too easily, but ideally should escape quotes
            const safeBody = body.replace(/'/g, "'\\''");
            cmd += ` \\\n  -d '${safeBody}'`;
        }

        setGenerated(cmd);
    }, [url, method, headers, body]);

    return (
        <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{t('tool.curl.title')}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t('tool.curl.desc')}</p>
            </div>

            <div className="flex flex-col gap-6 flex-1 min-h-0">
                <Card className="flex-[3] flex flex-col min-h-0 overflow-auto">
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-1">
                            <Label>{t('tool.curl.url')}</Label>
                            <div className="flex gap-2">
                                <Select value={method} onChange={(e: any) => setMethod(e.target.value)} className="w-32">
                                    <option>GET</option>
                                    <option>POST</option>
                                    <option>PUT</option>
                                    <option>DELETE</option>
                                    <option>PATCH</option>
                                </Select>
                                <Input value={url} onChange={(e: any) => setUrl(e.target.value)} placeholder="https://..." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>{t('tool.curl.headers')}</Label>
                                <Button onClick={addHeader} variant="secondary" size="sm">{t('tool.curl.add_header')}</Button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                                {headers.map(h => (
                                    <div key={h.id} className="flex gap-2">
                                        <Input
                                            value={h.key}
                                            onChange={(e: any) => updateHeader(h.id, 'key', e.target.value)}
                                            placeholder="Key"
                                            className="flex-1 focus:relative focus:z-10"
                                        />
                                        <Input
                                            value={h.value}
                                            onChange={(e: any) => updateHeader(h.id, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="flex-1 focus:relative focus:z-10"
                                        />
                                        <Button onClick={() => removeHeader(h.id)} variant="danger" className="px-2">×</Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {method !== 'GET' && (
                            <div className="space-y-1 flex-1">
                                <Label>{t('tool.curl.body')}</Label>
                                <TextArea
                                    value={body}
                                    onChange={(e: any) => setBody(e.target.value)}
                                    className="font-mono text-sm h-32"
                                    placeholder="{}"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col min-h-0">
                    <CardContent className="p-6 h-full flex flex-col">
                        <Label className="mb-2 block">{t('tool.curl.output')}</Label>
                        <div className="relative flex-1 bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 overflow-auto group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CopyButton text={generated} />
                            </div>
                            <pre className="whitespace-pre-wrap break-all">{generated}</pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
