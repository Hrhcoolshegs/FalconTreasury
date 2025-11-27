import { allCounterparties } from '../../data/dummyData';
import { Users, TrendingDown, PieChart as PieIcon, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function CounterpartySummary() {
  const topByExposure = [...allCounterparties].sort((a, b) => b.exposure_ngn - a.exposure_ngn).slice(0, 10);
  const unreliable = [...allCounterparties].sort((a, b) => a.settlement_reliability - b.settlement_reliability).slice(0, 10);

  const sectorData = allCounterparties.reduce((acc, cp) => {
    acc[cp.sector] = (acc[cp.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sectorChartData = Object.entries(sectorData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#1e3a5f', '#4a90e2', '#f39c12', '#27ae60', '#e74c3c'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Counterparty Intelligence</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive counterparty analysis and monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Counterparties</p>
              <p className="text-2xl font-bold text-gray-900">{allCounterparties.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-sm text-gray-500">High Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {allCounterparties.filter(cp => cp.risk_category === 'High').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <PieIcon className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Active Relationships</p>
              <p className="text-2xl font-bold text-green-600">
                {allCounterparties.filter(cp => cp.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top by Exposure */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 by Exposure</h3>
          <div className="space-y-2">
            {topByExposure.map((cp, idx) => (
              <div key={cp.counterparty_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{cp.short_name}</p>
                    <p className="text-xs text-gray-500">{cp.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₦{(cp.exposure_ngn / 1000000000).toFixed(2)}B</p>
                  <p className="text-xs text-gray-500">{cp.utilization_percentage}% utilized</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top by Unreliability */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 10 by Settlement Delays</h3>
          <div className="space-y-2">
            {unreliable.map((cp, idx) => (
              <div key={cp.counterparty_id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400 w-6">{idx + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{cp.short_name}</p>
                    <p className="text-xs text-gray-500">{cp.sector}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{cp.settlement_reliability.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">reliability</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Distribution */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Distribution</h3>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5a8f] transition-colors font-medium">
          Go to Counterparty Intelligence Module
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
