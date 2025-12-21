import React, { useState } from 'react';
import { Card, CardContent, Button, Label, Input, Select } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import { SEO } from '../ui/SEO';

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
  return [(long >>> 24) & 0xff, (long >>> 16) & 0xff, (long >>> 8) & 0xff, long & 0xff].join('.');
};

interface SubnetResult {
  cidr: string;
  netmask: string;
  network: string;
  broadcast: string;
  first: string;
  last: string;
  hosts: string;
  binary: string;
}

export const SubnetCalculator: React.FC = () => {
  const { t } = useAppContext();
  const [ip, setIp] = useState<string>('192.168.1.1');
  const [mask, setMask] = useState<string>('24');
  const [result, setResult] = useState<SubnetResult | null>(null);

  const calculate = () => {
    const ipLong = ipToLong(ip);
    const cidr = parseInt(mask, 10);

    if (ipLong === null || isNaN(cidr) || cidr < 0 || cidr > 32) return;

    // Ensure 32-bit unsigned arithmetic
    // 0xFFFFFFFF << 32 in JS is 0xFFFFFFFF (shift count wraps mod 32).
    // For /0, we want mask to be 0.
    const maskLong = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;

    const networkLong = (ipLong & maskLong) >>> 0;
    const broadcastLong = (networkLong | (~maskLong & 0xffffffff)) >>> 0;

    const firstIp = longToIp((networkLong + 1) >>> 0);
    const lastIp = longToIp((broadcastLong - 1) >>> 0);
    const networkAddr = longToIp(networkLong);
    const broadcastAddr = longToIp(broadcastLong);

    // Calculate host count
    let hostCount = 0;
    if (cidr === 32)
      hostCount = 0; // Single IP
    else if (cidr === 31)
      hostCount = 0; // Point-to-point (usually)
    else {
      hostCount = broadcastLong - networkLong - 1;
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
      binary: binaryMask,
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <SEO pageId="subnet" />
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.subnet.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.subnet.desc')}</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1 md:col-span-1">
              <Label>{t('tool.subnet.ip')}</Label>
              <Input
                value={ip}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIp(e.target.value)}
                placeholder="192.168.1.1"
              />
            </div>
            <div className="space-y-1 md:col-span-1">
              <Label>{t('tool.subnet.mask')}</Label>
              <Select
                value={mask}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMask(e.target.value)}
              >
                {Array.from({ length: 33 }, (_, i) => (
                  <option key={32 - i} value={32 - i}>
                    /{32 - i}
                  </option>
                ))}
              </Select>
            </div>
            <div className="md:col-span-1">
              <Button onClick={calculate} variant="primary" className="w-full">
                {t('tool.subnet.calculate')}
              </Button>
            </div>
          </div>

          {result && (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold mb-4 text-slate-700 dark:text-slate-200">
                {t('tool.subnet.results')}
              </h3>
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
