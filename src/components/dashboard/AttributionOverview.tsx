import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { productPerformance, allCounterparties } from '../../data/dummyData';
import { DollarSign, TrendingUp, Users, Award, Sparkles } from 'lucide-react';

export default function AttributionOverview() {
  const totalRevenue = productPerformance.reduce((sum, p) => sum + p.revenue_ngn, 0);
  const totalPnL = productPerformance.reduce((sum, p) => sum + p.pnl_total_ngn, 0);

  const revenueByProduct = productPerformance.map(p => ({
    name: p.product_type,
    value: p.revenue_ngn / 1000000,
    pnl: p.pnl_total_ngn / 1000000,
  }));

  const deskAttribution = [
    { desk: 'FX Desk A', revenue: 450000000, pnl: 185000000, trades: 145, counterparties: 18 },
    { desk: 'FX Desk B', revenue: 385000000, pnl: 156000000, trades: 128, counterparties: 15 },
    { desk: 'MM Desk', revenue: 560000000, pnl: 507000000, trades: 96, counterparties: 12 },
    { desk: 'Fixed Income', revenue: 210000000, pnl: 186000000, trades: 45, counterparties: 8 },
  ];

  const topCounterpartiesByRevenue = allCounterparties
    .map(cp => ({
      name: cp.short_name,
      revenue: cp.total_volume_ytd_ngn * 0.015,
      trades: cp.total_trades_ytd,
      exposure: cp.exposure_ngn,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const rmAttribution = [
    { name: 'Aisha Bello', revenue: 420000000, pnl: 165000000, counterparties: 15 },
    { name: 'Olumide Ajayi', revenue: 385000000, pnl: 148000000, counterparties: 12 },
    { name: 'Fatima Hassan', revenue: 355000000, pnl: 132000000, counterparties: 18 },
  ];

  const COLORS = ['#1e3a5f', '#4a90e2', '#f39c12', '#27ae60', '#e74c3c'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue & Attribution</h1>
        <p className="text-sm text-gray-500 mt-1">Revenue attribution by desk, product, counterparty, and RM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Total Revenue</span>
          </div>
          <p className="text-2xl font-bold text-green-600">₦{(totalRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-400 mt-1">Daily total</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Total P&L</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">₦{(totalPnL / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-400 mt-1">Realized + Unrealized</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-500">Active Desks</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{deskAttribution.length}</p>
          <p className="text-xs text-gray-400 mt-1">Contributing desks</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-500">Profit Margin</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {((totalPnL / totalRevenue) * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 mt-1">Overall margin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue by Product</h3>
              <p className="text-sm text-gray-500">Product contribution breakdown</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={revenueByProduct}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ₦${entry.value.toFixed(0)}M`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByProduct.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`₦${value.toFixed(1)}M`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Desk Performance</h3>
              <p className="text-sm text-gray-500">Revenue & P&L by desk</p>
            </div>
            <button className="flex items-center gap-1 text-sm text-[#1e3a5f]">
              <Sparkles className="w-4 h-4" />
              Explain
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deskAttribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="desk" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value: any) => [`₦${(value / 1000000).toFixed(1)}M`, '']} />
              <Legend />
              <Bar dataKey="revenue" fill="#1e3a5f" name="Revenue" />
              <Bar dataKey="pnl" fill="#27ae60" name="P&L" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 Counterparties by Revenue</h3>
        <div className="space-y-2">
          {topCounterpartiesByRevenue.map((cp, idx) => (
            <div key={cp.name} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                <div>
                  <p className="font-medium text-gray-900">{cp.name}</p>
                  <p className="text-xs text-gray-500">{cp.trades} trades YTD</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">₦{(cp.revenue / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-500">Exposure: ₦{(cp.exposure / 1000000).toFixed(0)}M</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship Manager Attribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rmAttribution.map((rm, idx) => (
            <div key={rm.name} className="border border-gray-200 rounded-lg p-4 hover:border-[#1e3a5f] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center font-semibold">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{rm.name}</p>
                  <p className="text-xs text-gray-500">{rm.counterparties} counterparties</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Revenue</span>
                  <span className="text-sm font-bold text-green-600">₦{(rm.revenue / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">P&L</span>
                  <span className="text-sm font-bold text-blue-600">₦{(rm.pnl / 1000000).toFixed(1)}M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Margin</span>
                  <span className="text-sm font-medium text-gray-900">
                    {((rm.pnl / rm.revenue) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Desk Detailed Metrics</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Desk</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Revenue (₦M)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">P&L (₦M)</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Margin %</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Trades</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Counterparties</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900">Avg per Trade</th>
              </tr>
            </thead>
            <tbody>
              {deskAttribution.map((desk) => (
                <tr key={desk.desk} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{desk.desk}</td>
                  <td className="text-right py-3 px-4 text-gray-600">
                    ₦{(desk.revenue / 1000000).toFixed(1)}M
                  </td>
                  <td className="text-right py-3 px-4 font-semibold text-green-600">
                    ₦{(desk.pnl / 1000000).toFixed(1)}M
                  </td>
                  <td className="text-right py-3 px-4 font-medium text-blue-600">
                    {((desk.pnl / desk.revenue) * 100).toFixed(1)}%
                  </td>
                  <td className="text-right py-3 px-4 text-gray-600">{desk.trades}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{desk.counterparties}</td>
                  <td className="text-right py-3 px-4 text-gray-600">
                    ₦{(desk.revenue / desk.trades / 1000000).toFixed(2)}M
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
