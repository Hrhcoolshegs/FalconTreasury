import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { allCounterparties } from '../../data/dummyData';
import { TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

export default function ExposureOverview() {
  const topByExposure = [...allCounterparties]
    .sort((a, b) => b.exposure_ngn - a.exposure_ngn)
    .slice(0, 10);

  const exposureTrendData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    exposure: 45000000000 + Math.random() * 5000000000,
    limit: 50000000000,
  }));

  const formatNGN = (value: number) => `₦${(value / 1000000000).toFixed(1)}B`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Exposure Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Counterparty and desk exposure monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Counterparties by Exposure */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top 10 by Exposure</h3>
              <p className="text-sm text-gray-500">Highest exposure counterparties</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f] hover:text-[#2d5a8f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <div className="space-y-3">
            {topByExposure.map((cp, idx) => (
              <div key={cp.counterparty_id} className="flex items-center gap-3">
                <div className="text-sm font-bold text-gray-400 w-6">{idx + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{cp.short_name}</span>
                    <span className="text-sm font-bold text-gray-900">{formatNGN(cp.exposure_ngn)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        cp.utilization_percentage > 90
                          ? 'bg-red-500'
                          : cp.utilization_percentage > 75
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${cp.utilization_percentage}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{cp.utilization_percentage}% utilized</span>
                    <span className="text-xs text-gray-400">{cp.risk_category} Risk</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exposure Trend */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Exposure Trend (30 Days)</h3>
              <p className="text-sm text-gray-500">Total exposure vs limit</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f] hover:text-[#2d5a8f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={exposureTrendData.slice(-15)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${(v / 1000000000).toFixed(0)}B`} />
              <Tooltip formatter={(value: any) => [formatNGN(value), '']} />
              <Legend />
              <Bar dataKey="exposure" fill="#1e3a5f" name="Total Exposure" />
              <Bar dataKey="limit" fill="#f39c12" name="Aggregate Limit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Limit Breach Alerts */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Limit Breach Watch List</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topByExposure
            .filter(cp => cp.utilization_percentage > 85)
            .map(cp => (
              <div key={cp.counterparty_id} className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-gray-900">{cp.short_name}</span>
                  <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">{cp.utilization_percentage}%</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {formatNGN(cp.exposure_ngn)} / {formatNGN(cp.exposure_limit_ngn)}
                </p>
                <button className="text-sm text-red-700 hover:text-red-900 font-medium">Review Limit →</button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
