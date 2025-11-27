import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { liquidityData, productPerformance, allCounterparties, sentimentData, insights } from '../../data/dummyData';
import ExplainModal from '../ExplainModal';
import { safeNumber, formatLargeNumber } from '../../utils/numberHelpers';

export default function TreasuryOverview() {
  const [explainModal, setExplainModal] = useState<{isOpen: boolean; context: any}>({isOpen: false, context: {}});
  // Calculate summary metrics
  const latestLiquidity = liquidityData[liquidityData.length - 1];
  const totalLiquidityNGN = safeNumber(latestLiquidity?.closing_balance_ngn, 0);
  const totalLiquidityUSD = safeNumber(latestLiquidity?.closing_balance_usd, 0);

  const dailyPnL = productPerformance.reduce((sum, p) => sum + safeNumber(p.pnl_total_ngn, 0), 0);
  const settlementPending = allCounterparties.reduce((sum, cp) => sum + safeNumber(cp.outstanding_trades, 0), 0);

  const fxExposure = allCounterparties.reduce((sum, cp) => sum + safeNumber(cp.exposure_ngn, 0), 0);

  const highRiskCount = allCounterparties.filter(cp => cp.risk_category === 'High').length;
  const sentimentShifts = sentimentData.filter(s => s.sentiment_trend_30d === 'Declining').length;
  const activeWorkflows = insights.filter(i => i.status === 'Active').length;

  // Prepare chart data
  const liquidityTrendData = liquidityData.slice(-30).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    ngn: d.closing_balance_ngn / 1000000000,
    usd: d.closing_balance_usd / 1000000,
  }));

  const exposureByDesk = [
    { name: 'FX Desk A', value: 45, amount: 22500000000 },
    { name: 'FX Desk B', value: 32, amount: 16000000000 },
    { name: 'MM Desk', value: 18, amount: 9000000000 },
    { name: 'Fixed Income', value: 5, amount: 2500000000 },
  ];

  const COLORS = ['#1e3a5f', '#4a90e2', '#f39c12', '#27ae60'];

  const formatCurrency = (value: number, currency: string) => {
    const safeValue = safeNumber(value, 0);
    if (currency === 'NGN') {
      return formatLargeNumber(safeValue, 'NGN');
    }
    return formatLargeNumber(safeValue, 'USD');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Treasury Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time view of treasury operations and key metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Liquidity (₦)"
          value={formatCurrency(totalLiquidityNGN, 'NGN')}
          change="+2.3%"
          trend="up"
          subtitle="Buffer: 31.5% above minimum"
        />
        <SummaryCard
          title="Total Liquidity ($)"
          value={formatCurrency(totalLiquidityUSD, 'USD')}
          change="+1.8%"
          trend="up"
          subtitle="Buffer: 22.7% above minimum"
        />
        <SummaryCard
          title="Daily MTM P&L"
          value={formatCurrency(dailyPnL, 'NGN')}
          change="+12.5%"
          trend="up"
          subtitle="Across all products"
        />
        <SummaryCard
          title="Settlement Pipeline"
          value={`${settlementPending} trades`}
          change="-5 from yesterday"
          trend="down"
          subtitle="Pending settlement"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liquidity Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Liquidity Trend (30 Days)</h3>
              <p className="text-sm text-gray-500">Closing balance by currency</p>
            </div>
            <button
              onClick={() => setExplainModal({
                isOpen: true,
                context: {
                  component: 'treasury-liquidity-trend',
                  currentValues: {
                    ngn: (totalLiquidityNGN / 1000000000).toFixed(2),
                    usd: (totalLiquidityUSD / 1000000).toFixed(2)
                  },
                  trends: ['up', 'up']
                }
              })}
              className="flex items-center gap-1 text-sm text-[#1e3a5f] hover:text-[#2d5a8f] transition-colors hover:bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={liquidityTrendData}>
              <defs>
                <linearGradient id="colorNgn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUsd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4a90e2" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" />
              <Tooltip
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value: any) => [`₦${value.toFixed(2)}B`, '']}
              />
              <Legend />
              <Area type="monotone" dataKey="ngn" stroke="#1e3a5f" fillOpacity={1} fill="url(#colorNgn)" name="NGN (₦B)" />
              <Area type="monotone" dataKey="usd" stroke="#4a90e2" fillOpacity={1} fill="url(#colorUsd)" name="USD ($M)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* FX Exposure by Desk */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">FX Exposure by Desk</h3>
              <p className="text-sm text-gray-500">Current exposure distribution</p>
            </div>
            <button
              onClick={() => setExplainModal({
                isOpen: true,
                context: {
                  component: 'treasury-fx-exposure',
                  currentValues: {
                    totalExposure: (fxExposure / 1000000000).toFixed(2)
                  }
                }
              })}
              className="flex items-center gap-1 text-sm text-[#1e3a5f] hover:text-[#2d5a8f] transition-colors hover:bg-blue-50 px-3 py-1.5 rounded-lg"
            >
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={exposureByDesk}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {exposureByDesk.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any, name: any, props: any) => [formatCurrency(props.payload.amount, 'NGN'), '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={TrendingUp}
          label="FX Exposure"
          value={formatCurrency(fxExposure, 'NGN')}
          change="+3.2% from last week"
          color="blue"
        />
        <MetricCard
          icon={AlertCircle}
          label="High-Risk Counterparties"
          value={`${highRiskCount}`}
          change="2 added this week"
          color="red"
        />
        <MetricCard
          icon={ArrowDownRight}
          label="Sentiment Shifts"
          value={`${sentimentShifts}`}
          change="Declining sentiment detected"
          color="orange"
        />
        <MetricCard
          icon={Sparkles}
          label="Workflow Triggers"
          value={`${activeWorkflows}`}
          change="Active workflows today"
          color="green"
        />
      </div>

      {/* Insights Feed */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Insights</h3>
            <p className="text-sm text-gray-500">AI-powered intelligence alerts</p>
          </div>
          <button className="text-sm text-[#1e3a5f] hover:text-[#2d5a8f] font-medium transition-colors">
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {insights.slice(0, 3).map((insight) => (
            <InsightCard key={insight.insight_id} insight={insight} />
          ))}
        </div>
      </div>

      <ExplainModal
        isOpen={explainModal.isOpen}
        onClose={() => setExplainModal({isOpen: false, context: {}})}
        context={explainModal.context}
      />
    </div>
  );
}

function SummaryCard({ title, value, change, trend, subtitle }: any) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
          <div className="flex items-center gap-2">
            <span className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {change}
            </span>
          </div>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, change, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-400">{change}</p>
    </div>
  );
}

function InsightCard({ insight }: any) {
  const severityColors = {
    Critical: 'bg-red-100 text-red-800 border-red-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-[#1e3a5f] transition-colors cursor-pointer">
      <div className="flex items-start gap-3">
        <div className={`px-2 py-1 rounded text-xs font-medium ${severityColors[insight.severity as keyof typeof severityColors]}`}>
          {insight.severity}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{new Date(insight.created_timestamp).toLocaleString()}</span>
            <span>•</span>
            <span>{insight.category}</span>
            {insight.financial_impact_ngn > 0 && (
              <>
                <span>•</span>
                <span className="text-red-600 font-medium">
                  Impact: ₦{(insight.financial_impact_ngn / 1000000).toFixed(1)}M
                </span>
              </>
            )}
          </div>
        </div>
        <button className="text-sm text-[#1e3a5f] hover:text-[#2d5a8f] font-medium whitespace-nowrap">
          {insight.action_button_label} →
        </button>
      </div>
    </div>
  );
}
