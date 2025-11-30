import { useState } from 'react';
import { Sparkles, Save, X, Play, FileText, Calendar, Filter as FilterIcon, BarChart3, Settings, Wand2, ChevronRight } from 'lucide-react';
import { ReportNLPParser } from '../../utils/reportNLPParser';
import { useCustomReports } from '../../hooks/useCustomReports';
import DateRangeFilter from '../common/DateRangeFilter';
import { format } from 'date-fns';

interface CustomReportBuilderProps {
  onClose: () => void;
  onReportCreated?: () => void;
  initialQuery?: string;
}

export default function CustomReportBuilder({ onClose, onReportCreated, initialQuery = '' }: CustomReportBuilderProps) {
  const { createReport } = useCustomReports();
  const [mode, setMode] = useState<'nl' | 'visual'>('nl');
  const [nlQuery, setNlQuery] = useState(initialQuery);
  const [parsedReport, setParsedReport] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Visual builder state
  const [reportName, setReportName] = useState('');
  const [description, setDescription] = useState('');
  const [reportType, setReportType] = useState('transactions');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [filters, setFilters] = useState<any[]>([]);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const reportTypes = [
    { value: 'transactions', label: 'Transactions', icon: FileText },
    { value: 'counterparties', label: 'Counterparties', icon: BarChart3 },
    { value: 'exposure', label: 'Exposure', icon: FilterIcon },
    { value: 'pnl', label: 'P&L Analysis', icon: BarChart3 },
    { value: 'compliance', label: 'Compliance', icon: Settings },
    { value: 'liquidity', label: 'Liquidity', icon: Calendar },
  ];

  const availableMetrics = {
    transactions: [
      'trade_id', 'trade_date', 'value_date', 'counterparty_name', 'product',
      'currency_pair', 'buy_sell', 'amount_ngn', 'amount_usd', 'rate',
      'pnl_ngn', 'margin_bps', 'trader', 'desk', 'settlement_status', 'settlement_date'
    ],
    counterparties: [
      'name', 'sector', 'country', 'internal_rating', 'external_rating',
      'exposure_ngn', 'exposure_limit_ngn', 'utilization_percentage',
      'settlement_reliability', 'total_trades_ytd', 'total_volume_ytd_ngn'
    ],
    exposure: [
      'counterparty_name', 'exposure_ngn', 'exposure_usd', 'exposure_limit_ngn',
      'utilization_percentage', 'risk_category', 'internal_rating', 'outstanding_trades'
    ],
    pnl: [
      'product', 'trader', 'desk', 'pnl_ngn', 'trades_count', 'volume_ngn',
      'win_loss_ratio', 'margin_bps', 'counterparty_name'
    ],
  };

  const groupByOptions = {
    transactions: ['product', 'counterparty_name', 'trader', 'desk', 'settlement_status'],
    counterparties: ['sector', 'country', 'risk_category', 'internal_rating'],
    exposure: ['risk_category', 'sector', 'product'],
    pnl: ['product', 'trader', 'desk', 'counterparty_name'],
  };

  const exampleQueries = [
    "Show me all FX Spot transactions with FirstBank in the last 30 days",
    "Generate exposure report for all high-risk counterparties this quarter",
    "Create P&L report by trader for Money Market products this month",
    "Show all transactions with volume exceeding ₦1B last quarter",
    "List counterparties with exposure utilization above 80%",
  ];

  const handleParseNL = () => {
    if (!nlQuery.trim()) {
      setNotification({ type: 'error', message: 'Please enter a query' });
      return;
    }

    const parsed = ReportNLPParser.parse(nlQuery);
    setParsedReport(parsed);
    setShowPreview(true);

    // Pre-fill visual builder
    setReportName(parsed.reportName);
    setReportType(parsed.reportType);
    setSelectedMetrics(parsed.metrics);
    setDateRange(parsed.dateRange);
    setFilters(parsed.filters);
    if (parsed.groupBy) setGroupBy(parsed.groupBy);
  };

  const handleSaveReport = async () => {
    if (!reportName.trim()) {
      setNotification({ type: 'error', message: 'Please enter a report name' });
      return;
    }

    if (mode === 'visual' && selectedMetrics.length === 0) {
      setNotification({ type: 'error', message: 'Please select at least one metric' });
      return;
    }

    setSaving(true);
    try {
      const reportConfig = {
        reportType: mode === 'nl' && parsedReport ? parsedReport.reportType : reportType,
        filters: mode === 'nl' && parsedReport ? parsedReport.filters : filters,
        metrics: mode === 'nl' && parsedReport ? parsedReport.metrics : selectedMetrics,
        groupBy: mode === 'nl' && parsedReport ? parsedReport.groupBy : groupBy,
        sortBy: mode === 'nl' && parsedReport ? parsedReport.sortBy : undefined,
        limit: mode === 'nl' && parsedReport ? parsedReport.limit : undefined,
        dateRange: {
          start: dateRange.start,
          end: dateRange.end
        },
        aggregations: mode === 'nl' && parsedReport ? parsedReport.aggregations : [],
        format: 'csv' as const,
      };

      await createReport({
        user_id: 'demo-user',
        report_name: reportName,
        description: description || null,
        report_config: reportConfig,
        natural_language_query: mode === 'nl' ? nlQuery : null,
        is_favorite: false,
        is_scheduled: false,
        schedule_config: null,
        tags,
      });

      setNotification({ type: 'success', message: 'Report template saved successfully!' });
      setTimeout(() => {
        if (onReportCreated) onReportCreated();
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Save report error:', error);
      setNotification({
        type: 'error',
        message: `Failed to save report: ${error.message || 'Unknown error'}`
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Wand2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Custom Report Builder</h2>
              <p className="text-sm text-white/90">Create custom reports with natural language or visual builder</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mx-6 mt-4 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {notification.message}
          </div>
        )}

        {/* Mode Selector */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setMode('nl')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              mode === 'nl'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Natural Language
          </button>
          <button
            onClick={() => setMode('visual')}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
              mode === 'visual'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-5 h-5" />
            Visual Builder
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === 'nl' ? (
            <div className="space-y-6">
              {/* Natural Language Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the report you want to create
                </label>
                <textarea
                  value={nlQuery}
                  onChange={(e) => setNlQuery(e.target.value)}
                  placeholder="Example: Show me all FX Spot transactions with FirstBank in the last 30 days where volume exceeded ₦1B"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                />
              </div>

              {/* Example Queries */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Try these examples:</p>
                <div className="grid grid-cols-1 gap-2">
                  {exampleQueries.map((example, idx) => (
                    <button
                      key={idx}
                      onClick={() => setNlQuery(example)}
                      className="text-left px-4 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg text-sm text-gray-700 hover:text-blue-700 transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parse Button */}
              <button
                onClick={handleParseNL}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center justify-center gap-2 font-medium"
              >
                <Sparkles className="w-5 h-5" />
                Parse & Preview Report
              </button>

              {/* Parsed Preview */}
              {showPreview && parsedReport && (
                <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Parsed Configuration
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Report Type:</span>
                      <p className="text-gray-900 capitalize">{parsedReport.reportType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Report Name:</span>
                      <p className="text-gray-900">{parsedReport.reportName}</p>
                    </div>
                    {parsedReport.filters.length > 0 && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Filters:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {parsedReport.filters.map((f: any, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-white text-gray-700 rounded text-xs border border-gray-200">
                              {f.field} {f.operator} {Array.isArray(f.value) ? f.value.join(', ') : f.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {parsedReport.metrics.length > 0 && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Metrics ({parsedReport.metrics.length}):</span>
                        <p className="text-gray-600 text-xs mt-1">{parsedReport.metrics.join(', ')}</p>
                      </div>
                    )}
                    {(parsedReport.dateRange.start || parsedReport.dateRange.end) && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Date Range:</span>
                        <p className="text-gray-900">
                          {parsedReport.dateRange.start && format(parsedReport.dateRange.start, 'MMM dd, yyyy')}
                          {parsedReport.dateRange.start && parsedReport.dateRange.end && ' - '}
                          {parsedReport.dateRange.end && format(parsedReport.dateRange.end, 'MMM dd, yyyy')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Report Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Report Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() => {
                          setReportType(type.value);
                          setSelectedMetrics([]);
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          reportType === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mb-2 ${reportType === type.value ? 'text-blue-600' : 'text-gray-400'}`} />
                        <p className="font-medium text-sm">{type.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Metrics Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Metrics ({selectedMetrics.length} selected)
                </label>
                <div className="border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {(availableMetrics[reportType as keyof typeof availableMetrics] || []).map((metric) => (
                      <label key={metric} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={selectedMetrics.includes(metric)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMetrics([...selectedMetrics, metric]);
                            } else {
                              setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{metric}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <DateRangeFilter value={dateRange} onChange={setDateRange} />
              </div>

              {/* Group By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group By (Optional)</label>
                <select
                  multiple
                  value={groupBy}
                  onChange={(e) => setGroupBy(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  size={4}
                >
                  {(groupByOptions[reportType as keyof typeof groupByOptions] || []).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>
          )}

          {/* Common Fields */}
          <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Name *</label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this report..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (Optional)</label>
              <input
                type="text"
                placeholder="Add tags separated by commas..."
                onChange={(e) => setTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveReport}
            disabled={saving || !reportName.trim()}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Report Template'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
