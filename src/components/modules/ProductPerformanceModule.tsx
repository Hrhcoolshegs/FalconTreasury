import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { productPerformance } from '../../data/dummyData';
import { DollarSign, TrendingUp, Award, Activity } from 'lucide-react';

export default function ProductPerformanceModule() {
  const totalPnL = productPerformance.reduce((sum, p) => sum + p.pnl_total_ngn, 0);
  const totalRevenue = productPerformance.reduce((sum, p) => sum + p.revenue_ngn, 0);
  const totalTrades = productPerformance.reduce((sum, p) => sum + p.trade_count, 0);

  const performanceTrend = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short' });
    return {
      month,
      FXSpot: 120000000 + Math.random() * 40000000,
      FXForward: 140000000 + Math.random() * 50000000,
      MM: 400000000 + Math.random() * 100000000,
      TBills: 80000000 + Math.random() * 20000000,
      Bonds: 70000000 + Math.random() * 20000000,
    };
  });

  const marketShareData = productPerformance.map(p => ({
    name: p.product_type,
    value: p.market_share_estimate,
  }));

  const profitabilityData = productPerformance.map(p => ({
    product: p.product_type,
    ratio: p.profitability_ratio,
    margin: (p.pnl_total_ngn / p.revenue_ngn) * 100,
  }));

  const COLORS = ['#1e3a5f', '#4a90e2', '#27ae60', '#f39c12', '#e74c3c'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Performance Module</h1>
          <p className="text-sm text-gray-500 mt-1">Comprehensive product-level P&L and market analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">Total P&L</span>
            </div>
            <p className="text-2xl font-bold text-green-600">₦{(totalPnL / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-400 mt-1">All products</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-400 mt-1">Daily revenue</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-500">Total Trades</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{totalTrades}</p>
            <p className="text-xs text-gray-400 mt-1">Executed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-500">Avg Margin</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {((totalPnL / totalRevenue) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Profit margin</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">P&L Trend by Product (12 Months)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value: any) => [`₦${(value / 1000000).toFixed(1)}M`, '']} />
              <Legend />
              <Line type="monotone" dataKey="FXSpot" stroke="#1e3a5f" strokeWidth={2} name="FX Spot" dot={false} />
              <Line type="monotone" dataKey="FXForward" stroke="#4a90e2" strokeWidth={2} name="FX Forward" dot={false} />
              <Line type="monotone" dataKey="MM" stroke="#27ae60" strokeWidth={2} name="Money Market" dot={false} />
              <Line type="monotone" dataKey="TBills" stroke="#f39c12" strokeWidth={2} name="T-Bills" dot={false} />
              <Line type="monotone" dataKey="Bonds" stroke="#e74c3c" strokeWidth={2} name="Bonds" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Share Estimation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={marketShareData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {marketShareData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Ratios</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="product" tick={{ fontSize: 11 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip />
                <Legend />
                <Bar dataKey="ratio" fill="#1e3a5f" name="Profitability Ratio" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Product Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Trades</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Volume (₦B)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Revenue (₦M)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">P&L (₦M)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Margin %</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Market Share</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Settlement %</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.map((product) => (
                  <tr key={product.product_type} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{product.product_type}</td>
                    <td className="text-right py-3 px-4 text-gray-600">{product.trade_count}</td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      ₦{(product.trade_volume_ngn / 1000000000).toFixed(2)}B
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      ₦{(product.revenue_ngn / 1000000).toFixed(1)}M
                    </td>
                    <td className="text-right py-3 px-4 font-semibold text-green-600">
                      ₦{(product.pnl_total_ngn / 1000000).toFixed(1)}M
                    </td>
                    <td className="text-right py-3 px-4 font-medium text-blue-600">
                      {((product.pnl_total_ngn / product.revenue_ngn) * 100).toFixed(1)}%
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      {product.market_share_estimate.toFixed(1)}%
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">
                      {product.settlement_success_rate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {productPerformance.map((product) => (
            <div key={product.product_type} className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-3">{product.product_type}</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Counterparties</span>
                  <span className="text-sm font-medium text-gray-900">{product.active_counterparties}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Avg Trade Size</span>
                  <span className="text-sm font-medium text-gray-900">
                    ₦{(product.avg_trade_size_ngn / 1000000).toFixed(0)}M
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Confirm Time</span>
                  <span className="text-sm font-medium text-gray-900">{product.confirmation_time_avg.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Failures</span>
                  <span className={`text-sm font-medium ${product.settlement_failure_count === 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.settlement_failure_count}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Profitability</span>
                  <span className="text-sm font-medium text-blue-600">{product.profitability_ratio.toFixed(2)}x</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
