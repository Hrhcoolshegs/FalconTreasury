import { insights } from '../../data/dummyData';
import { AlertTriangle, TrendingUp, Users, Sparkles, CheckCircle, Clock, ArrowRight } from 'lucide-react';

export default function OperationalInsights() {
  const insightsByCategory = {
    Risk: insights.filter(i => i.category === 'Risk'),
    Settlement: insights.filter(i => i.category === 'Settlement'),
    Counterparty: insights.filter(i => i.category === 'Counterparty'),
    Liquidity: insights.filter(i => i.category === 'Liquidity'),
  };

  const insightsBySeverity = {
    Critical: insights.filter(i => i.severity === 'Critical'),
    High: insights.filter(i => i.severity === 'High'),
    Medium: insights.filter(i => i.severity === 'Medium'),
    Low: insights.filter(i => i.severity === 'Low'),
  };

  const activeInsights = insights.filter(i => i.status === 'Active');
  const resolvedInsights = insights.filter(i => i.status === 'Resolved');
  const acknowledgedInsights = insights.filter(i => i.acknowledged_by !== null);

  const totalFinancialImpact = insights.reduce((sum, i) => sum + i.financial_impact_ngn, 0);
  const totalROIEstimate = insights.reduce((sum, i) => sum + i.roi_estimate_ngn, 0);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Risk':
        return AlertTriangle;
      case 'Settlement':
        return Clock;
      case 'Counterparty':
        return Users;
      case 'Liquidity':
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Operational Insight Center</h1>
        <p className="text-sm text-gray-500 mt-1">AI-powered alerts, recommendations, and actionable intelligence</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-500">Active Insights</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{activeInsights.length}</p>
          <p className="text-xs text-gray-400 mt-1">Requiring attention</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Resolved</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{resolvedInsights.length}</p>
          <p className="text-xs text-gray-400 mt-1">Successfully addressed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">ROI Potential</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">₦{(totalROIEstimate / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-400 mt-1">Estimated savings</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-500">Financial Impact</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">₦{(totalFinancialImpact / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-gray-400 mt-1">Total exposure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(insightsByCategory).map(([category, items]) => {
          const Icon = getCategoryIcon(category);
          return (
            <div key={category} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-900">{category}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{items.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {items.filter(i => i.severity === 'Critical' || i.severity === 'High').length} high priority
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Severity Breakdown</h3>
            <p className="text-sm text-gray-500">Insights by priority level</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(insightsBySeverity).map(([severity, items]) => (
            <div key={severity} className={`border-2 rounded-lg p-4 ${getSeverityColor(severity)}`}>
              <p className="text-sm font-semibold mb-1">{severity}</p>
              <p className="text-3xl font-bold">{items.length}</p>
              <p className="text-xs mt-2">
                {items.filter(i => i.status === 'Active').length} active
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Active Insights Feed</h3>
            <p className="text-sm text-gray-500">Real-time operational intelligence</p>
          </div>
          <button className="text-sm text-[#1e3a5f] hover:text-[#2d5a8f] font-medium">
            View All →
          </button>
        </div>
        <div className="space-y-3">
          {activeInsights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium">No active insights</p>
              <p className="text-xs">All critical items have been addressed</p>
            </div>
          ) : (
            activeInsights.map((insight) => (
              <div
                key={insight.insight_id}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#1e3a5f] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(insight.severity)}`}>
                    {insight.severity}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded whitespace-nowrap ml-2">
                        {insight.category}
                      </span>
                    </div>

                    {insight.affected_counterparties.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-500">
                          Affected: {insight.affected_counterparties.slice(0, 3).join(', ')}
                          {insight.affected_counterparties.length > 3 && ` +${insight.affected_counterparties.length - 3} more`}
                        </p>
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Recommended Action</p>
                      <p className="text-sm text-blue-800">{insight.recommended_action}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{new Date(insight.created_timestamp).toLocaleString()}</span>
                        {insight.financial_impact_ngn > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-red-600 font-medium">
                              Impact: ₦{(insight.financial_impact_ngn / 1000000).toFixed(1)}M
                            </span>
                          </>
                        )}
                        {insight.roi_estimate_ngn > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              ROI: ₦{(insight.roi_estimate_ngn / 1000000).toFixed(1)}M
                            </span>
                          </>
                        )}
                      </div>
                      <button className="flex items-center gap-1 text-sm text-[#1e3a5f] hover:text-[#2d5a8f] font-medium">
                        {insight.action_button_label}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Impact Insights</h3>
          <div className="space-y-3">
            {[...insights]
              .filter(i => i.financial_impact_ngn > 0)
              .sort((a, b) => b.financial_impact_ngn - a.financial_impact_ngn)
              .slice(0, 5)
              .map((insight) => (
                <div key={insight.insight_id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{insight.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{insight.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">
                      ₦{(insight.financial_impact_ngn / 1000000).toFixed(1)}M
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(insight.severity)}`}>
                      {insight.severity}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top ROI Opportunities</h3>
          <div className="space-y-3">
            {[...insights]
              .filter(i => i.roi_estimate_ngn > 0)
              .sort((a, b) => b.roi_estimate_ngn - a.roi_estimate_ngn)
              .slice(0, 5)
              .map((insight) => (
                <div key={insight.insight_id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{insight.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{insight.risk_reduction_estimate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      ₦{(insight.roi_estimate_ngn / 1000000).toFixed(1)}M
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(insight.severity)}`}>
                      {insight.severity}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
