import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, addMonths, subMonths } from 'date-fns';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onApply?: () => void;
  label?: string;
}

const presets = [
  { label: 'Today', getValue: () => ({ start: new Date(), end: new Date() }) },
  { label: 'Yesterday', getValue: () => ({ start: subDays(new Date(), 1), end: subDays(new Date(), 1) }) },
  { label: 'Last 7 Days', getValue: () => ({ start: subDays(new Date(), 7), end: new Date() }) },
  { label: 'Last 30 Days', getValue: () => ({ start: subDays(new Date(), 30), end: new Date() }) },
  { label: 'Last 90 Days', getValue: () => ({ start: subDays(new Date(), 90), end: new Date() }) },
  { label: 'This Month', getValue: () => ({ start: startOfMonth(new Date()), end: endOfMonth(new Date()) }) },
  { label: 'Last Month', getValue: () => ({ start: startOfMonth(subMonths(new Date(), 1)), end: endOfMonth(subMonths(new Date(), 1)) }) },
  { label: 'This Quarter', getValue: () => ({ start: startOfQuarter(new Date()), end: endOfQuarter(new Date()) }) },
  { label: 'This Year', getValue: () => ({ start: startOfYear(new Date()), end: endOfYear(new Date()) }) },
  { label: 'All Time', getValue: () => ({ start: null, end: null }) },
];

export default function DateRangeFilter({ value, onChange, onApply, label = 'Date Range' }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [tempRange, setTempRange] = useState<DateRange>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempRange(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handlePresetSelect = (preset: typeof presets[0]) => {
    const range = preset.getValue();
    setTempRange(range);
    onChange(range);
    if (onApply) onApply();
    setIsOpen(false);
  };

  const handleApply = () => {
    onChange(tempRange);
    if (onApply) onApply();
    setIsOpen(false);
  };

  const handleClear = () => {
    const cleared = { start: null, end: null };
    setTempRange(cleared);
    onChange(cleared);
    if (onApply) onApply();
  };

  const formatDateRange = () => {
    if (!value.start && !value.end) return 'All Time';
    if (!value.start || !value.end) return 'Select Range';

    const start = format(value.start, 'MMM dd, yyyy');
    const end = format(value.end, 'MMM dd, yyyy');

    if (start === end) return start;
    return `${start} - ${end}`;
  };

  const isActive = value.start !== null || value.end !== null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${
          isActive
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span className="text-sm font-medium">{formatDateRange()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'presets'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Quick Presets
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'custom'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Custom Range
            </button>
          </div>

          <div className="p-4">
            {activeTab === 'presets' && (
              <div className="space-y-1">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetSelect(preset)}
                    className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors text-sm font-medium text-gray-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={tempRange.start ? format(tempRange.start, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setTempRange({ ...tempRange, start: e.target.value ? new Date(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={tempRange.end ? format(tempRange.end, 'yyyy-MM-dd') : ''}
                    onChange={(e) => setTempRange({ ...tempRange, end: e.target.value ? new Date(e.target.value) : null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleApply}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm font-medium"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
          </div>

          {isActive && activeTab === 'presets' && (
            <div className="border-t border-gray-200 p-3">
              <button
                onClick={handleClear}
                className="w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
