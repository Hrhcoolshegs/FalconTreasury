import { useState } from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Target, Award, Filter, Search, X, ChevronRight, Calendar } from 'lucide-react';
import { insightsData, Insight } from '../../data/insightsData';
import { format } from 'date-fns';

export default function InsightsModule() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const types = ['all', 'alert', 'opportunity', 'recommendation', 'insight', 'achievement'];
  const priorities = ['all', 'high', 'medium', 'low'];
  const categories = ['all', ...Array.from(new Set(insightsData.map(i => i.category)))];

  const filteredInsights = insightsData.filter(insight => {
    const matchesType = selectedType === 'all' || insight.type === selectedType;
    const matchesPriority = selectedPriority === 'all' || insight.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'all' || insight.category === selectedCategory;
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesPriority && matchesCategory && matchesSearch;
  });

  const getTypeConfig = (type: string) => {
    const configs = {
      alert: { color: 'red', icon: AlertTriangle, bg: 'from-red-500 to-red-600', badge: 'bg-red-100 text-red-700' },
      opportunity: { color: 'green', icon: TrendingUp, bg: 'from-green-500 to-green-600', badge: 'bg-green-100 text-green-700' },
      recommendation: { color: 'blue', icon: Target, bg: 'from-blue-500 to-blue-600', badge: 'bg-blue-100 text-blue-700' },
      insight: { color: 'purple', icon: Lightbulb, bg: 'from-purple-500 to-purple-600', badge: 'bg-purple-100 text-purple-700' },
      achievement: { color: 'yellow', icon: Award, bg: 'from-yellow-500 to-yellow-600', badge: 'bg-yellow-100 text-yellow-700' },
    };
    return configs[type as keyof typeof configs] || configs.insight;
  };

  const getPriorityConfig = (priority: string) => {
    const configs = {
      high: { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
      medium: { color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
      low: { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
    };
    return configs[priority as keyof typeof configs] || configs.medium;
  };

  const stats = {
    total: insightsData.length,
    alerts: insightsData.filter(i => i.type === 'alert').length,
    opportunities: insightsData.filter(i => i.type === 'opportunity').length,
    highPriority: insightsData.filter(i => i.priority === 'high').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Insights Feed</h1>
                <p className="text-sm text-gray-500 mt-1">AI-powered intelligence and recommendations</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md p-6 border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600 font-medium">Total Insights</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-1">Across all categories</p>
          </div>

          <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-md p-6 border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-600 font-medium">Active Alerts</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.alerts}</p>
            <p className="text-xs text-gray-500 mt-1">Requiring attention</p>
          </div>

          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md p-6 border border-green-100">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600 font-medium">Opportunities</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.opportunities}</p>
            <p className="text-xs text-gray-500 mt-1">Revenue potential</p>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-md p-6 border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600 font-medium">High Priority</span>
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats.highPriority}</p>
            <p className="text-xs text-gray-500 mt-1">Immediate action</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search insights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priorities' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredInsights.map((insight) => {
            const typeConfig = getTypeConfig(insight.type);
            const priorityConfig = getPriorityConfig(insight.priority);
            const Icon = typeConfig.icon;

            return (
              <div
                key={insight.id}
                onClick={() => setSelectedInsight(insight)}
                className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
              >
                <div className={`h-1 bg-gradient-to-r ${typeConfig.bg}`} />
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 bg-gradient-to-br ${typeConfig.bg} rounded-lg shadow-md group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${typeConfig.badge}`}>
                              {insight.type.toUpperCase()}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${priorityConfig.bg} ${priorityConfig.color}`}>
                              {insight.priority.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {insight.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{insight.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{insight.timestamp}</span>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 group-hover:text-gray-600 transition-colors" />
                      </div>

                      {insight.metrics && (
                        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                          {insight.metrics.map((metric, idx) => (
                            <div key={idx} className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                                {metric.change && (
                                  <span className={`text-xs font-semibold ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {metric.change}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {insight.actions && (
                        <div className="flex gap-2 mt-4">
                          {insight.actions.map((action, idx) => (
                            <button
                              key={idx}
                              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                                action.type === 'primary'
                                  ? `bg-gradient-to-r ${typeConfig.bg} text-white hover:opacity-90`
                                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredInsights.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No insights found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>

      {selectedInsight && (
        <InsightDetailModal
          insight={selectedInsight}
          onClose={() => setSelectedInsight(null)}
        />
      )}
    </div>
  );
}

function InsightDetailModal({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  const typeConfig = getTypeConfig(insight.type);
  const priorityConfig = getPriorityConfig(insight.priority);
  const Icon = typeConfig.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className={`sticky top-0 bg-gradient-to-r ${typeConfig.bg} text-white p-6 flex items-center justify-between rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                  {insight.type.toUpperCase()}
                </span>
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                  {insight.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <h2 className="text-xl font-bold">{insight.title}</h2>
              <p className="text-sm text-white/80 mt-1">{insight.category}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{insight.description}</p>
          </section>

          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact</h3>
            <p className="text-gray-700 leading-relaxed">{insight.impact}</p>
          </section>

          {insight.metrics && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insight.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      {metric.change && (
                        <span className={`text-sm font-semibold ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.change}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span>{insight.timestamp}</span>
            </div>
          </section>

          {insight.actions && (
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Actions</h3>
              <div className="flex gap-3">
                {insight.actions.map((action, idx) => (
                  <button
                    key={idx}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      action.type === 'primary'
                        ? `bg-gradient-to-r ${typeConfig.bg} text-white hover:opacity-90 shadow-md`
                        : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function getTypeConfig(type: string) {
  const configs = {
    alert: { color: 'red', icon: AlertTriangle, bg: 'from-red-500 to-red-600', badge: 'bg-red-100 text-red-700' },
    opportunity: { color: 'green', icon: TrendingUp, bg: 'from-green-500 to-green-600', badge: 'bg-green-100 text-green-700' },
    recommendation: { color: 'blue', icon: Target, bg: 'from-blue-500 to-blue-600', badge: 'bg-blue-100 text-blue-700' },
    insight: { color: 'purple', icon: Lightbulb, bg: 'from-purple-500 to-purple-600', badge: 'bg-purple-100 text-purple-700' },
    achievement: { color: 'yellow', icon: Award, bg: 'from-yellow-500 to-yellow-600', badge: 'bg-yellow-100 text-yellow-700' },
  };
  return configs[type as keyof typeof configs] || configs.insight;
}

function getPriorityConfig(priority: string) {
  const configs = {
    high: { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
    medium: { color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    low: { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
  };
  return configs[priority as keyof typeof configs] || configs.medium;
}
