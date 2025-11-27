import { allCounterparties } from '../../data/dummyData';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function BehaviorAnalyticsModule() {
  const traderData = [
    { trader: 'Aisha Bello', avgConfirmation: 2.3, reliability: 94.2, trades: 245, anomalies: 3 },
    { trader: 'Olumide Ajayi', avgConfirmation: 2.8, reliability: 91.5, trades: 198, anomalies: 5 },
    { trader: 'Fatima Hassan', avgConfirmation: 2.1, reliability: 96.1, trades: 267, anomalies: 2 },
  ];

  const deskClusters = [
    { desk: 'FX Desk A', avgSpeed: 2.4, reliability: 93.5, pattern: 'High Volume, Fast' },
    { desk: 'FX Desk B', avgSpeed: 2.9, reliability: 90.2, pattern: 'Medium Volume, Standard' },
    { desk: 'MM Desk', avgSpeed: 1.8, reliability: 97.2, pattern: 'High Reliability' },
    { desk: 'Fixed Income', avgSpeed: 2.2, reliability: 95.8, pattern: 'Low Volume, Reliable' },
  ];

  const anomalies = [
    { counterparty: 'Zenith Bank', type: 'Confirmation Delay', date: '2025-11-25', severity: 'High', details: 'Avg 5.2h vs normal 2.3h' },
    { counterparty: 'Access Bank', type: 'Settlement Pattern Change', date: '2025-11-24', severity: 'Medium', details: 'Shifted from T+0 to T+1' },
    { counterparty: 'FirstBank', type: 'Volume Spike', date: '2025-11-23', severity: 'Low', details: '3x normal trading volume' },
  ];

  const confirmationPatterns = {
    fast: allCounterparties.filter(cp => cp.avg_confirmation_time <= 2).length,
    medium: allCounterparties.filter(cp => cp.avg_confirmation_time > 2 && cp.avg_confirmation_time <= 3).length,
    slow: allCounterparties.filter(cp => cp.avg_confirmation_time > 3).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Behavior Analytics Module</h1>
          <p className="text-sm text-gray-500 mt-1">Trader heatmaps, desk clustering, and pattern analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">Fast Confirmations</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{confirmationPatterns.fast}</p>
            <p className="text-xs text-gray-400 mt-1">≤2 hours</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Medium Speed</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{confirmationPatterns.medium}</p>
            <p className="text-xs text-gray-400 mt-1">2-3 hours</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-gray-500">Slow Confirmations</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{confirmationPatterns.slow}</p>
            <p className="text-xs text-gray-400 mt-1">&gt;3 hours</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trader Performance Heatmap</h3>
          <div className="space-y-4">
            {traderData.map((trader) => (
              <div key={trader.trader} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{trader.trader}</p>
                    <p className="text-sm text-gray-500">{trader.trades} trades • {trader.anomalies} anomalies</p>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    trader.reliability >= 95 ? 'bg-green-100 text-green-800' :
                    trader.reliability >= 90 ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trader.reliability.toFixed(1)}% reliable
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Avg Confirmation</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            trader.avgConfirmation <= 2 ? 'bg-green-500' :
                            trader.avgConfirmation <= 3 ? 'bg-blue-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((trader.avgConfirmation / 5) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{trader.avgConfirmation}h</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reliability</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${trader.reliability}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{trader.reliability.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Anomaly Rate</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${(trader.anomalies / trader.trades) * 100 * 50}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{((trader.anomalies / trader.trades) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Desk Clustering Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deskClusters.map((desk) => (
              <div key={desk.desk} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-900">{desk.desk}</p>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                    {desk.pattern}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Avg Speed</span>
                    <span className="text-sm font-medium text-gray-900">{desk.avgSpeed}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Reliability</span>
                    <span className="text-sm font-medium text-green-600">{desk.reliability.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1e3a5f] h-2 rounded-full"
                      style={{ width: `${desk.reliability}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Anomalies</h3>
          <div className="space-y-3">
            {anomalies.map((anomaly, idx) => (
              <div key={idx} className={`border rounded-lg p-4 ${
                anomaly.severity === 'High' ? 'border-red-200 bg-red-50' :
                anomaly.severity === 'Medium' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        anomaly.severity === 'High' ? 'bg-red-100 text-red-800' :
                        anomaly.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {anomaly.severity}
                      </span>
                      <span className="text-xs text-gray-500">{anomaly.date}</span>
                    </div>
                    <p className="font-semibold text-gray-900">{anomaly.counterparty}</p>
                    <p className="text-sm text-gray-700 mt-1">{anomaly.type}</p>
                    <p className="text-sm text-gray-600 mt-1">{anomaly.details}</p>
                  </div>
                  <AlertTriangle className={`w-6 h-6 ${
                    anomaly.severity === 'High' ? 'text-red-600' :
                    anomaly.severity === 'Medium' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmation Patterns</h3>
          <div className="space-y-3">
            {allCounterparties.slice(0, 10).map((cp) => (
              <div key={cp.counterparty_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{cp.short_name}</p>
                  <p className="text-xs text-gray-500">{cp.total_trades_ytd} trades • {cp.settlement_reliability.toFixed(1)}% reliable</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{cp.avg_confirmation_time.toFixed(1)}h</p>
                    <p className="text-xs text-gray-500">avg confirmation</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    cp.avg_confirmation_time <= 2 ? 'bg-green-500' :
                    cp.avg_confirmation_time <= 3 ? 'bg-blue-500' :
                    'bg-red-500'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
