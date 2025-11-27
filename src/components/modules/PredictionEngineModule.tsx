import { predictionModels, predictions } from '../../data/workflowData';
import { Brain, TrendingUp, Target, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PredictionEngineModule() {
  const modelPerformance = predictionModels.map(m => ({
    name: m.name,
    accuracy: m.accuracy,
    predictions: m.predictions_made,
  }));

  const accuracyTrend = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    accuracy: 85 + Math.random() * 10,
  }));

  const predictionsByStatus = {
    pending: predictions.filter(p => p.status === 'Pending').length,
    confirmed: predictions.filter(p => p.status === 'Confirmed').length,
    rejected: predictions.filter(p => p.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prediction Engine</h1>
          <p className="text-sm text-gray-500 mt-1">AI-powered predictive analytics for treasury operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-500">Active Models</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{predictionModels.length}</p>
            <p className="text-xs text-gray-400 mt-1">Deployed models</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-500">Avg Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {(predictionModels.reduce((sum, m) => sum + m.accuracy, 0) / predictionModels.length).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-400 mt-1">Across all models</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-500">Total Predictions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {predictionModels.reduce((sum, m) => sum + m.predictions_made, 0)}
            </p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-500">Pending</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">{predictionsByStatus.pending}</p>
            <p className="text-xs text-gray-400 mt-1">Awaiting confirmation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={modelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#999" angle={-45} textAnchor="end" height={100} />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#27ae60" name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accuracy Trend (30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#999" />
                <YAxis tick={{ fontSize: 12 }} stroke="#999" domain={[75, 100]} />
                <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, '']} />
                <Line type="monotone" dataKey="accuracy" stroke="#1e3a5f" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Models</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictionModels.map((model) => (
              <div key={model.model_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">{model.name}</h4>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {model.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{model.accuracy}%</p>
                    <p className="text-xs text-gray-500">Accuracy</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Target:</span>
                    <span className="font-medium text-gray-900">{model.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Predictions:</span>
                    <span className="font-medium text-gray-900">{model.predictions_made.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Trained:</span>
                    <span className="font-medium text-gray-900">{model.last_trained}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Features:</span>
                    <span className="font-medium text-gray-900">{model.features.length}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button className="w-full px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2d5a8f]">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Predictions</h3>
          <div className="space-y-3">
            {predictions.map((prediction) => (
              <div key={prediction.prediction_id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{prediction.entity_name}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        prediction.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                        prediction.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {prediction.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{prediction.model_name}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Type</p>
                        <p className="font-medium text-gray-900">{prediction.prediction_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Predicted Value</p>
                        <p className="font-medium text-gray-900">
                          {typeof prediction.predicted_value === 'number'
                            ? prediction.predicted_value.toLocaleString()
                            : prediction.predicted_value}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Confidence</p>
                        <p className="font-medium text-green-600">{prediction.confidence.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                  {prediction.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
