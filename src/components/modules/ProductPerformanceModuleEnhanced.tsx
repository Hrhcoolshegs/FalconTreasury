import { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { productPerformance } from '../../data/dummyData';
import { DollarSign, TrendingUp, Award, Activity, HelpCircle, X, AlertCircle, Target, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export default function ProductPerformanceModuleEnhanced() {
  const [showExplainer, setShowExplainer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Performance Module</h1>
                <p className="text-sm text-gray-500 mt-1">Comprehensive product-level P&L and market analysis</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowExplainer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">How This Works</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">What You're Seeing</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This module tracks profit & loss (P&L) for each product line—FX Spot, FX Forward, Money Market, T-Bills, and Bonds.
                Each product's profitability, trade volume, market share, and operational metrics are analyzed to help you identify
                top performers and optimize your product mix. Click on any product card for detailed analytics.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Total P&L</span>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">₦{(totalPnL / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500">Across all products</p>
            <div className="mt-3 pt-3 border-t border-green-100">
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-green-600">+12.3%</span> vs last period
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-6 border border-blue-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Total Revenue</span>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500">Daily revenue stream</p>
            <div className="mt-3 pt-3 border-t border-blue-100">
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-blue-600">+8.7%</span> vs last period
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-md p-6 border border-orange-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Total Trades</span>
            </div>
            <p className="text-3xl font-bold text-orange-600 mb-1">{totalTrades}</p>
            <p className="text-xs text-gray-500">Successfully executed</p>
            <div className="mt-3 pt-3 border-t border-orange-100">
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-orange-600">+15.2%</span> vs last period
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">Avg Margin</span>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-1">
              {((totalPnL / totalRevenue) * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">Profit margin</p>
            <div className="mt-3 pt-3 border-t border-purple-100">
              <p className="text-xs text-gray-600">
                <span className="font-semibold text-purple-600">+3.1%</span> vs last period
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">P&L Trend by Product (12 Months)</h3>
                <p className="text-xs text-gray-500 mt-0.5">Track performance trends across all product lines</p>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={performanceTrend}>
              <defs>
                <linearGradient id="colorFXSpot" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorFXForward" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4a90e2" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4a90e2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27ae60" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#27ae60" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value: any) => [`₦${(value / 1000000).toFixed(1)}M`, '']} />
              <Legend />
              <Area type="monotone" dataKey="MM" stroke="#27ae60" fillOpacity={1} fill="url(#colorMM)" name="Money Market" />
              <Area type="monotone" dataKey="FXForward" stroke="#4a90e2" fillOpacity={1} fill="url(#colorFXForward)" name="FX Forward" />
              <Area type="monotone" dataKey="FXSpot" stroke="#1e3a5f" fillOpacity={1} fill="url(#colorFXSpot)" name="FX Spot" />
              <Line type="monotone" dataKey="TBills" stroke="#f39c12" strokeWidth={2} name="T-Bills" dot={false} />
              <Line type="monotone" dataKey="Bonds" stroke="#e74c3c" strokeWidth={2} name="Bonds" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <PieChartIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Market Share Estimation</h3>
                <p className="text-xs text-gray-500 mt-0.5">Estimated share of total market activity</p>
              </div>
            </div>
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

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Profitability Ratios</h3>
                <p className="text-xs text-gray-500 mt-0.5">Efficiency of profit generation by product</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="product" tick={{ fontSize: 11 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip />
                <Legend />
                <Bar dataKey="ratio" fill="#1e3a5f" name="Profitability Ratio" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Product Metrics</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Trades</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Volume (₦B)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Revenue (₦M)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">P&L (₦M)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Margin %</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Market Share</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Settlement %</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {productPerformance.map((product) => (
                  <tr key={product.product_type} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-colors">
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
                    <td className="text-center py-3 px-4">
                      <button
                        onClick={() => setSelectedProduct(product.product_type)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {productPerformance.map((product) => (
            <div
              key={product.product_type}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-4 border border-gray-200 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
              onClick={() => setSelectedProduct(product.product_type)}
            >
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

      {showExplainer && <ExplainerModal onClose={() => setShowExplainer(false)} />}
      {selectedProduct && (
        <ProductDrawer
          product={productPerformance.find(p => p.product_type === selectedProduct)!}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function ExplainerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Product Performance Explained</h2>
              <p className="text-sm text-blue-100 mt-1">Understanding your product analytics</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Key Metrics Overview
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Total P&L (Profit & Loss)</p>
                <p>The net profit generated across all product lines. This is calculated as revenue minus costs and represents your bottom-line performance.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Profit Margin</p>
                <p>The percentage of revenue that becomes profit. Higher margins indicate more efficient operations and better pricing strategies.</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Profitability Ratio</p>
                <p>A multiplier showing how many times your costs are covered by profits. A ratio of 2.5x means you're making ₦2.50 in profit for every ₦1.00 in costs.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Product Analysis
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="font-semibold text-gray-900 mb-2">FX Spot</p>
                <p>Immediate foreign exchange transactions. Typically high-volume, lower-margin products with fast settlement.</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="font-semibold text-gray-900 mb-2">Money Market</p>
                <p>Short-term lending and borrowing. Usually generates consistent revenue with moderate risk.</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="font-semibold text-gray-900 mb-2">T-Bills & Bonds</p>
                <p>Government securities trading. Lower risk, steady returns, important for liquidity management.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              How to Use This Data
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Identify Top Performers:</strong> Focus resources on high-margin, high-volume products</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Optimize Product Mix:</strong> Balance your portfolio based on profitability and risk</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Monitor Trends:</strong> Watch the 12-month chart for seasonal patterns or emerging issues</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Settlement Performance:</strong> High settlement success rates indicate operational excellence</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Market Share:</strong> Compare your position against competitors to identify growth opportunities</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProductDrawer({ product, onClose }: { product: any; onClose: () => void }) {
  const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short' });
    return {
      month,
      pnl: product.pnl_total_ngn * (0.8 + Math.random() * 0.4) / 12,
      volume: product.trade_volume_ngn * (0.8 + Math.random() * 0.4) / 12,
      trades: Math.floor(product.trade_count * (0.8 + Math.random() * 0.4) / 12),
    };
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-4xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{product.product_type} - Detailed Analytics</h2>
            <p className="text-sm text-blue-100 mt-1">Comprehensive performance insights</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">Total P&L</p>
              <p className="text-2xl font-bold text-green-700">₦{(product.pnl_total_ngn / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-green-600 mt-2">+{((product.pnl_total_ngn / product.revenue_ngn) * 100).toFixed(1)}% margin</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">Trade Volume</p>
              <p className="text-2xl font-bold text-blue-700">₦{(product.trade_volume_ngn / 1000000000).toFixed(2)}B</p>
              <p className="text-xs text-blue-600 mt-2">{product.trade_count} trades executed</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">Profitability Ratio</p>
              <p className="text-2xl font-bold text-purple-700">{product.profitability_ratio.toFixed(2)}x</p>
              <p className="text-xs text-purple-600 mt-2">Revenue per cost unit</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">12-Month P&L Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27ae60" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#27ae60" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value: any) => [`₦${(value / 1000000).toFixed(2)}M`, '']} />
                <Area type="monotone" dataKey="pnl" stroke="#27ae60" fillOpacity={1} fill="url(#colorPnL)" name="P&L" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Volume Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#999" tickFormatter={(v) => `₦${(v / 1000000000).toFixed(1)}B`} />
                  <Tooltip formatter={(value: any) => [`₦${(value / 1000000000).toFixed(2)}B`, '']} />
                  <Line type="monotone" dataKey="volume" stroke="#4a90e2" strokeWidth={2} name="Volume" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trade Count Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#999" />
                  <Tooltip />
                  <Bar dataKey="trades" fill="#f39c12" name="Trades" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Operational Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Counterparties</p>
                <p className="text-2xl font-bold text-gray-900">{product.active_counterparties}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Trade Size</p>
                <p className="text-2xl font-bold text-gray-900">₦{(product.avg_trade_size_ngn / 1000000).toFixed(0)}M</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Settlement Success</p>
                <p className="text-2xl font-bold text-green-600">{product.settlement_success_rate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Confirm Time</p>
                <p className="text-2xl font-bold text-blue-600">{product.confirmation_time_avg.toFixed(1)}h</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="flex gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="p-2 bg-green-100 rounded-lg h-fit">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Strong Performance</p>
                  <p className="text-sm text-gray-700">
                    This product line shows consistent profitability with a {product.profitability_ratio.toFixed(2)}x ratio
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="p-2 bg-blue-100 rounded-lg h-fit">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Settlement Quality</p>
                  <p className="text-sm text-gray-700">
                    {product.settlement_success_rate > 95
                      ? 'Excellent settlement performance with minimal failures'
                      : 'Good settlement performance but room for improvement'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="p-2 bg-purple-100 rounded-lg h-fit">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Market Position</p>
                  <p className="text-sm text-gray-700">
                    Estimated {product.market_share_estimate.toFixed(1)}% market share with {product.active_counterparties} active relationships
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
