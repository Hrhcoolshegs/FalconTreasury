import { X, Lightbulb, TrendingUp, AlertCircle, BookOpen, ArrowRight } from 'lucide-react';
import { ExplainService } from '../utils/explainService';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: {
    component: string;
    metric?: string;
    data?: any;
    trends?: string[];
    currentValues?: Record<string, number | string>;
  };
}

export default function ExplainModal({ isOpen, onClose, context }: ExplainModalProps) {
  if (!isOpen) return null;

  const explanation = ExplainService.generateExplanation(context);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{explanation.title}</h2>
                <p className="text-sm text-white/90 mt-1">AI-Powered Contextual Analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">{explanation.summary}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Key Insights
            </h3>
            <div className="space-y-2">
              {explanation.keyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Recommendations
            </h3>
            <div className="space-y-2">
              {explanation.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <ArrowRight className="flex-shrink-0 w-5 h-5 text-orange-600 mt-0.5" />
                  <p className="text-gray-700 text-sm leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {explanation.technicalDetails && (
            <div className="border-t border-gray-200 pt-6">
              <details className="group">
                <summary className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-2">
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">TECHNICAL</span>
                  Calculation Methodology
                  <span className="ml-auto text-gray-400 group-open:rotate-90 transition-transform">▶</span>
                </summary>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed">{explanation.technicalDetails}</p>
                </div>
              </details>
            </div>
          )}

          {explanation.relatedMetrics && explanation.relatedMetrics.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Related Metrics</h3>
              <div className="flex flex-wrap gap-2">
                {explanation.relatedMetrics.map((metric, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 rounded-b-xl flex items-center justify-between">
          <div className="text-xs text-gray-500">
            <span className="font-semibold">Powered by OMNIS</span> • Real-time analysis updated continuously
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
