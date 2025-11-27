import { useState } from 'react';
import { sentimentData, allCounterparties } from '../../data/dummyData';
import { TrendingUp, TrendingDown, Minus, X, HelpCircle, Info, AlertCircle, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

export default function SentimentIntelligenceModuleEnhanced() {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [showExplainer, setShowExplainer] = useState(false);

  const bucketMatrix: Record<string, any[]> = {};
  for (let l = 1; l <= 5; l++) {
    for (let f = 1; f <= 5; f++) {
      const key = `L${l}-F${f}`;
      bucketMatrix[key] = sentimentData.filter(s => s.sentiment_bucket === key);
    }
  }

  const trendCounts = {
    improving: sentimentData.filter(s => s.sentiment_trend_30d === 'Improving').length,
    declining: sentimentData.filter(s => s.sentiment_trend_30d === 'Declining').length,
    stable: sentimentData.filter(s => s.sentiment_trend_30d === 'Stable').length,
  };

  const recommendationCounts = {
    increase: sentimentData.filter(s => s.recommendation === 'Increase Exposure').length,
    reduce: sentimentData.filter(s => s.recommendation === 'Reduce Exposure').length,
    maintain: sentimentData.filter(s => s.recommendation === 'Maintain').length,
    monitor: sentimentData.filter(s => s.recommendation === 'Monitor Closely').length,
  };

  const getBucketColor = (l: number, f: number) => {
    if (l >= 4 && f >= 4) return 'bg-gradient-to-br from-green-500 to-green-600';
    if (l <= 2 || f <= 2) return 'bg-gradient-to-br from-red-500 to-red-600';
    if (l >= 4 || f >= 4) return 'bg-gradient-to-br from-yellow-500 to-yellow-600';
    return 'bg-gradient-to-br from-blue-500 to-blue-600';
  };

  const getBucketTextColor = (l: number, f: number) => {
    return 'text-white';
  };

  const getBucketDescription = (l: number, f: number) => {
    if (l >= 4 && f >= 4) return 'High Performance: Excellent settlement & product fit';
    if (l <= 2 && f <= 2) return 'Low Performance: Poor reliability & weak fit';
    if (l >= 4 && f <= 2) return 'Reliable but Limited Fit: Good settlement, narrow product range';
    if (l <= 2 && f >= 4) return 'Strong Fit but Unreliable: Wide product range, settlement issues';
    if (l === 3 && f === 3) return 'Average Performance: Meets baseline expectations';
    return 'Mixed Performance: Balanced strengths and weaknesses';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sentiment Intelligence</h1>
            <p className="text-base text-gray-600 mt-2">
              Predictive 5×5 Likelihood-Fit Grid with behavioral signals and AI-driven recommendations
            </p>
          </div>
          <button
            onClick={() => setShowExplainer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2a4a7f] transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">How This Works</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Improving</span>
                <p className="text-3xl font-bold text-green-600">{trendCounts.improving}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Sentiment upgraded in last 30 days</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Minus className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Stable</span>
                <p className="text-3xl font-bold text-blue-600">{trendCounts.stable}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">No significant bucket movement</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Declining</span>
                <p className="text-3xl font-bold text-red-600">{trendCounts.declining}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Sentiment downgraded recently</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <span className="text-sm text-gray-500 font-medium">Total CPs</span>
                <p className="text-3xl font-bold text-purple-600">{sentimentData.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">Active counterparties tracked</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding the 5×5 Grid</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold">Likelihood Score (1-5)</span> measures operational reliability: settlement punctuality, confirmation speed, and volume consistency.
                <span className="font-semibold ml-4">Fit Score (1-5)</span> measures strategic alignment: product compatibility, tenor preferences, and exposure capacity.
                High scores in both dimensions (L4-5, F4-5) indicate premium counterparties ideal for increased exposure.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Likelihood × Fit Matrix</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Click any cell to view details</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-4">
                <div className="flex flex-col justify-center items-center w-20">
                  <div className="text-sm font-bold text-gray-700 transform -rotate-90 whitespace-nowrap">
                    ← Fit Score →
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-5 gap-3 mb-3">
                    {[5, 4, 3, 2, 1].map(f => (
                      <div key={f} className="w-32 text-center">
                        <span className="text-sm font-bold text-gray-700">F{f}</span>
                      </div>
                    ))}
                  </div>

                  {[5, 4, 3, 2, 1].map(l => (
                    <div key={l} className="flex items-center gap-3 mb-3">
                      <div className="w-16 text-right">
                        <span className="text-sm font-bold text-gray-700">L{l}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-3">
                        {[5, 4, 3, 2, 1].map(f => {
                          const key = `L${l}-F${f}`;
                          const counterparties = bucketMatrix[key] || [];
                          return (
                            <button
                              key={key}
                              onClick={() => setSelectedBucket(key)}
                              className={`w-32 h-32 rounded-xl ${getBucketColor(l, f)} ${getBucketTextColor(l, f)} font-bold hover:opacity-90 transition-all hover:scale-105 hover:shadow-xl flex flex-col items-center justify-center shadow-md`}
                              title={getBucketDescription(l, f)}
                            >
                              <span className="text-4xl mb-1">{counterparties.length}</span>
                              <span className="text-xs opacity-90">{key}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="text-center mt-6">
                    <span className="text-sm font-bold text-gray-700">← Likelihood Score →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-green-600"></div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Premium</p>
                <p className="text-xs text-gray-600">L4-5, F4-5</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600"></div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Mixed</p>
                <p className="text-xs text-gray-600">High L or F</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600"></div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Average</p>
                <p className="text-xs text-gray-600">L3, F3</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-red-600"></div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Caution</p>
                <p className="text-xs text-gray-600">Low L or F</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Recommendations</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <ArrowUp className="w-5 h-5 text-green-700" />
                  <span className="text-sm font-semibold text-gray-900">Increase Exposure</span>
                </div>
                <span className="text-2xl font-bold text-green-700">{recommendationCounts.increase}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <Minus className="w-5 h-5 text-blue-700" />
                  <span className="text-sm font-semibold text-gray-900">Maintain Current</span>
                </div>
                <span className="text-2xl font-bold text-blue-700">{recommendationCounts.maintain}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-700" />
                  <span className="text-sm font-semibold text-gray-900">Monitor Closely</span>
                </div>
                <span className="text-2xl font-bold text-orange-700">{recommendationCounts.monitor}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-300 shadow-sm">
                <div className="flex items-center gap-3">
                  <ArrowDown className="w-5 h-5 text-red-700" />
                  <span className="text-sm font-semibold text-gray-900">Reduce Exposure</span>
                </div>
                <span className="text-2xl font-bold text-red-700">{recommendationCounts.reduce}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Growth Opportunities</h3>
            <div className="space-y-3">
              {sentimentData
                .filter(s => s.recommendation === 'Increase Exposure')
                .slice(0, 5)
                .map(s => {
                  const cp = allCounterparties.find(c => c.counterparty_id === s.counterparty_id);
                  return (
                    <div key={s.counterparty_id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                      <div>
                        <p className="font-semibold text-gray-900">{cp?.short_name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-xs text-gray-600">Bucket: {s.sentiment_bucket}</p>
                          <p className="text-xs text-gray-600">Confidence: {s.confidence}%</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            s.sentiment_trend_30d === 'Improving' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                          }`}>
                            {s.sentiment_trend_30d}
                          </span>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {selectedBucket && (
        <BucketDrawer bucket={selectedBucket} counterparties={bucketMatrix[selectedBucket]} onClose={() => setSelectedBucket(null)} />
      )}

      {showExplainer && (
        <ExplainerModal onClose={() => setShowExplainer(false)} />
      )}
    </div>
  );
}

function BucketDrawer({ bucket, counterparties, onClose }: { bucket: string; counterparties: any[]; onClose: () => void }) {
  const [l, f] = bucket.split('-').map(s => parseInt(s.substring(1)));

  const sentimentTimeline = Array.from({ length: 30 }, (_, i) => ({
    day: `D${i + 1}`,
    avgLikelihood: 2.5 + Math.random() * 2,
    avgFit: 2.5 + Math.random() * 2,
  }));

  const getBucketInsight = () => {
    if (l >= 4 && f >= 4) return {
      title: 'Premium Counterparties',
      description: 'These counterparties demonstrate excellent operational reliability and strong strategic fit. Consider increasing exposure limits and expanding product offerings.',
      action: 'Schedule quarterly business reviews to explore growth opportunities.',
      color: 'green'
    };
    if (l <= 2 || f <= 2) return {
      title: 'High-Risk Counterparties',
      description: 'These counterparties show concerning patterns in either reliability or strategic alignment. Immediate attention required.',
      action: 'Conduct risk assessment and consider exposure reduction or enhanced monitoring.',
      color: 'red'
    };
    return {
      title: 'Standard Counterparties',
      description: 'These counterparties meet baseline requirements but show room for improvement in either operational performance or strategic fit.',
      action: 'Monitor trends and provide targeted support to improve scores.',
      color: 'blue'
    };
  };

  const insight = getBucketInsight();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-4xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-8 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Bucket {bucket} Analysis</h2>
            <p className="text-sm text-gray-600 mt-1">{counterparties.length} counterparties • Likelihood: {l}/5 • Fit: {f}/5</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className={`bg-gradient-to-r from-${insight.color}-50 to-${insight.color}-100 rounded-xl shadow-sm p-6 border border-${insight.color}-200`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
            <p className="text-sm text-gray-700 mb-4">{insight.description}</p>
            <p className="text-sm font-medium text-gray-900">
              <strong>Recommended Action:</strong> {insight.action}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Day Sentiment Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={sentimentTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#999" />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgLikelihood" stroke="#1e3a5f" strokeWidth={3} name="Avg Likelihood" dot={false} />
                <Line type="monotone" dataKey="avgFit" stroke="#27ae60" strokeWidth={3} name="Avg Fit" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Counterparties in {bucket}</h3>
            <div className="space-y-3">
              {counterparties.map(s => {
                const cp = allCounterparties.find(c => c.counterparty_id === s.counterparty_id);
                return (
                  <div key={s.counterparty_id} className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-lg text-gray-900">{cp?.short_name}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        s.sentiment_trend_30d === 'Improving' ? 'bg-green-100 text-green-800' :
                        s.sentiment_trend_30d === 'Declining' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {s.sentiment_trend_30d}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 mb-1">Likelihood</p>
                        <p className="font-bold text-gray-900 text-lg">{s.likelihood_score}/5</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Fit</p>
                        <p className="font-bold text-gray-900 text-lg">{s.fit_score}/5</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Confidence</p>
                        <p className="font-bold text-gray-900 text-lg">{s.confidence}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500 mb-1">Stability</p>
                        <p className="font-bold text-gray-900 text-lg">{s.bucket_stability_days}d</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-900 mb-1">Recommendation</p>
                      <p className="text-sm text-gray-700">{s.recommendation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExplainerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Understanding Sentiment Intelligence</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What is the 5×5 Grid?</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              The Sentiment Intelligence Grid evaluates every counterparty on two independent dimensions, creating a 25-cell matrix that categorizes relationship quality and strategic value.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Likelihood Score (L1-L5)</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              Measures <strong>operational reliability</strong> based on:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
              <li>Settlement punctuality (on-time completion rate)</li>
              <li>Confirmation speed (average hours to confirm trades)</li>
              <li>Volume consistency (stability of trading patterns)</li>
              <li>Operational incidents (frequency of delays or breaks)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Fit Score (F1-F5)</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              Measures <strong>strategic alignment</strong> based on:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
              <li>Product compatibility (which treasury products they can trade)</li>
              <li>Tenor preferences (short-term vs long-term suitability)</li>
              <li>Exposure capacity (ability to handle larger volumes)</li>
              <li>Relationship depth (engagement level and longevity)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Use This</h3>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="font-semibold text-green-900 mb-1">L4-5, F4-5 (Green) - Premium Counterparties</p>
                <p className="text-sm text-green-800">Increase exposure, expand product offerings, prioritize for strategic initiatives.</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="font-semibold text-yellow-900 mb-1">Mixed Scores (Yellow) - Develop or Optimize</p>
                <p className="text-sm text-yellow-800">High L, low F: Expand product range. High F, low L: Fix operational issues.</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="font-semibold text-red-900 mb-1">L1-2, F1-2 (Red) - High Risk</p>
                <p className="text-sm text-red-800">Reduce exposure, enhance monitoring, or consider relationship exit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
