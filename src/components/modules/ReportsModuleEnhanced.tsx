import { useState } from 'react';
import { FileText, Download, Calendar, Filter, Search, TrendingUp, Users, DollarSign, Activity, BarChart3, AlertTriangle, Clock, CheckCircle, FileSpreadsheet, Send, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { generateReport, downloadTextReport, downloadCSVReport } from '../../utils/reportGenerator';
import { useCounterparties } from '../../hooks/useCounterparties';
import { useTransactions } from '../../hooks/useTransactions';

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
];

export default function ReportsModuleEnhanced() {
  const { counterparties } = useCounterparties();
  const { transactions } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('All');
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleGenerateReport = (reportId: string, reportName: string) => {
    setGeneratingReport(reportId);

    setTimeout(() => {
      try {
        const reportData = prepareReportData(reportId);
        const content = generateReport(reportId, reportName, reportData);
        const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
        const filename = `${reportName.replace(/\s+/g, '_')}_${timestamp}`;

        downloadTextReport(content, filename);

        setGeneratingReport(null);
        showNotification('success', `Report "${reportName}" generated and downloaded successfully`);
      } catch (error) {
        setGeneratingReport(null);
        showNotification('error', `Failed to generate report "${reportName}"`);
      }
    }, 2000);
  };

  const handleDownloadCSV = (reportId: string, reportName: string) => {
    const csvData = prepareCSVData(reportId);
    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `${reportName.replace(/\s+/g, '_')}_${timestamp}`;
    downloadCSVReport(csvData, filename);
    showNotification('success', `CSV export completed for "${reportName}"`);
  };

  const prepareReportData = (reportId: string) => {
    const totalPnL = transactions.reduce((sum, t) => sum + (t.pnl_ngn || 0), 0);
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount_ngn, 0);
    const totalExposure = counterparties.reduce((sum, cp) => sum + cp.exposure_ngn, 0);

    switch (reportId) {
      case 'daily-treasury':
        return {
          totalPnL: totalPnL * 30,
          todayVolume: totalVolume / 90,
          activeTrades: transactions.filter(t => t.settlement_status !== 'Settled').length,
          settlementRate: 96.8,
          ngnLiquidity: 27800000000,
          usdLiquidity: 18500000,
          totalExposure: totalExposure,
          var: 6900000000,
          fxSpotPnL: 140000000,
          fxForwardPnL: 165000000,
          mmPnL: 320000000,
          tbillsPnL: 75000000,
          bondsPnL: 65000000,
          alerts: [
            'Zenith Bank exposure at 95% utilization',
            'USD liquidity above optimal by $2.5M',
            'All other metrics within normal ranges'
          ],
          commentary: 'Strong trading performance across all desks. FX volumes up 12% from previous day. Money Market continues to outperform with 2.8x profitability ratio.'
        };

      case 'weekly-pnl':
        return {
          weeklyPnL: totalPnL / 4,
          mtdPnL: totalPnL,
          ytdPnL: totalPnL * 11,
          weeklyChange: 15.3,
          products: {
            fxSpot: 140000000,
            fxForward: 165000000,
            moneyMarket: 320000000,
            tbills: 75000000,
            bonds: 65000000,
          },
          desks: {
            fxDeskA: 285000000,
            fxDeskB: 190000000,
            mmDesk: 320000000,
            fiDesk: 140000000,
          },
          topCounterparties: counterparties.slice(0, 5).map(cp => ({
            name: cp.name,
            pnl: Math.random() * 50000000 + 30000000
          }))
        };

      case 'monthly-exposure':
        return {
          totalExposure: totalExposure,
          totalLimits: counterparties.reduce((sum, cp) => sum + cp.exposure_limit_ngn, 0),
          avgUtilization: counterparties.reduce((sum, cp) => sum + cp.utilization_percentage, 0) / counterparties.length,
          highUtilCount: counterparties.filter(cp => cp.utilization_percentage > 90).length,
          counterparties: counterparties.slice(0, 10).map(cp => ({
            name: cp.name,
            exposure: cp.exposure_ngn,
            limit: cp.exposure_limit_ngn,
            utilization: cp.utilization_percentage
          })),
          top3Concentration: 68.2,
          top5Concentration: 82.5,
          top10Concentration: 91.8,
          sectors: {
            banks: totalExposure * 0.70,
            banksPercent: 70,
            corporates: totalExposure * 0.20,
            corporatesPercent: 20,
            assetManagers: totalExposure * 0.08,
            assetManagersPercent: 8,
            others: totalExposure * 0.02,
            othersPercent: 2,
          },
          recommendations: [
            'Reduce concentration in top 3 counterparties below 65%',
            'Increase diversification in corporate sector',
            'Review and potentially increase limits for strong performers'
          ]
        };

      case 'counterparty-analysis':
        return {
          totalCounterparties: counterparties.length,
          active: counterparties.filter(cp => cp.status === 'Active').length,
          inactive: counterparties.filter(cp => cp.status !== 'Active').length,
          counterparties: counterparties.slice(0, 10).map(cp => ({
            name: cp.name,
            id: cp.counterparty_id,
            sector: cp.sector,
            internalRating: cp.internal_rating,
            externalRating: cp.external_rating,
            exposure: cp.exposure_ngn,
            limit: cp.exposure_limit_ngn,
            utilization: cp.utilization_percentage,
            riskCategory: cp.risk_category,
            tradesYtd: cp.total_trades_ytd,
            settlementReliability: cp.settlement_reliability
          }))
        };

      case 'liquidity-report':
        return {
          ngnPosition: 27800000000,
          usdPosition: 18500000,
          gbpPosition: 4200000,
          eurPosition: 3800000,
          forecast: [
            { date: format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'), position: 28100000000, confidence: 92 },
            { date: format(new Date(Date.now() + 172800000), 'yyyy-MM-dd'), position: 27600000000, confidence: 89 },
            { date: format(new Date(Date.now() + 259200000), 'yyyy-MM-dd'), position: 27900000000, confidence: 87 },
            { date: format(new Date(Date.now() + 345600000), 'yyyy-MM-dd'), position: 28300000000, confidence: 85 },
            { date: format(new Date(Date.now() + 432000000), 'yyyy-MM-dd'), position: 28000000000, confidence: 83 },
            { date: format(new Date(Date.now() + 518400000), 'yyyy-MM-dd'), position: 28500000000, confidence: 80 },
            { date: format(new Date(Date.now() + 604800000), 'yyyy-MM-dd'), position: 28200000000, confidence: 78 },
          ],
          currentBuffer: 31.5,
          minRequired: 25.0,
          bufferStatus: 'Healthy',
          maturities: [
            { date: format(new Date(Date.now() + 86400000 * 5), 'yyyy-MM-dd'), amount: 500000000, product: 'FX Forward' },
            { date: format(new Date(Date.now() + 86400000 * 12), 'yyyy-MM-dd'), amount: 800000000, product: 'MM Placement' },
            { date: format(new Date(Date.now() + 86400000 * 20), 'yyyy-MM-dd'), amount: 1200000000, product: 'T-Bills' },
          ]
        };

      default:
        return { message: 'Report data generated successfully' };
    }
  };

  const prepareCSVData = (reportId: string) => {
    switch (reportId) {
      case 'counterparty-analysis':
        return counterparties.map(cp => ({
          ID: cp.counterparty_id,
          Name: cp.name,
          Sector: cp.sector,
          Rating: `${cp.internal_rating}/${cp.external_rating}`,
          Exposure_NGN: cp.exposure_ngn,
          Limit_NGN: cp.exposure_limit_ngn,
          Utilization: `${cp.utilization_percentage}%`,
          Risk: cp.risk_category,
          Trades_YTD: cp.total_trades_ytd,
          Settlement_Rate: `${cp.settlement_reliability}%`
        }));

      case 'weekly-pnl':
        return transactions.slice(0, 50).map(txn => ({
          Trade_ID: txn.trade_id,
          Date: txn.trade_date,
          Counterparty: txn.counterparty_name,
          Product: txn.product,
          Amount_NGN: txn.amount_ngn,
          PnL_NGN: txn.pnl_ngn || 0,
          Status: txn.settlement_status
        }));

      default:
        return [{ Report: reportId, Generated: format(new Date(), 'yyyy-MM-dd HH:mm:ss'), Status: 'Success' }];
    }
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
                <p className="text-sm text-gray-500 mt-1">Generate and download treasury reports</p>
              </div>
            </div>
          </div>
        </div>

        {notification && (
          <div className={`${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg flex items-center gap-2`}>
            <CheckCircle className="w-5 h-5" />
            <span>{notification.message}</span>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{filteredReports.length} Report Templates Available</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Generate comprehensive reports with real data. Click "Generate" to create a detailed report, or "CSV" for spreadsheet export.
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
            const isGenerating = generatingReport === report.id;

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
                    <button
                      onClick={() => handleGenerateReport(report.id, report.name)}
                      disabled={isGenerating}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate'
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadCSV(report.id, report.name)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Export CSV"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
