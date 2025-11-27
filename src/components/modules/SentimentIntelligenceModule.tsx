import { useState } from 'react';
import { sentimentData, allCounterparties } from '../../data/dummyData';
import { TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SentimentIntelligenceModule() {
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);

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
  };

  const getBucketColor = (l: number, f: number) => {
    if (l >= 4 && f >= 4) return 'bg-green-500';
    if (l <= 2 || f <= 2) return 'bg-red-500';
    if (l >= 4 || f >= 4) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sentiment Intelligence Module</h1>
          <p className="text-sm text-gray-500 mt-1">Full 5×5 likelihood-fit grid with behavioral signals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">Improving</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{trendCounts.improving}</p>
            <p className="text-xs text-gray-400 mt-1">Trending up</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Minus className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Stable</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{trendCounts.stable}</p>
            <p className="text-xs text-gray-400 mt-1">No change</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-500">Declining</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{trendCounts.declining}</p>
            <p className="text-xs text-gray-400 mt-1">Trending down</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Likelihood-Fit 5×5 Matrix</h3>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex gap-2">
                <div className="flex flex-col justify-end pb-2">
                  <div className="text-sm font-semibold text-gray-700 transform -rotate-90 origin-center whitespace-nowrap mb-16">
                    Fit Score →
                  </div>
                </div>
                <div>
                  <div className="grid grid-cols-5 gap-2 mb-2">
                    {[5, 4, 3, 2, 1].map(f => (
                      <div key={f} className="w-24 text-center">
                        <span className="text-xs font-semibold text-gray-600">F{f}</span>
                      </div>
                    ))}
                  </div>
                  {[1, 2, 3, 4, 5].map(l => (
                    <div key={l} className="flex items-center gap-2 mb-2">
                      <div className="w-12 text-right">
                        <span className="text-xs font-semibold text-gray-600">L{l}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {[5, 4, 3, 2, 1].map(f => {
                          const key = `L${l}-F${f}`;
                          const counterparties = bucketMatrix[key] || [];
                          return (
                            <button
                              key={key}
                              onClick={() => setSelectedBucket(key)}
                              className={`w-24 h-24 rounded-lg ${getBucketColor(l, f)} text-white font-bold text-xl hover:opacity-80 transition-all hover:scale-105 flex items-center justify-center`}
                            >
                              {counterparties.length}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <span className="text-sm font-semibold text-gray-700">Likelihood Score →</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-xs text-gray-600">High L & High F</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500"></div>
              <span className="text-xs text-gray-600">Mixed Scores</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-500"></div>
              <span className="text-xs text-gray-600">Medium L & F</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-xs text-gray-600">Low L or F</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-gray-900">Increase Exposure</span>
                <span className="text-xl font-bold text-green-600">{recommendationCounts.increase}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-gray-900">Maintain</span>
                <span className="text-xl font-bold text-blue-600">{recommendationCounts.maintain}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm font-medium text-gray-900">Reduce Exposure</span>
                <span className="text-xl font-bold text-red-600">{recommendationCounts.reduce}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Recommendations</h3>
            <div className="space-y-2">
              {sentimentData
                .filter(s => s.recommendation === 'Increase Exposure')
                .slice(0, 5)
                .map(s => {
                  const cp = allCounterparties.find(c => c.counterparty_id === s.counterparty_id);
                  return (
                    <div key={s.counterparty_id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-gray-900">{cp?.short_name}</p>
                        <p className="text-xs text-gray-600">Bucket: {s.sentiment_bucket} • Trend: {s.sentiment_trend_30d}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                        {s.recommendation}
                      </span>
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
    </div>
  );
}

function BucketDrawer({ bucket, counterparties, onClose }: { bucket: string; counterparties: any[]; onClose: () => void }) {
  const sentimentTimeline = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    avgLikelihood: 2.5 + Math.random() * 2,
    avgFit: 2.5 + Math.random() * 2,
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-3xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bucket {bucket}</h2>
            <p className="text-sm text-gray-500">{counterparties.length} counterparties</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Timeline (30 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sentimentTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#999" />
                <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="#999" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avgLikelihood" stroke="#1e3a5f" strokeWidth={2} name="Avg Likelihood" dot={false} />
                <Line type="monotone" dataKey="avgFit" stroke="#27ae60" strokeWidth={2} name="Avg Fit" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Counterparties in {bucket}</h3>
            <div className="space-y-2">
              {counterparties.map(s => {
                const cp = allCounterparties.find(c => c.counterparty_id === s.counterparty_id);
                return (
                  <div key={s.counterparty_id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{cp?.short_name}</p>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        s.sentiment_trend_30d === 'Improving' ? 'bg-green-100 text-green-800' :
                        s.sentiment_trend_30d === 'Declining' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {s.sentiment_trend_30d}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Likelihood</p>
                        <p className="font-medium text-gray-900">{s.likelihood_score}/5</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Fit</p>
                        <p className="font-medium text-gray-900">{s.fit_score}/5</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Confidence</p>
                        <p className="font-medium text-gray-900">{s.confidence}%</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{s.recommendation}</p>
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
