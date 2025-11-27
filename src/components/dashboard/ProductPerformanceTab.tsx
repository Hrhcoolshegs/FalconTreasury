import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { productPerformance } from '../../data/dummyData';
import { DollarSign, TrendingUp, Activity, Award, Sparkles } from 'lucide-react';

export default function ProductPerformanceTab() {
  const totalPnL = productPerformance.reduce((sum, p) => sum + p.pnl_total_ngn, 0);
  const totalRevenue = productPerformance.reduce((sum, p) => sum + p.revenue_ngn, 0);
  const totalTrades = productPerformance.reduce((sum, p) => sum + p.trade_count, 0);
  const avgSettlement = (productPerformance.reduce((sum, p) => sum + p.settlement_success_rate, 0) / productPerformance.length);

  const pnlChartData = productPerformance.map(p => ({
    product: p.product_type,
    realized: p.pnl_realized_ngn / 1000000,
    unrealized: p.pnl_unrealized_ngn / 1000000,
    total: p.pnl_total_ngn / 1000000,
  }));

  const volumeChartData = productPerformance.map(p => ({
    product: p.product_type,
    volume: p.trade_volume_ngn / 1000000000,
    trades: p.trade_count,
    avgSize: p.avg_trade_size_ngn / 1000000,
  }));

  const profitabilityData = productPerformance.map(p => ({
    product: p.product_type,
    ratio: p.profitability_ratio,
    marketShare: p.market_share_estimate,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Performance</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive product-level analytics and P&L</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Total P&L</span>
          </div>
          <p className="text-2xl font-bold text-green-600">₦{(totalPnL / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-400 mt-1">Across all products</p>
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
          <p className="text-xs text-gray-400 mt-1">Trades executed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Settlement Rate</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{avgSettlement.toFixed(1)}%</p>
          <p className="text-xs text-gray-400 mt-1">Average success rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">P&L by Product</h3>
              <p className="text-sm text-gray-500">Realized vs unrealized</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pnlChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="product" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}M`} />
              <Tooltip formatter={(value: any) => [`₦${value.toFixed(1)}M`, '']} />
              <Legend />
              <Bar dataKey="realized" fill="#27ae60" name="Realized P&L" />
              <Bar dataKey="unrealized" fill="#4a90e2" name="Unrealized P&L" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Volume by Product</h3>
              <p className="text-sm text-gray-500">Trading volume (₦B)</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="product" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}B`} />
              <Tooltip formatter={(value: any) => [`₦${value.toFixed(2)}B`, '']} />
              <Legend />
              <Bar dataKey="volume" fill="#1e3a5f" name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Metrics Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Trades</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Volume (₦B)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">P&L (₦M)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Revenue (₦M)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Profit Ratio</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Settlement %</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Market Share</th>
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
                  <td className="text-right py-3 px-4 font-semibold text-green-600">
                    ₦{(product.pnl_total_ngn / 1000000).toFixed(1)}M
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600">
                    ₦{(product.revenue_ngn / 1000000).toFixed(1)}M
                  </td>
                  <td className="text-right py-3 px-4 font-medium text-blue-600">
                    {product.profitability_ratio.toFixed(2)}x
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600">
                    {product.settlement_success_rate.toFixed(1)}%
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600">
                    {product.market_share_estimate.toFixed(1)}%
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="py-3 px-4 text-gray-900">Total</td>
                <td className="text-right py-3 px-4 text-gray-900">{totalTrades}</td>
                <td className="text-right py-3 px-4 text-gray-900">
                  ₦{(productPerformance.reduce((sum, p) => sum + p.trade_volume_ngn, 0) / 1000000000).toFixed(2)}B
                </td>
                <td className="text-right py-3 px-4 text-green-600">
                  ₦{(totalPnL / 1000000).toFixed(1)}M
                </td>
                <td className="text-right py-3 px-4 text-gray-900">
                  ₦{(totalRevenue / 1000000).toFixed(1)}M
                </td>
                <td className="text-right py-3 px-4 text-gray-900">-</td>
                <td className="text-right py-3 px-4 text-gray-900">{avgSettlement.toFixed(1)}%</td>
                <td className="text-right py-3 px-4 text-gray-900">-</td>
              </tr>
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
                <span className="text-xs text-gray-500">Avg Size</span>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
