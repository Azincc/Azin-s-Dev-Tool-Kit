'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { enUS, zhCN, ja, ko, de, fr, es, ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Locale map for easy access
import { Locale } from 'date-fns';
const localeMap: Record<string, Locale> = {
  en: enUS,
  'en-US': enUS,
  zh: zhCN,
  'zh-CN': zhCN,
  ja: ja,
  'ja-JP': ja,
  ko: ko,
  'ko-KR': ko,
  de: de,
  'de-DE': de,
  fr: fr,
  'fr-FR': fr,
  es: es,
  'es-ES': es,
  ru: ru,
  'ru-RU': ru,
};

export interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  locale?: string;
  fromYear?: number;
  toYear?: number;
  timeLabel?: string;
}

function DateTimePickerBase({
  value,
  onChange,
  placeholder = 'Pick a date and time',
  className,
  disabled,
  locale = 'en',
  fromYear = 1970,
  toYear = 2100,
  timeLabel = 'Time:',
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [timeValue, setTimeValue] = React.useState<string>(
    value ? format(value, 'HH:mm:ss') : '00:00:00'
  );

  // Get the correct locale object
  const dateLocale = localeMap[locale] || enUS;

  React.useEffect(() => {
    if (value) {
      setDate(value);
      setTimeValue(format(value, 'HH:mm:ss'));
    }
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const [hours, minutes, seconds] = timeValue.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours || 0, minutes || 0, seconds || 0, 0);
      setDate(newDate);
      onChange?.(newDate);
    } else {
      setDate(undefined);
      onChange?.(undefined);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTimeValue(newTime);
    if (date) {
      const [hours, minutes, seconds] = newTime.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours || 0, minutes || 0, seconds || 0, 0);
      setDate(newDate);
      onChange?.(newDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'yyyy-MM-dd HH:mm:ss') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
          className="w-full"
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          locale={dateLocale}
        />
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {timeLabel}
            </label>
            <input
              type="time"
              step="1"
              value={timeValue}
              onChange={handleTimeChange}
              className="flex h-9 flex-1 min-w-[140px] rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [color-scheme:light] dark:[color-scheme:dark]"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Memoize to prevent re-renders from parent state changes (like timer updates)
export const DateTimePicker = React.memo(DateTimePickerBase);
