import { useState } from 'react';
import { LayoutDashboard, FileText, Users, AlertTriangle, DollarSign, Activity, BarChart3, Award, Workflow, Brain, Zap, Lightbulb, BookOpen, ChevronDown, ChevronRight, LogOut, User, Settings as SettingsIcon, ScrollText } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TransactionsModuleEnhanced from './components/modules/TransactionsModuleEnhanced';
import CounterpartiesModuleEnhanced from './components/modules/CounterpartiesModuleEnhanced';
import RiskExposureModule from './components/modules/RiskExposureModule';
import LiquidityModule from './components/modules/LiquidityModule';
import SentimentIntelligenceModuleEnhanced from './components/modules/SentimentIntelligenceModuleEnhanced';
import BehaviorAnalyticsModule from './components/modules/BehaviorAnalyticsModule';
import ProductPerformanceModuleEnhanced from './components/modules/ProductPerformanceModuleEnhanced';
import WorkflowsModule from './components/modules/WorkflowsModule';
import PredictionEngineModule from './components/modules/PredictionEngineModule';
import AttributionEngineModule from './components/modules/AttributionEngineModule';
import ReportsModuleEnhanced from './components/modules/ReportsModuleEnhanced';
import InsightsModule from './components/modules/InsightsModule';
import KnowledgeCentreModule from './components/modules/KnowledgeCentreModule';
import AuditTrailModule from './components/modules/AuditTrailModule';
import Profile from './components/Profile';
import Settings from './components/Settings';
import AIConciergeEnhanced from './components/AIConciergeEnhanced';
import Login from './components/Login';
import { useAuth } from './contexts/AuthContext';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  component: any;
  standalone?: boolean;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: any;
  items: MenuItem[];
}

const standaloneItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: Dashboard, standalone: true },
];

const menuGroups: MenuGroup[] = [
  {
    id: 'core',
    label: 'Core Operations',
    icon: LayoutDashboard,
    items: [
      { id: 'transactions', label: 'Transactions', icon: FileText, component: TransactionsModuleEnhanced },
      { id: 'counterparties', label: 'Counterparties', icon: Users, component: CounterpartiesModuleEnhanced },
    ],
  },
  {
    id: 'risk',
    label: 'Risk & Treasury',
    icon: AlertTriangle,
    items: [
      { id: 'risk', label: 'Risk & Exposure', icon: AlertTriangle, component: RiskExposureModule },
      { id: 'liquidity', label: 'Liquidity', icon: DollarSign, component: LiquidityModule },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Intelligence',
    icon: Brain,
    items: [
      { id: 'sentiment', label: 'Sentiment Intelligence', icon: Activity, component: SentimentIntelligenceModuleEnhanced },
      { id: 'insights', label: 'Insights Feed', icon: Lightbulb, component: InsightsModule },
      { id: 'behavior', label: 'Behavior Analytics', icon: BarChart3, component: BehaviorAnalyticsModule },
      { id: 'products', label: 'Product Performance', icon: Award, component: ProductPerformanceModuleEnhanced },
      { id: 'predictions', label: 'Predictions', icon: Brain, component: PredictionEngineModule },
      { id: 'attribution', label: 'Attribution Engine', icon: Zap, component: AttributionEngineModule },
    ],
  },
  {
    id: 'workflow',
    label: 'Workflow & Automation',
    icon: Workflow,
    items: [
      { id: 'workflows', label: 'Workflows', icon: Workflow, component: WorkflowsModule },
    ],
  },
];

const bottomStandaloneItems: MenuItem[] = [
  { id: 'reports', label: 'Reports', icon: FileText, component: ReportsModuleEnhanced, standalone: true },
  { id: 'knowledge', label: 'Knowledge Centre', icon: BookOpen, component: KnowledgeCentreModule, standalone: true },
  { id: 'audit', label: 'Audit Trail', icon: ScrollText, component: AuditTrailModule, standalone: true },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, component: Settings, standalone: true },
];

function AppWithAuth() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [activeModule, setActiveModule] = useState('dashboard');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['core']);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  const handleLogout = () => {
    logout();
  };

  const getActiveComponent = () => {
    if (activeModule === 'profile') {
      return Profile;
    }

    const standaloneItem = [...standaloneItems, ...bottomStandaloneItems].find(i => i.id === activeModule);
    if (standaloneItem) return standaloneItem.component;

    for (const group of menuGroups) {
      const item = group.items.find(i => i.id === activeModule);
      if (item) return item.component;
    }
    return Dashboard;
  };

  const ActiveComponent = getActiveComponent();

  if (!isAuthenticated) {
    return <Login onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gradient-to-b from-[#1e3a5f] to-[#152a45] text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold">Falcon Treasury</h1>
          <p className="text-xs text-white/70 mt-1">Enterprise Intelligence</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {standaloneItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleModuleClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${
                      activeModule === item.id
                        ? 'bg-white/15 text-white shadow-lg scale-105 translate-x-1'
                        : 'text-white/70 hover:bg-white/5 hover:text-white hover:scale-102 hover:translate-x-0.5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                      activeModule === item.id ? 'scale-110' : ''
                    }`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}

            <div className="my-3 border-t border-white/10"></div>

            {menuGroups.map((group) => {
              const GroupIcon = group.icon;
              const isExpanded = expandedGroups.includes(group.id);

              return (
                <li key={group.id}>
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-white/90 hover:bg-white/5 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon className="w-4 h-4" />
                      <span className="text-sm font-semibold">{group.label}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    ) : (
                      <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                    )}
                  </button>

                  {isExpanded && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <li key={item.id}>
                            <button
                              onClick={() => handleModuleClick(item.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                                activeModule === item.id
                                  ? 'bg-white/15 text-white shadow-md scale-105 translate-x-1'
                                  : 'text-white/70 hover:bg-white/5 hover:text-white hover:scale-102 hover:translate-x-0.5'
                              }`}
                            >
                              <Icon className={`w-4 h-4 transition-transform duration-300 ${
                                activeModule === item.id ? 'scale-110' : ''
                              }`} />
                              <span>{item.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}

            <div className="my-3 border-t border-white/10"></div>

            {bottomStandaloneItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleModuleClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium ${
                      activeModule === item.id
                        ? 'bg-white/15 text-white shadow-lg scale-105 translate-x-1'
                        : 'text-white/70 hover:bg-white/5 hover:text-white hover:scale-102 hover:translate-x-0.5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 ${
                      activeModule === item.id ? 'scale-110' : ''
                    }`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-white/70">{user?.role}</p>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-xl overflow-hidden">
                <button
                  onClick={() => {
                    setActiveModule('profile');
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <ActiveComponent />
      </main>

      <AIConciergeEnhanced />
    </div>
  );
}

export default AppWithAuth;
