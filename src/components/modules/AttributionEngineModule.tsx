import { useState } from 'react';
import { attributionRules } from '../../data/workflowData';
import { Zap, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function AttributionEngineModule() {
  const [selectedRule, setSelectedRule] = useState<string | null>(null);

  const revenueAttribution = [
    { desk: 'FX Desk A', revenue: 450 },
    { desk: 'FX Desk B', revenue: 385 },
    { desk: 'MM Desk', revenue: 560 },
    { desk: 'Fixed Income', revenue: 210 },
  ];

  const rmAttribution = [
    { rm: 'Aisha Bello', pnl: 165, counterparties: 15 },
    { rm: 'Olumide Ajayi', pnl: 148, counterparties: 12 },
    { rm: 'Fatima Hassan', pnl: 132, counterparties: 18 },
  ];

  const productAttribution = [
    { name: 'FX Spot', value: 160 },
    { name: 'FX Forward', value: 187 },
    { name: 'Money Market', value: 507 },
    { name: 'T-Bills', value: 102 },
    { name: 'Bonds', value: 84 },
  ];

  const COLORS = ['#1e3a5f', '#4a90e2', '#27ae60', '#f39c12', '#e74c3c'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attribution Engine</h1>
            <p className="text-sm text-gray-500 mt-1">Define and manage revenue and P&L attribution rules</p>
          </div>
          <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5a8f] flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Rule
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-500">Active Rules</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {attributionRules.filter(r => r.active).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Currently applied</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₦{revenueAttribution.reduce((sum, r) => sum + r.revenue, 0)}M
            </p>
            <p className="text-xs text-gray-400 mt-1">Attributed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Total P&L</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              ₦{productAttribution.reduce((sum, p) => sum + p.value, 0)}M
            </p>
            <p className="text-xs text-gray-400 mt-1">Attributed</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Edit2 className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-500">Categories</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {new Set(attributionRules.map(r => r.category)).size}
            </p>
            <p className="text-xs text-gray-400 mt-1">Attribution types</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Attribution by Desk</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueAttribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="desk" tick={{ fontSize: 11 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}M`} />
                <Tooltip formatter={(value: any) => [`₦${value}M`, '']} />
                <Bar dataKey="revenue" fill="#1e3a5f" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">P&L Attribution by Product</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productAttribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ₦${entry.value}M`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productAttribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`₦${value}M`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">RM Performance Attribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rmAttribution.map((rm) => (
              <div key={rm.rm} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <img src={`https://ui-avatars.com/api/?name=${rm.rm}&size=40`} className="w-10 h-10 rounded-full" alt="" />
                  <div>
                    <p className="font-semibold text-gray-900">{rm.rm}</p>
                    <p className="text-xs text-gray-500">{rm.counterparties} counterparties</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Attributed P&L</span>
                    <span className="text-lg font-bold text-green-600">₦{rm.pnl}M</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(rm.pnl / 165) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attribution Rules</h3>
          <div className="space-y-3">
            {attributionRules.map((rule) => (
              <div
                key={rule.rule_id}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#1e3a5f] hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedRule(rule.rule_id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {rule.category}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                        Priority {rule.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <span>Method: {rule.allocation_method}</span>
                      <span>•</span>
                      <span>Targets: {rule.targets.length}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded-lg" onClick={(e) => { e.stopPropagation(); }}>
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded-lg" onClick={(e) => { e.stopPropagation(); }}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Allocation Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Proportional</h4>
              <p className="text-sm text-gray-600">Allocate based on proportional contribution to the metric</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Fixed</h4>
              <p className="text-sm text-gray-600">Allocate fixed amounts or percentages to targets</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Waterfall</h4>
              <p className="text-sm text-gray-600">Allocate in priority order until targets are satisfied</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Custom</h4>
              <p className="text-sm text-gray-600">Define custom logic and formulas for allocation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
