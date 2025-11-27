import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { liquidityData } from '../../data/dummyData';
import { DollarSign, TrendingUp, AlertCircle, Activity } from 'lucide-react';

export default function LiquidityModule() {
  const last30Days = liquidityData.slice(-30);

  const inflowOutflowData = last30Days.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    inflows: d.inflows_ngn / 1000000000,
    outflows: d.outflows_ngn / 1000000000,
  }));

  const forecastData = liquidityData.slice(-14).map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    actual: d.closing_balance_ngn / 1000000000,
    forecast_7d: d.predicted_7d_balance_ngn / 1000000000,
    forecast_14d: d.predicted_14d_balance_ngn / 1000000000,
  }));

  const stressScenarios = [
    { scenario: 'Base Case', balance: 26300, buffer: 31.5, status: 'Normal' },
    { scenario: 'Mild Stress', balance: 23500, buffer: 17.5, status: 'Warning' },
    { scenario: 'Moderate Stress', balance: 21200, buffer: 6.0, status: 'Alert' },
    { scenario: 'Severe Stress', balance: 19500, buffer: -2.5, status: 'Critical' },
  ];

  const majorFlows = [
    { type: 'Inflow', source: 'CBN Settlement', amount: 5000, date: '2025-11-26' },
    { type: 'Inflow', source: 'FX Proceeds', amount: 3200, date: '2025-11-27' },
    { type: 'Outflow', source: 'Debt Service', amount: 3000, date: '2025-11-28' },
    { type: 'Outflow', source: 'Operating Expenses', amount: 1500, date: '2025-11-29' },
    { type: 'Inflow', source: 'MM Maturity', amount: 2800, date: '2025-11-30' },
  ];

  const currentLiquidity = liquidityData[liquidityData.length - 1];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Liquidity Module</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time liquidity monitoring and forecasting</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Current Balance</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₦{(currentLiquidity.closing_balance_ngn / 1000000000).toFixed(1)}B
            </p>
            <p className="text-xs text-gray-400 mt-1">NGN position</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">Buffer</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {currentLiquidity.buffer_percentage_ngn.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Above reserves</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-500">Liquidity Ratio</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {currentLiquidity.liquidity_ratio.toFixed(2)}x
            </p>
            <p className="text-xs text-gray-400 mt-1">Coverage ratio</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-500">Alert Status</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {liquidityData.filter(d => d.liquidity_alert_status !== 'Normal').length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Alerts (90 days)</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Liquidity Position (90 Days)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={liquidityData.map(d => ({
              date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              balance: d.closing_balance_ngn / 1000000000,
              reserves: d.required_reserves_ngn / 1000000000,
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}B`} />
              <Tooltip formatter={(value: any) => [`₦${value.toFixed(2)}B`, '']} />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#1e3a5f" strokeWidth={2} name="Balance" dot={false} />
              <Line type="monotone" dataKey="reserves" stroke="#e74c3c" strokeWidth={2} strokeDasharray="5 5" name="Required Reserves" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inflows vs Outflows (30 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={inflowOutflowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}B`} />
                <Tooltip formatter={(value: any) => [`₦${value.toFixed(2)}B`, '']} />
                <Legend />
                <Bar dataKey="inflows" fill="#27ae60" name="Inflows" />
                <Bar dataKey="outflows" fill="#e74c3c" name="Outflows" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Liquidity Forecast (14 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}B`} />
                <Tooltip formatter={(value: any) => [`₦${value.toFixed(2)}B`, '']} />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#1e3a5f" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="forecast_7d" stroke="#4a90e2" strokeWidth={2} strokeDasharray="5 5" name="7D Forecast" />
                <Line type="monotone" dataKey="forecast_14d" stroke="#f39c12" strokeWidth={2} strokeDasharray="3 3" name="14D Forecast" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Test Results</h3>
          <div className="space-y-3">
            {stressScenarios.map((scenario, idx) => (
              <div key={idx} className={`flex items-center justify-between p-4 rounded-lg border ${
                scenario.status === 'Normal' ? 'bg-green-50 border-green-200' :
                scenario.status === 'Warning' ? 'bg-yellow-50 border-yellow-200' :
                scenario.status === 'Alert' ? 'bg-orange-50 border-orange-200' :
                'bg-red-50 border-red-200'
              }`}>
                <div>
                  <p className="font-semibold text-gray-900">{scenario.scenario}</p>
                  <p className="text-sm text-gray-600">Balance: ₦{(scenario.balance / 1000).toFixed(1)}B</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${
                    scenario.status === 'Normal' ? 'text-green-600' :
                    scenario.status === 'Warning' ? 'text-yellow-600' :
                    scenario.status === 'Alert' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {scenario.buffer > 0 ? '+' : ''}{scenario.buffer.toFixed(1)}%
                  </p>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    scenario.status === 'Normal' ? 'bg-green-100 text-green-800' :
                    scenario.status === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                    scenario.status === 'Alert' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {scenario.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Major Expected Flows (Next 5 Days)</h3>
          <div className="space-y-2">
            {majorFlows.map((flow, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    flow.type === 'Inflow' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {flow.type}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{flow.source}</p>
                    <p className="text-xs text-gray-500">{flow.date}</p>
                  </div>
                </div>
                <p className={`text-lg font-bold ${
                  flow.type === 'Inflow' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {flow.type === 'Inflow' ? '+' : '-'}₦{(flow.amount / 1000).toFixed(1)}B
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
