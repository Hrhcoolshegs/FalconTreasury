import { AlertTriangle, Shield, TrendingUp, Activity } from 'lucide-react';
import { allCounterparties, insights } from '../../data/dummyData';

export default function RiskAlerts() {
  const riskMetrics = {
    composite: 42,
    credit: 35,
    market: 48,
    liquidity: 28,
    operational: 52,
  };

  const getRiskColor = (score: number) => {
    if (score < 26) return { bg: 'bg-green-100', text: 'text-green-800', label: 'Low' };
    if (score < 51) return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' };
    if (score < 76) return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' };
    return { bg: 'bg-red-100', text: 'text-red-800', label: 'Critical' };
  };

  const limitBreaches = allCounterparties.filter(cp => cp.utilization_percentage > 90);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Risk & Alerts</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive risk monitoring and alerting</p>
      </div>

      {/* Composite Risk Score */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Composite Risk Score</h3>
            <p className="text-sm text-gray-500">Overall risk assessment (0-100)</p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${getRiskColor(riskMetrics.composite).bg} ${getRiskColor(riskMetrics.composite).text} font-semibold`}>
            {getRiskColor(riskMetrics.composite).label}
          </div>
        </div>
        <div className="relative pt-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-5xl font-bold text-gray-900">{riskMetrics.composite}</span>
            <span className="text-sm text-gray-500">out of 100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${riskMetrics.composite}%` }}
            />
          </div>
        </div>
      </div>

      {/* Risk Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RiskCard
          icon={Shield}
          label="Credit Risk"
          score={riskMetrics.credit}
          trend="-2 pts"
          color="blue"
        />
        <RiskCard
          icon={TrendingUp}
          label="Market Risk"
          score={riskMetrics.market}
          trend="+5 pts"
          color="orange"
        />
        <RiskCard
          icon={Activity}
          label="Liquidity Risk"
          score={riskMetrics.liquidity}
          trend="-3 pts"
          color="green"
        />
        <RiskCard
          icon={AlertTriangle}
          label="Operational Risk"
          score={riskMetrics.operational}
          trend="+8 pts"
          color="red"
        />
      </div>

      {/* Limit Breaches */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Limit Breaches</h3>
          <span className="ml-auto bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {limitBreaches.length} Active
          </span>
        </div>
        <div className="space-y-2">
          {limitBreaches.map(cp => (
            <div key={cp.counterparty_id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="font-semibold text-gray-900">{cp.name}</p>
                <p className="text-sm text-gray-600">
                  ₦{(cp.exposure_ngn / 1000000000).toFixed(2)}B / ₦{(cp.exposure_limit_ngn / 1000000000).toFixed(2)}B
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{cp.utilization_percentage}%</p>
                <button className="text-sm text-red-700 hover:text-red-900 font-medium">Take Action →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Risk Alerts</h3>
        <div className="space-y-3">
          {insights.filter(i => i.category === 'Risk' || i.severity === 'Critical').map(insight => (
            <div key={insight.insight_id} className="border-l-4 border-red-500 pl-4 py-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{insight.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{insight.recommended_action}</p>
                </div>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                  {insight.severity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskCard({ icon: Icon, label, score, trend, color }: any) {
  const riskLevel = getRiskLevel(score);
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-3xl font-bold text-gray-900">{score}</p>
        <span className={`text-sm ${trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>{trend}</span>
      </div>
      <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${riskLevel.className}`}>
        {riskLevel.label}
      </div>
    </div>
  );
}

function getRiskLevel(score: number) {
  if (score < 26) return { label: 'Low', className: 'bg-green-100 text-green-800' };
  if (score < 51) return { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' };
  if (score < 76) return { label: 'High', className: 'bg-orange-100 text-orange-800' };
  return { label: 'Critical', className: 'bg-red-100 text-red-800' };
}
