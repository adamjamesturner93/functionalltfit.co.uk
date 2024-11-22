'use client';

import * as React from 'react';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { CalendarIcon, ClockIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
  showTimeSelect?: boolean;
  disabled?: boolean;
  dateFormat?: string;
  className?: string;
  allowPastDates?: boolean;
  allowFutureDates?: boolean;
}

export function DatePicker({
  selected,
  onChange,
  showMonthDropdown,
  showYearDropdown,
  showTimeSelect = false,
  disabled = false,
  dateFormat = 'PPP',
  className,
  allowPastDates = false,
  allowFutureDates = true,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(selected);
  const [calendarDate, setCalendarDate] = React.useState<Date>(selected || new Date());
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  // Generate year options (100 years back from current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // Month names
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Generate time options (15-minute intervals)
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  });

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      if (selectedDate) {
        newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      }
      setSelectedDate(newDate);
      onChange(newDate);
    } else {
      setSelectedDate(null);
      onChange(null);
    }
    if (!showTimeSelect) {
      setCalendarOpen(false);
    }
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(months.indexOf(month));
    setCalendarDate(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(calendarDate);
    newDate.setFullYear(parseInt(year));
    setCalendarDate(newDate);
  };

  const handleTimeChange = (time: string) => {
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      setSelectedDate(newDate);
      onChange(newDate);
    }
  };

  const formatDate = (date: Date) => {
    if (showTimeSelect) {
      return format(date, `${dateFormat} HH:mm`);
    }
    return format(date, dateFormat);
  };

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    if (!allowPastDates && isBefore(date, today)) {
      return true;
    }
    if (!allowFutureDates && isAfter(date, today)) {
      return true;
    }
    return false;
  };

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start bg-popover text-left font-normal',
            !selected && 'text-muted',
            disabled && 'cursor-not-allowed opacity-50',
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 size-4" />
          {selected ? formatDate(selected) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-2 border-b p-3">
          {showMonthDropdown && (
            <Select value={months[calendarDate.getMonth()]} onValueChange={handleMonthChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {showYearDropdown && (
            <Select value={calendarDate.getFullYear().toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleSelect}
          disabled={isDateDisabled}
          initialFocus
          month={calendarDate}
          onMonthChange={setCalendarDate}
        />
        {showTimeSelect && (
          <div className="flex items-center justify-between border-t px-3 py-2">
            <ClockIcon className="size-4 text-muted" />
            <Select
              value={selectedDate ? format(selectedDate, 'HH:mm') : undefined}
              onValueChange={handleTimeChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
