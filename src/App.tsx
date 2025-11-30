import { useState } from 'react';
import { LayoutDashboard, FileText, Users, AlertTriangle, DollarSign, Activity, BarChart3, Award, Workflow, Brain, Zap, Lightbulb, BookOpen, Settings as SettingsIcon, Calculator } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionsModule from './components/modules/TransactionsModule';
import CounterpartiesModule from './components/modules/CounterpartiesModule';
import RiskExposureModule from './components/modules/RiskExposureModule';
import LiquidityModule from './components/modules/LiquidityModule';
import SentimentIntelligenceModuleEnhanced from './components/modules/SentimentIntelligenceModuleEnhanced';
import BehaviorAnalyticsModule from './components/modules/BehaviorAnalyticsModule';
import ProductPerformanceModuleEnhanced from './components/modules/ProductPerformanceModuleEnhanced';
import WorkflowsModule from './components/modules/WorkflowsModule';
import PredictionEngineModule from './components/modules/PredictionEngineModule';
import AttributionEngineModule from './components/modules/AttributionEngineModule';
import ReportsModule from './components/modules/ReportsModule';
import InsightsModule from './components/modules/InsightsModule';
import CalculateWithFalconAI from './components/modules/CalculateWithFalconAI';
import KnowledgeCentreModule from './components/modules/KnowledgeCentreModule';
import SettingsComponent from './components/Settings';
import AIConciergeEnhanced from './components/AIConciergeEnhanced';

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: Dashboard },
  { id: 'transactions', label: 'Transactions', icon: FileText, component: TransactionsModule },
  { id: 'counterparties', label: 'Counterparties', icon: Users, component: CounterpartiesModule },
  { id: 'risk', label: 'Risk & Exposure', icon: AlertTriangle, component: RiskExposureModule },
  { id: 'liquidity', label: 'Liquidity', icon: DollarSign, component: LiquidityModule },
  { id: 'sentiment', label: 'Sentiment Intelligence', icon: Activity, component: SentimentIntelligenceModuleEnhanced },
  { id: 'insights', label: 'Insights Feed', icon: Lightbulb, component: InsightsModule },
  { id: 'calculate', label: 'Calculate with Falcon AI', icon: Calculator, component: CalculateWithFalconAI },
  { id: 'behavior', label: 'Behavior Analytics', icon: BarChart3, component: BehaviorAnalyticsModule },
  { id: 'products', label: 'Product Performance', icon: Award, component: ProductPerformanceModuleEnhanced },
  { id: 'predictions', label: 'Predictions', icon: Brain, component: PredictionEngineModule },
  { id: 'attribution', label: 'Attribution Engine', icon: Zap, component: AttributionEngineModule },
  { id: 'workflows', label: 'Workflows', icon: Workflow, component: WorkflowsModule },
  { id: 'reports', label: 'Reports', icon: FileText, component: ReportsModule },
  { id: 'knowledge', label: 'Knowledge Centre', icon: BookOpen, component: KnowledgeCentreModule },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, component: SettingsComponent },
];

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const ActiveComponent = navigation.find(nav => nav.id === activeModule)?.component || Dashboard;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#1e3a5f] text-white flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">Falcon Treasury</h1>
          <p className="text-xs text-white/70 mt-1">Enterprise Intelligence</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeModule === item.id
                        ? 'bg-white/15 text-white shadow-lg scale-105 translate-x-1'
                        : 'text-white/70 hover:bg-white/5 hover:text-white hover:scale-102 hover:translate-x-0.5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                      activeModule === item.id ? 'scale-110' : ''
                    }`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <ActiveComponent />
      </main>

      <AIConciergeEnhanced />
    </div>
  );
}

export default App;
