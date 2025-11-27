import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { allCounterparties } from '../../data/dummyData';
import { AlertTriangle, TrendingUp, Target, Activity } from 'lucide-react';

export default function RiskExposureModule() {
  const deskExposure = [
    { desk: 'FX Desk A', exposure: 15250, limit: 20000, var: 1850 },
    { desk: 'FX Desk B', exposure: 12800, limit: 18000, var: 1520 },
    { desk: 'MM Desk', exposure: 25900, limit: 30000, var: 2840 },
    { desk: 'Fixed Income', exposure: 6440, limit: 10000, var: 720 },
  ];

  const riskScoreHistory = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    score: 65 + Math.random() * 20,
    threshold: 75,
  }));

  const exposureForecast = Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    forecast: 60000 + Math.random() * 10000,
    current: 55000,
  }));

  const limitBreaches = allCounterparties.filter(cp => cp.utilization_percentage > 90);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk & Exposure Module</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive risk monitoring and exposure management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Total Exposure</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">₦60.4B</p>
            <p className="text-xs text-gray-400 mt-1">Across all desks</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">VaR (95%)</span>
            </div>
            <p className="text-2xl font-bold text-green-600">₦6.9B</p>
            <p className="text-xs text-gray-400 mt-1">Value at Risk</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-500">Limit Breaches</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{limitBreaches.length}</p>
            <p className="text-xs text-gray-400 mt-1">Counterparties</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-500">Risk Score</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">68.5</p>
            <p className="text-xs text-gray-400 mt-1">Composite score</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Desk Exposure vs Limits</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deskExposure}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="desk" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}B`} />
              <Tooltip formatter={(value: any) => [`₦${(value / 1000).toFixed(2)}B`, '']} />
              <Legend />
              <Bar dataKey="exposure" fill="#1e3a5f" name="Exposure" />
              <Bar dataKey="limit" fill="#e0e0e0" name="Limit" />
              <Bar dataKey="var" fill="#e74c3c" name="VaR" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Score History (30 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={riskScoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="score" stroke="#f39c12" strokeWidth={2} name="Risk Score" dot={false} />
                <Line type="monotone" dataKey="threshold" stroke="#e74c3c" strokeWidth={2} strokeDasharray="5 5" name="Threshold" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Exposure Forecast (14 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={exposureForecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}B`} />
                <Tooltip formatter={(value: any) => [`₦${(value / 1000).toFixed(1)}B`, '']} />
                <Legend />
                <Line type="monotone" dataKey="forecast" stroke="#4a90e2" strokeWidth={2} name="Forecast" dot={false} />
                <Line type="monotone" dataKey="current" stroke="#27ae60" strokeWidth={2} name="Current" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Limit Monitoring - High Utilization</h3>
          <div className="space-y-3">
            {limitBreaches.map(cp => (
              <div key={cp.counterparty_id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{cp.short_name}</p>
                  <p className="text-sm text-gray-600">Exposure: ₦{(cp.exposure_ngn / 1000000).toFixed(0)}M</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">{cp.utilization_percentage.toFixed(0)}%</p>
                  <p className="text-xs text-gray-500">Limit utilization</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
