import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import { sentimentData, allCounterparties } from '../../data/dummyData';
import { TrendingUp, TrendingDown, Minus, AlertCircle, Sparkles } from 'lucide-react';

export default function SentimentOverview() {
  const scatterData = sentimentData.map(sd => {
    const cp = allCounterparties.find(c => c.counterparty_id === sd.counterparty_id);
    return {
      x: sd.likelihood_score,
      y: sd.fit_score,
      name: cp?.short_name || 'Unknown',
      exposure: cp?.exposure_ngn || 0,
      bucket: sd.sentiment_bucket,
      trend: sd.sentiment_trend_30d,
      recommendation: sd.recommendation,
    };
  });

  const getBucketColor = (x: number, y: number) => {
    if (x >= 4 && y >= 4) return '#27ae60';
    if (x <= 2 || y <= 2) return '#e74c3c';
    if (x >= 4 || y >= 4) return '#f39c12';
    return '#4a90e2';
  };

  const trendSummary = {
    improving: sentimentData.filter(s => s.sentiment_trend_30d === 'Improving').length,
    declining: sentimentData.filter(s => s.sentiment_trend_30d === 'Declining').length,
    stable: sentimentData.filter(s => s.sentiment_trend_30d === 'Stable').length,
  };

  const recommendationSummary = {
    increase: sentimentData.filter(s => s.recommendation === 'Increase Exposure').length,
    reduce: sentimentData.filter(s => s.recommendation === 'Reduce Exposure').length,
    maintain: sentimentData.filter(s => s.recommendation === 'Maintain').length,
  };

  const alerts = sentimentData.filter(s => s.alert_status === 'Alert');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sentiment Intelligence</h1>
        <p className="text-sm text-gray-500 mt-1">Likelihood-Fit scoring and behavioral signals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-500">Improving</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{trendSummary.improving}</p>
          <p className="text-xs text-gray-400 mt-1">Counterparties trending up</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-500">Declining</span>
          </div>
          <p className="text-2xl font-bold text-red-600">{trendSummary.declining}</p>
          <p className="text-xs text-gray-400 mt-1">Counterparties trending down</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Minus className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-500">Stable</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{trendSummary.stable}</p>
          <p className="text-xs text-gray-400 mt-1">No significant change</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm text-gray-500">Alerts</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{alerts.length}</p>
          <p className="text-xs text-gray-400 mt-1">Low scores detected</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Likelihood-Fit Matrix</h3>
            <p className="text-sm text-gray-500">All counterparties plotted by L/F scores</p>
          </div>
          <button className="flex items-center gap-1 text-sm text-[#1e3a5f]">
            <Sparkles className="w-4 h-4" />
            Explain
          </button>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="x"
              name="Likelihood"
              domain={[0, 6]}
              label={{ value: 'Likelihood Score', position: 'insideBottom', offset: -10 }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Fit"
              domain={[0, 6]}
              label={{ value: 'Fit Score', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-semibold text-gray-900">{data.name}</p>
                      <p className="text-sm text-gray-600">L: {data.x}, F: {data.y}</p>
                      <p className="text-sm text-gray-600">Bucket: {data.bucket}</p>
                      <p className="text-sm text-gray-600">Trend: {data.trend}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{data.recommendation}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter data={scatterData} fill="#8884d8">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBucketColor(entry.x, entry.y)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-xs text-gray-600">High L/High F</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-xs text-gray-600">Mixed Scores</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-xs text-gray-600">Medium L/F</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-600">Low L or F</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-semibold text-gray-900">Increase Exposure</p>
                <p className="text-sm text-gray-600">High-quality counterparties</p>
              </div>
              <span className="text-2xl font-bold text-green-600">{recommendationSummary.increase}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-semibold text-gray-900">Maintain</p>
                <p className="text-sm text-gray-600">Stable relationships</p>
              </div>
              <span className="text-2xl font-bold text-blue-600">{recommendationSummary.maintain}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="font-semibold text-gray-900">Reduce Exposure</p>
                <p className="text-sm text-gray-600">Low scores detected</p>
              </div>
              <span className="text-2xl font-bold text-red-600">{recommendationSummary.reduce}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Alerts</h3>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No active sentiment alerts</p>
            ) : (
              alerts.map(alert => {
                const cp = allCounterparties.find(c => c.counterparty_id === alert.counterparty_id);
                return (
                  <div key={alert.counterparty_id} className="border-l-4 border-red-500 pl-4 py-2">
                    <p className="font-semibold text-gray-900">{cp?.short_name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">{alert.alert_reason}</p>
                    <p className="text-xs text-gray-500 mt-1">Bucket: {alert.sentiment_bucket}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
