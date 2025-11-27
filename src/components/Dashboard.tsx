import { useState } from 'react';
import { TrendingUp, AlertTriangle, Users, DollarSign, Activity, BarChart3, Target, Award, Zap, Eye } from 'lucide-react';
import TreasuryOverview from './dashboard/TreasuryOverview';
import ExposureOverview from './dashboard/ExposureOverview';
import LiquidityOverview from './dashboard/LiquidityOverview';
import RiskAlerts from './dashboard/RiskAlerts';
import CounterpartySummary from './dashboard/CounterpartySummary';
import SentimentOverview from './dashboard/SentimentOverview';
import BehaviorPatterns from './dashboard/BehaviorPatterns';
import ProductPerformanceTab from './dashboard/ProductPerformanceTab';
import AttributionOverview from './dashboard/AttributionOverview';
import OperationalInsights from './dashboard/OperationalInsights';

const tabs = [
  { id: 'treasury', label: 'Treasury Overview', icon: TrendingUp },
  { id: 'exposure', label: 'Exposure Overview', icon: Target },
  { id: 'liquidity', label: 'Liquidity & Cash Position', icon: DollarSign },
  { id: 'risk', label: 'Risk & Alerts', icon: AlertTriangle },
  { id: 'counterparty', label: 'Counterparty Intelligence', icon: Users },
  { id: 'sentiment', label: 'Sentiment Intelligence', icon: Activity },
  { id: 'behavior', label: 'Behavior Patterns', icon: BarChart3 },
  { id: 'products', label: 'Product Performance', icon: Award },
  { id: 'attribution', label: 'Revenue & Attribution', icon: Zap },
  { id: 'insights', label: 'Operational Insight Center', icon: Eye },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('treasury');

  const renderContent = () => {
    switch (activeTab) {
      case 'treasury':
        return <TreasuryOverview />;
      case 'exposure':
        return <ExposureOverview />;
      case 'liquidity':
        return <LiquidityOverview />;
      case 'risk':
        return <RiskAlerts />;
      case 'counterparty':
        return <CounterpartySummary />;
      case 'sentiment':
        return <SentimentOverview />;
      case 'behavior':
        return <BehaviorPatterns />;
      case 'products':
        return <ProductPerformanceTab />;
      case 'attribution':
        return <AttributionOverview />;
      case 'insights':
        return <OperationalInsights />;
      default:
        return <TreasuryOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#1e3a5f] text-[#1e3a5f]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
}
