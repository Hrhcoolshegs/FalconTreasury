import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { liquidityData } from '../../data/dummyData';
import { Droplets, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

export default function LiquidityOverview() {
  const latest = liquidityData[liquidityData.length - 1];
  const chartData = liquidityData.slice(-30).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    opening: d.opening_balance_ngn / 1000000000,
    closing: d.closing_balance_ngn / 1000000000,
    netFlow: d.net_flow_ngn / 1000000000,
    pred7d: d.predicted_7d_balance_ngn / 1000000000,
    pred14d: d.predicted_14d_balance_ngn / 1000000000,
    pred30d: d.predicted_30d_balance_ngn / 1000000000,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Liquidity & Cash Position</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time liquidity monitoring and forecasting</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Closing Balance (₦)</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₦{(latest.closing_balance_ngn / 1000000000).toFixed(2)}B</p>
          <p className="text-xs text-gray-400 mt-1">Required: ₦20B</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Buffer (%)</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{latest.buffer_percentage_ngn.toFixed(1)}%</p>
          <p className="text-xs text-gray-400 mt-1">Above minimum</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-500">Net Flow (₦)</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₦{(latest.net_flow_ngn / 1000000000).toFixed(2)}B</p>
          <p className="text-xs text-gray-400 mt-1">Today's net movement</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">7-Day Forecast</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₦{(latest.predicted_7d_balance_ngn / 1000000000).toFixed(2)}B</p>
          <p className="text-xs text-green-600 mt-1">{latest.confidence_7d}% confidence</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Balance (30 Days)</h3>
              <p className="text-sm text-gray-500">Opening vs Closing</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}B`} />
              <Tooltip formatter={(value: any) => [`₦${value.toFixed(2)}B`, '']} />
              <Legend />
              <Line type="monotone" dataKey="opening" stroke="#4a90e2" name="Opening" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="closing" stroke="#1e3a5f" name="Closing" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Liquidity Forecast</h3>
              <p className="text-sm text-gray-500">7/14/30-day predictions</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData.slice(-10)}>
              <defs>
                <linearGradient id="pred7" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27ae60" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#27ae60" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}B`} />
              <Tooltip formatter={(value: any) => [`₦${value.toFixed(2)}B`, '']} />
              <Legend />
              <Area type="monotone" dataKey="pred7d" stroke="#27ae60" fill="url(#pred7)" name="7-Day Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Major Flows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Major Inflows</h3>
          <div className="space-y-3">
            {latest.major_inflows.map((inflow, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{inflow.source}</span>
                <span className="text-sm font-bold text-green-600">+₦{(inflow.amount / 1000000000).toFixed(2)}B</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Major Outflows</h3>
          <div className="space-y-3">
            {latest.major_outflows.map((outflow, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{outflow.destination}</span>
                <span className="text-sm font-bold text-red-600">-₦{(outflow.amount / 1000000000).toFixed(2)}B</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
