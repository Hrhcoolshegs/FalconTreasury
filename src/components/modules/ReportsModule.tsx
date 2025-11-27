import { useState } from 'react';
import { FileText, Download, Calendar, Filter, Search, TrendingUp, Users, DollarSign, Activity, BarChart3, AlertTriangle, Clock, CheckCircle, FileSpreadsheet, Send } from 'lucide-react';
import { format } from 'date-fns';

const reportTemplates = [
  {
    id: 'daily-treasury',
    name: 'Daily Treasury Summary',
    category: 'Treasury',
    description: 'Comprehensive daily overview of treasury positions, P&L, and key metrics',
    frequency: 'Daily',
    icon: DollarSign,
    color: 'blue',
    lastGenerated: '2025-11-26 08:00',
    recipients: ['treasury@falcon.ng', 'cfo@falcon.ng'],
  },
  {
    id: 'weekly-pnl',
    name: 'Weekly P&L Report',
    category: 'Financial',
    description: 'Weekly profit & loss breakdown by product, counterparty, and desk',
    frequency: 'Weekly',
    icon: TrendingUp,
    color: 'green',
    lastGenerated: '2025-11-25 17:00',
    recipients: ['finance@falcon.ng'],
  },
  {
    id: 'monthly-exposure',
    name: 'Monthly Exposure Report',
    category: 'Risk',
    description: 'Comprehensive exposure analysis across all counterparties and products',
    frequency: 'Monthly',
    icon: AlertTriangle,
    color: 'orange',
    lastGenerated: '2025-11-01 09:00',
    recipients: ['risk@falcon.ng', 'compliance@falcon.ng'],
  },
  {
    id: 'counterparty-analysis',
    name: 'Counterparty Analysis',
    category: 'Credit',
    description: 'Detailed credit analysis with ratings, exposure, and settlement performance',
    frequency: 'Weekly',
    icon: Users,
    color: 'purple',
    lastGenerated: '2025-11-24 10:00',
    recipients: ['credit@falcon.ng'],
  },
  {
    id: 'liquidity-report',
    name: 'Liquidity Position Report',
    category: 'Treasury',
    description: 'Daily liquidity positions across all currencies and accounts',
    frequency: 'Daily',
    icon: Activity,
    color: 'teal',
    lastGenerated: '2025-11-26 07:30',
    recipients: ['treasury@falcon.ng'],
  },
  {
    id: 'trade-summary',
    name: 'Trade Summary Report',
    category: 'Operations',
    description: 'Summary of all trades executed with settlement status and confirmations',
    frequency: 'Daily',
    icon: FileText,
    color: 'blue',
    lastGenerated: '2025-11-26 08:15',
    recipients: ['operations@falcon.ng'],
  },
  {
    id: 'sentiment-intelligence',
    name: 'Sentiment Intelligence Brief',
    category: 'Analytics',
    description: 'AI-powered sentiment analysis with likelihood and fit scoring',
    frequency: 'Weekly',
    icon: Activity,
    color: 'indigo',
    lastGenerated: '2025-11-25 16:00',
    recipients: ['strategy@falcon.ng'],
  },
  {
    id: 'compliance-report',
    name: 'Regulatory Compliance Report',
    category: 'Compliance',
    description: 'KYC status, AML checks, sanctions screening, and regulatory filings',
    frequency: 'Monthly',
    icon: CheckCircle,
    color: 'green',
    lastGenerated: '2025-11-01 11:00',
    recipients: ['compliance@falcon.ng', 'legal@falcon.ng'],
  },
  {
    id: 'market-share',
    name: 'Market Share Analysis',
    category: 'Analytics',
    description: 'Product-level market share estimation and competitive positioning',
    frequency: 'Monthly',
    icon: BarChart3,
    color: 'blue',
    lastGenerated: '2025-11-01 14:00',
    recipients: ['strategy@falcon.ng'],
  },
  {
    id: 'workflow-efficiency',
    name: 'Workflow Efficiency Report',
    category: 'Operations',
    description: 'Analysis of workflow completion rates, bottlenecks, and SLA performance',
    frequency: 'Weekly',
    icon: Clock,
    color: 'orange',
    lastGenerated: '2025-11-25 15:00',
    recipients: ['operations@falcon.ng'],
  },
  {
    id: 'attribution-analysis',
    name: 'Attribution Analysis',
    category: 'Financial',
    description: 'P&L attribution by trader, desk, product, and counterparty',
    frequency: 'Monthly',
    icon: TrendingUp,
    color: 'green',
    lastGenerated: '2025-11-01 10:30',
    recipients: ['finance@falcon.ng', 'management@falcon.ng'],
  },
  {
    id: 'predictive-insights',
    name: 'Predictive Insights Report',
    category: 'Analytics',
    description: 'ML-powered predictions for liquidity needs, default risks, and trade volumes',
    frequency: 'Weekly',
    icon: Activity,
    color: 'purple',
    lastGenerated: '2025-11-25 12:00',
    recipients: ['treasury@falcon.ng', 'risk@falcon.ng'],
  },
  {
    id: 'settlement-performance',
    name: 'Settlement Performance',
    category: 'Operations',
    description: 'Settlement success rates, failure analysis, and timing metrics',
    frequency: 'Daily',
    icon: CheckCircle,
    color: 'teal',
    lastGenerated: '2025-11-26 09:00',
    recipients: ['operations@falcon.ng'],
  },
  {
    id: 'behavior-patterns',
    name: 'Behavior Patterns Report',
    category: 'Analytics',
    description: 'Counterparty trading patterns, seasonality, and anomaly detection',
    frequency: 'Monthly',
    icon: BarChart3,
    color: 'indigo',
    lastGenerated: '2025-11-01 13:00',
    recipients: ['strategy@falcon.ng'],
  },
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    category: 'Management',
    description: 'High-level overview of treasury performance for senior management',
    frequency: 'Weekly',
    icon: FileSpreadsheet,
    color: 'blue',
    lastGenerated: '2025-11-25 18:00',
    recipients: ['cfo@falcon.ng', 'ceo@falcon.ng'],
  },
  {
    id: 'regulatory-filing',
    name: 'Regulatory Filing Package',
    category: 'Compliance',
    description: 'Complete regulatory filing package for CBN and other authorities',
    frequency: 'Monthly',
    icon: FileText,
    color: 'red',
    lastGenerated: '2025-11-01 16:00',
    recipients: ['compliance@falcon.ng'],
  },
];

export default function ReportsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(reportTemplates.map(r => r.category)))];
  const frequencies = ['All', ...Array.from(new Set(reportTemplates.map(r => r.frequency)))];

  const filteredReports = reportTemplates.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    const matchesFrequency = selectedFrequency === 'All' || report.frequency === selectedFrequency;
    return matchesSearch && matchesCategory && matchesFrequency;
  });

  const colorMap: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    purple: 'from-purple-500 to-purple-600',
    teal: 'from-teal-500 to-teal-600',
    indigo: 'from-indigo-500 to-indigo-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Reports Module</h1>
                <p className="text-sm text-gray-500 mt-1">Generate and manage treasury reports</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">16 Report Templates Available</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Access pre-configured reports covering treasury operations, risk management, compliance, and analytics.
                Generate on-demand or schedule automated delivery to stakeholders.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedFrequency}
                onChange={(e) => setSelectedFrequency(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${colorMap[report.color]}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${colorMap[report.color]} rounded-lg shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {report.frequency}
                      </span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {report.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{report.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Last generated: {report.lastGenerated}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Send className="w-4 h-4" />
                      <span>{report.recipients.length} recipient(s)</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-sm shadow-md">
                      Generate
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Reports</h3>
          <div className="space-y-3">
            {reportTemplates.filter(r => r.frequency === 'Daily').slice(0, 5).map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <report.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{report.name}</p>
                    <p className="text-xs text-gray-500">Next run: Tomorrow at 08:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Active
                  </span>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
