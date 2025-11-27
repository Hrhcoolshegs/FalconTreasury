import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { allCounterparties } from '../../data/dummyData';
import { Clock, CheckCircle, XCircle, AlertTriangle, Sparkles } from 'lucide-react';

export default function BehaviorPatterns() {
  const behaviorData = allCounterparties.map(cp => ({
    name: cp.short_name,
    reliability: cp.settlement_reliability,
    confirmTime: cp.avg_confirmation_time,
    trades: cp.total_trades_ytd,
    outstanding: cp.outstanding_trades,
  }));

  const settlementTrend = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    onTime: 85 + Math.random() * 10,
    delayed: 8 + Math.random() * 5,
    failed: 2 + Math.random() * 3,
  }));

  const confirmationBuckets = {
    fast: allCounterparties.filter(cp => cp.avg_confirmation_time <= 2).length,
    medium: allCounterparties.filter(cp => cp.avg_confirmation_time > 2 && cp.avg_confirmation_time <= 3).length,
    slow: allCounterparties.filter(cp => cp.avg_confirmation_time > 3).length,
  };

  const reliabilityCategories = {
    excellent: allCounterparties.filter(cp => cp.settlement_reliability >= 95).length,
    good: allCounterparties.filter(cp => cp.settlement_reliability >= 85 && cp.settlement_reliability < 95).length,
    fair: allCounterparties.filter(cp => cp.settlement_reliability >= 75 && cp.settlement_reliability < 85).length,
    poor: allCounterparties.filter(cp => cp.settlement_reliability < 75).length,
  };

  const topReliable = [...allCounterparties]
    .sort((a, b) => b.settlement_reliability - a.settlement_reliability)
    .slice(0, 10);

  const leastReliable = [...allCounterparties]
    .sort((a, b) => a.settlement_reliability - b.settlement_reliability)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Behavior Patterns</h1>
        <p className="text-sm text-gray-500 mt-1">Settlement reliability and confirmation patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Excellent (95%+)</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{reliabilityCategories.excellent}</p>
          <p className="text-xs text-gray-400 mt-1">Highly reliable</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Good (85-95%)</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{reliabilityCategories.good}</p>
          <p className="text-xs text-gray-400 mt-1">Reliable</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-500">Fair (75-85%)</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{reliabilityCategories.fair}</p>
          <p className="text-xs text-gray-400 mt-1">Needs monitoring</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-500">Poor (&lt;75%)</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{reliabilityCategories.poor}</p>
          <p className="text-xs text-gray-400 mt-1">High risk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Settlement Trend (30 Days)</h3>
              <p className="text-sm text-gray-500">On-time vs delayed vs failed</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={settlementTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, '']} />
              <Legend />
              <Line type="monotone" dataKey="onTime" stroke="#27ae60" name="On Time" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="delayed" stroke="#f39c12" name="Delayed" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="failed" stroke="#e74c3c" name="Failed" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmation Time Distribution</h3>
              <p className="text-sm text-gray-500">Average confirmation speed</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Fast (≤2 hours)</p>
                  <p className="text-xs text-gray-500">Excellent response time</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{confirmationBuckets.fast}</p>
                <p className="text-xs text-gray-500">counterparties</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Medium (2-3 hours)</p>
                  <p className="text-xs text-gray-500">Standard response time</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{confirmationBuckets.medium}</p>
                <p className="text-xs text-gray-500">counterparties</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Slow (&gt;3 hours)</p>
                  <p className="text-xs text-gray-500">Needs follow-up</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{confirmationBuckets.slow}</p>
                <p className="text-xs text-gray-500">counterparties</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Most Reliable</h3>
          <div className="space-y-2">
            {topReliable.map((cp, idx) => (
              <div key={cp.counterparty_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{cp.short_name}</p>
                    <p className="text-xs text-gray-500">{cp.total_trades_ytd} trades YTD</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{cp.settlement_reliability.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{cp.avg_confirmation_time.toFixed(1)}h avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Least Reliable</h3>
          <div className="space-y-2">
            {leastReliable.map((cp, idx) => (
              <div key={cp.counterparty_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{cp.short_name}</p>
                    <p className="text-xs text-gray-500">{cp.total_trades_ytd} trades YTD</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{cp.settlement_reliability.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">{cp.avg_confirmation_time.toFixed(1)}h avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
