import { useState, useCallback, useEffect } from 'react';
import { isWithinInterval, parseISO } from 'date-fns';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export function useDateFilter(storageKey: string = 'dateFilter') {
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          start: parsed.start ? new Date(parsed.start) : null,
          end: parsed.end ? new Date(parsed.end) : null,
        };
      }
    } catch (error) {
      console.error('Failed to parse stored date filter:', error);
    }
    return { start: null, end: null };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        start: dateRange.start?.toISOString(),
        end: dateRange.end?.toISOString(),
      }));
    } catch (error) {
      console.error('Failed to store date filter:', error);
    }
  }, [dateRange, storageKey]);

  const filterByDate = useCallback(<T extends Record<string, any>>(
    data: T[],
    dateField: keyof T
  ): T[] => {
    if (!dateRange.start && !dateRange.end) {
      return data;
    }

    return data.filter(item => {
      const itemDate = item[dateField];
      if (!itemDate) return false;

      let date: Date;
      if (typeof itemDate === 'string') {
        date = parseISO(itemDate);
      } else if (itemDate instanceof Date) {
        date = itemDate;
      } else {
        return false;
      }

      if (dateRange.start && dateRange.end) {
        try {
          return isWithinInterval(date, { start: dateRange.start, end: dateRange.end });
        } catch (error) {
          return false;
        }
      }

      if (dateRange.start && !dateRange.end) {
        return date >= dateRange.start;
      }

      if (!dateRange.start && dateRange.end) {
        return date <= dateRange.end;
      }

      return true;
    });
  }, [dateRange]);

  const isFiltered = dateRange.start !== null || dateRange.end !== null;

  const clearFilter = useCallback(() => {
    setDateRange({ start: null, end: null });
  }, []);

  return {
    dateRange,
    setDateRange,
    filterByDate,
    isFiltered,
    clearFilter,
  };
}
