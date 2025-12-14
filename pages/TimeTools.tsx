import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  TextArea,
  CopyButton,
  Select,
  Label,
} from "../components/ui/Shared";
import { useAppContext } from "../contexts/AppContext";

// --- Crontab Tools ---

const explainCron = (cron: string, lang: "en" | "zh"): string => {
  const fields = cron.trim().split(/\s+/);
  if (fields.length !== 5)
    return lang === "zh"
      ? "格式错误：需要5个字段 (分 时 日 月 周)"
      : "Invalid format: 5 fields required (min hour day month week)";

  const [min, hour, day, month, week] = fields;

  let desc = "";

  if (lang === "zh") {
    if (week !== "*") desc += `每周 ${week} `;
    if (month !== "*") desc += `${month}月 `;
    if (day !== "*") desc += `${day}日 `;
    if (hour !== "*") {
      if (hour.includes("/")) desc += `每隔 ${hour.substring(2)} 小时 `;
      else desc += `${hour}点 `;
    }
    if (min !== "*") {
      if (min.includes("/")) desc += `每隔 ${min.substring(2)} 分钟 `;
      else desc += `${min}分 `;
    }
    if (min === "*" && hour === "*") desc += "每分钟";
    else if (min === "0" && hour === "*") desc += "每小时整";

    desc += "执行";
  } else {
    desc += "Run ";
    if (min === "*" && hour === "*") desc += "every minute";
    else {
      if (min !== "*")
        desc += min.includes("/")
          ? `every ${min.substring(2)} minutes`
          : `at minute ${min}`;
      if (hour !== "*")
        desc += hour.includes("/")
          ? ` past every ${hour.substring(2)} hours`
          : ` past hour ${hour}`;
    }

    if (day !== "*") desc += ` on day ${day} of the month`;
    if (month !== "*") desc += ` in month ${month}`;
    if (week !== "*") desc += ` on day of week ${week}`;
  }

  return desc;
};

// Simple Cron Builder Component
const CronBuilder = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const { t } = useAppContext();
  const fields = value.split(" ");
  const safeFields = fields.length === 5 ? fields : ["*", "*", "*", "*", "*"];

  const [min, hour, day, month, week] = safeFields;

  const updateField = (index: number, val: string) => {
    const newFields = [...safeFields];
    newFields[index] = val;
    onChange(newFields.join(" "));
  };

  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
      <div className="space-y-1">
        <Label>{t("tool.crontab.minute")}</Label>
        <Select value={min} onChange={(e) => updateField(0, e.target.value)}>
          <option value="*">{t("tool.crontab.everyMin")}</option>
          <option value="*/5">{t("tool.crontab.every5Min")}</option>
          <option value="*/15">{t("tool.crontab.every15Min")}</option>
          <option value="0">{t("tool.crontab.at0")}</option>
          <option value="30">{t("tool.crontab.at30")}</option>
          {range(0, 59).map((i) => (
            <option key={i} value={i.toString()}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t("tool.crontab.hour")}</Label>
        <Select value={hour} onChange={(e) => updateField(1, e.target.value)}>
          <option value="*">{t("tool.crontab.everyHour")}</option>
          <option value="*/2">{t("tool.crontab.every2Hours")}</option>
          <option value="0">{t("tool.crontab.midnight")}</option>
          <option value="12">{t("tool.crontab.noon")}</option>
          {range(0, 23).map((i) => (
            <option key={i} value={i.toString()}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t("tool.crontab.day")}</Label>
        <Select value={day} onChange={(e) => updateField(2, e.target.value)}>
          <option value="*">{t("tool.crontab.everyDay")}</option>
          {range(1, 31).map((i) => (
            <option key={i} value={i.toString()}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t("tool.crontab.month")}</Label>
        <Select value={month} onChange={(e) => updateField(3, e.target.value)}>
          <option value="*">{t("tool.crontab.everyMonth")}</option>
          {range(1, 12).map((i) => (
            <option key={i} value={i.toString()}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-1">
        <Label>{t("tool.crontab.week")}</Label>
        <Select value={week} onChange={(e) => updateField(4, e.target.value)}>
          <option value="*">{t("tool.crontab.everyDay")}</option>
          <option value="0">{t("tool.crontab.sun")}</option>
          <option value="1">{t("tool.crontab.mon")}</option>
          <option value="2">{t("tool.crontab.tue")}</option>
          <option value="3">{t("tool.crontab.wed")}</option>
          <option value="4">{t("tool.crontab.thu")}</option>
          <option value="5">{t("tool.crontab.fri")}</option>
          <option value="6">{t("tool.crontab.sat")}</option>
        </Select>
      </div>
    </div>
  );
};

export const CrontabTools: React.FC = () => {
  const [cron, setCron] = useState("* * * * *");
  const [explanation, setExplanation] = useState("");
  const { t, language } = useAppContext();

  useEffect(() => {
    setExplanation(explainCron(cron, language));
  }, [cron, language]);

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t("tool.crontab.title")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {t("tool.crontab.desc")}
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Label>{t("tool.crontab.builder")}</Label>
            <CronBuilder value={cron} onChange={setCron} />

            <Label className="mt-4 block">{t("tool.crontab.manual")}</Label>
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
              {t("tool.crontab.format")}
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md">
            <span className="font-semibold">{t("tool.crontab.meaning")} </span>
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
  const [uncertainty, setUncertainty] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { t, language } = useAppContext();
  const [now, setNow] = useState(Date.now());

  // To display the "Server Time", we add the offset to the current local time.
  // If offset is null, we haven't synced yet.

  // Ref to avoid closure stale state in setInterval if we were using it for fetching,
  // but here we just need to update 'now'.

  const fetchTime = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      const res = await fetch("https://time.tool.azin.cc/");
      const json: TimeData = await res.json();
      const end = Date.now();

      if (json.ts) {
        const serverTs = json.ts;
        const rtt = end - start;
        const offset = serverTs + rtt / 2 - end;
        setTimeOffset(offset);
        setUncertainty(Math.ceil(rtt / 2));
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
    { labelKey: "tool.worldclock.city.beijing", zone: "Asia/Shanghai" },
    { labelKey: "tool.worldclock.city.utc", zone: "UTC" },
    { labelKey: "tool.worldclock.city.new_york", zone: "America/New_York" },
    { labelKey: "tool.worldclock.city.london", zone: "Europe/London" },
    { labelKey: "tool.worldclock.city.paris", zone: "Europe/Paris" },
    {
      labelKey: "tool.worldclock.city.los_angeles",
      zone: "America/Los_Angeles",
    },
    { labelKey: "tool.worldclock.city.tokyo", zone: "Asia/Tokyo" },
    { labelKey: "tool.worldclock.city.singapore", zone: "Asia/Singapore" },
    { labelKey: "tool.worldclock.city.sydney", zone: "Australia/Sydney" },
  ];

  const formatTime = (timestamp: number, zone: string) => {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(timestamp));
  };

  // If we have an offset, Server Time = Now + Offset
  // If not, we just show dashes or local time as fallback (though requirement implies we need source of truth)
  const currentServerTime = timeOffset !== null ? now + timeOffset : null;

  const getOffsetStatus = (offsetMs: number) => {
    const absOffset = Math.abs(offsetMs);
    if (absOffset < 50) return { color: "text-green-600", message: "" };
    if (absOffset < 30000) return { color: "text-green-500", message: "" };
    if (absOffset < 300000)
      return {
        color: "text-yellow-500",
        message: t("tool.worldclock.warn_totp"),
      };
    if (absOffset < 3600000)
      return {
        color: "text-orange-500",
        message: t("tool.worldclock.warn_jwt"),
      };
    return { color: "text-red-600", message: t("tool.worldclock.err_date") };
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t("tool.worldclock.title")}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {t("tool.worldclock.desc")}
        </p>
      </div>

      <Card>
        <CardHeader
          title={t("tool.worldclock.calibration")}
          action={
            <Button onClick={fetchTime} disabled={loading}>
              {loading
                ? t("tool.worldclock.syncing")
                : t("tool.worldclock.sync")}
            </Button>
          }
        />
        <CardContent className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2">
            <Label className="text-lg">{t("tool.worldclock.server")}</Label>
            <div className="text-xl sm:text-2xl md:text-3xl font-mono text-emerald-600 dark:text-emerald-400 break-all">
              {currentServerTime
                ? formatTime(currentServerTime, "Asia/Shanghai")
                : "--"}
              <span className="text-sm text-slate-500 ml-2">(Beijing)</span>
            </div>
            <div className="text-xs text-slate-400">
              {t("tool.worldclock.source")}: time.azin.workers.dev
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-lg">{t("tool.worldclock.local")}</Label>
            <div className="text-xl sm:text-2xl md:text-3xl font-mono text-blue-600 dark:text-blue-400 break-all">
              {formatTime(now, "Asia/Shanghai")}
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
                    timeOffset < 0
                      ? t("tool.worldclock.slow")
                      : t("tool.worldclock.fast");

                  let timeStr = "";
                  if (days > 0) timeStr += `${days}${t("tool.worldclock.day")}`;
                  if (hours > 0)
                    timeStr += `${hours}${t("tool.worldclock.hour")}`;
                  if (minutes > 0)
                    timeStr += `${minutes}${t("tool.worldclock.minute")}`;
                  if (seconds > 0)
                    timeStr += `${seconds}${t("tool.worldclock.second")}`;
                  timeStr += `${ms}${t("tool.worldclock.millisecond")}`;

                  let result = "";
                  if (language === "zh") {
                    result = `${t(
                      "tool.worldclock.diff_prefix"
                    )}${direction}${timeStr}`;
                  } else {
                    result = `${t(
                      "tool.worldclock.diff_prefix"
                    )}${timeStr} ${direction}${t(
                      "tool.worldclock.diff_suffix"
                    )}`;
                  }

                  // Add uncertainty
                  if (uncertainty !== null) {
                    result += ` (±${uncertainty}ms)`;
                  }

                  if (absMs < 50) {
                    return `${t("tool.worldclock.accurate")} ${result}`;
                  }
                  return result;
                })()}
                {getOffsetStatus(timeOffset).message && (
                  <div className="mt-1 font-semibold">
                    {getOffsetStatus(timeOffset).message}
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500">
              <h4 className="font-semibold mb-1">
                {t("tool.worldclock.algorithm")}
              </h4>
              <p>{t("tool.worldclock.algo_desc")}</p>
              <code className="block mt-1 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded w-fit">
                {t("tool.worldclock.algo_formula")}
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
                ? formatTime(currentServerTime, z.zone).split(", ")[1]
                : formatTime(now, z.zone).split(", ")[1]}
              <div className="text-xs text-slate-400 mt-2">
                {currentServerTime
                  ? formatTime(currentServerTime, z.zone).split(", ")[0]
                  : formatTime(now, z.zone).split(", ")[0]}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
