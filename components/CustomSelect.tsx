import React, { useState, useEffect, useRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  desc: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  customLabel?: string;
  customPlaceholder?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  customValue = '',
  onCustomChange,
  customLabel = '自定义',
  customPlaceholder = '',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayLabel = value === 'custom'
    ? (customValue || customLabel)
    : options.find(opt => opt.value === value)?.label.split(' - ')[0] || '';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative flex-shrink-0 ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-40 h-10 px-3 flex items-center justify-between rounded-md border border-border-input bg-background-input text-text-primary text-sm font-mono hover:bg-background-secondary transition-colors"
      >
        <span className="truncate">{displayLabel}</span>
        <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-64 left-0 rounded-md border border-border bg-background-surface shadow-lg overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-background-secondary transition-colors ${value === opt.value ? 'bg-background-secondary' : ''} first:rounded-t-md`}
            >
              <div className="font-mono font-semibold text-text-primary">{opt.label}</div>
              <div className="text-xs text-text-secondary mt-0.5">{opt.desc}</div>
            </button>
          ))}
          {onCustomChange && (
            <div className="px-3 py-2 border-t border-border">
              <div className="font-mono font-semibold text-text-primary text-sm mb-1">{customLabel}</div>
              <input
                value={customValue}
                onChange={e => { onCustomChange(e.target.value); onChange('custom'); }}
                onClick={e => e.stopPropagation()}
                placeholder={customPlaceholder}
                className="w-full h-8 px-2 rounded border border-border-input bg-background-input text-text-primary text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
