'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  value: string; // ISO string or empty string
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  label = 'Date & Time',
  placeholder = 'Pick a date and time',
  disabled = false,
  className,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeValue, setTimeValue] = useState({ hours: '12', minutes: '00' });

  // Parse the ISO string value into date and time
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value);
        // Ensure we're working with local timezone
        setSelectedDate(date);
        setTimeValue({
          hours: date.getHours().toString().padStart(2, '0'),
          minutes: date.getMinutes().toString().padStart(2, '0'),
        });
      } catch (error) {
        console.error('Invalid date value:', error);
      }
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      // Combine date with current time
      const newDate = new Date(date);
      newDate.setHours(parseInt(timeValue.hours, 10));
      newDate.setMinutes(parseInt(timeValue.minutes, 10));
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);

      // Convert to ISO string in local timezone
      onChange(newDate.toISOString());
    }
  };

  const handleTimeChange = (type: 'hours' | 'minutes', val: string) => {
    const numVal = parseInt(val, 10);

    if (type === 'hours' && (isNaN(numVal) || numVal < 0 || numVal > 23)) return;
    if (type === 'minutes' && (isNaN(numVal) || numVal < 0 || numVal > 59)) return;

    const newTimeValue = { ...timeValue, [type]: val.padStart(2, '0') };
    setTimeValue(newTimeValue);

    // Update the full datetime if date is selected
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(newTimeValue.hours, 10));
      newDate.setMinutes(parseInt(newTimeValue.minutes, 10));
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);

      onChange(newDate.toISOString());
    }
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    setTimeValue({ hours: '12', minutes: '00' });
    onChange('');
  };

  const displayValue = selectedDate
    ? `${format(selectedDate, 'PPP')} at ${timeValue.hours}:${timeValue.minutes}`
    : '';

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !selectedDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="sm:flex">
            {/* Calendar */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />

            {/* Time Picker */}
            <div className="flex flex-col gap-2 p-3 border-t sm:border-t-0 sm:border-l border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Time</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <label htmlFor="hours" className="text-xs text-muted-foreground">
                    Hours
                  </label>
                  <input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    value={timeValue.hours}
                    onChange={(e) => handleTimeChange('hours', e.target.value)}
                    className="w-16 px-2 py-1 text-center text-sm border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>

                <span className="text-xl font-bold mt-5">:</span>

                <div className="flex flex-col gap-1">
                  <label htmlFor="minutes" className="text-xs text-muted-foreground">
                    Minutes
                  </label>
                  <input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={timeValue.minutes}
                    onChange={(e) => handleTimeChange('minutes', e.target.value)}
                    className="w-16 px-2 py-1 text-center text-sm border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground mt-2">
                {selectedDate && (
                  <span>
                    {format(selectedDate, 'PPP')} at {timeValue.hours}:{timeValue.minutes}
                  </span>
                )}
              </div>

              {/* Quick time buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const now = new Date();
                    setTimeValue({
                      hours: now.getHours().toString().padStart(2, '0'),
                      minutes: now.getMinutes().toString().padStart(2, '0'),
                    });
                    if (selectedDate) {
                      const newDate = new Date(selectedDate);
                      newDate.setHours(now.getHours());
                      newDate.setMinutes(now.getMinutes());
                      newDate.setSeconds(0);
                      newDate.setMilliseconds(0);
                      onChange(newDate.toISOString());
                    }
                  }}
                  className="text-xs"
                >
                  Now
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTimeValue({ hours: '09', minutes: '00' });
                    if (selectedDate) {
                      const newDate = new Date(selectedDate);
                      newDate.setHours(9);
                      newDate.setMinutes(0);
                      newDate.setSeconds(0);
                      newDate.setMilliseconds(0);
                      onChange(newDate.toISOString());
                    }
                  }}
                  className="text-xs"
                >
                  9:00 AM
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTimeValue({ hours: '12', minutes: '00' });
                    if (selectedDate) {
                      const newDate = new Date(selectedDate);
                      newDate.setHours(12);
                      newDate.setMinutes(0);
                      newDate.setSeconds(0);
                      newDate.setMilliseconds(0);
                      onChange(newDate.toISOString());
                    }
                  }}
                  className="text-xs"
                >
                  12:00 PM
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTimeValue({ hours: '17', minutes: '00' });
                    if (selectedDate) {
                      const newDate = new Date(selectedDate);
                      newDate.setHours(17);
                      newDate.setMinutes(0);
                      newDate.setSeconds(0);
                      newDate.setMilliseconds(0);
                      onChange(newDate.toISOString());
                    }
                  }}
                  className="text-xs"
                >
                  5:00 PM
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4">
                {selectedDate && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClear}
                    className="flex-1 text-xs"
                  >
                    Clear
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-xs"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
