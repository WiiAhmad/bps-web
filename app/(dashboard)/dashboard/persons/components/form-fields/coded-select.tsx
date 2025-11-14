'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CodedSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: Array<{ value: number; label: string }>;
  placeholder?: string;
  error?: string;
}

export function CodedSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  error,
}: CodedSelectProps) {
  return (
    <div className="space-y-2">
      <Select
        value={value?.toString()}
        onValueChange={(val) => onChange(parseInt(val, 10))}
      >
        <SelectTrigger
          className={cn('w-full', error && 'border-red-500')}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()}>
              {option.value}: {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
