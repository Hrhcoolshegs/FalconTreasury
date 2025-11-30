import { useState } from 'react';
import { Lightbulb, Calculator } from 'lucide-react';
import InsightsModule from './InsightsModule';
import CalculateWithFalconAI from './CalculateWithFalconAI';

export default function AnalyticsIntelligenceModule() {
  const [activeTab, setActiveTab] = useState<'insights' | 'calculate'>('insights');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Intelligence</h1>
              <p className="text-sm text-gray-500 mt-1">AI-powered insights and calculations</p>
            </div>
          </div>

          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === 'insights'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              <span>Insights Feed</span>
            </button>
            <button
              onClick={() => setActiveTab('calculate')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all ${
                activeTab === 'calculate'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate with Falcon AI</span>
            </button>
          </div>
        </div>
      </div>

      <div>
        {activeTab === 'insights' ? <InsightsModule /> : <CalculateWithFalconAI />}
      </div>
    </div>
  );
}
