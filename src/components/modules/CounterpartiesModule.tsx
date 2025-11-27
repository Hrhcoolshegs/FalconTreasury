import { useState, useMemo } from 'react';
import { allCounterparties } from '../../data/dummyData';
import { sentimentData } from '../../data/dummyData';
import { Counterparty } from '../../types';
import { Search, Building2, Phone, Mail, MapPin, TrendingUp, AlertTriangle, User, X, FileText, Activity } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function CounterpartiesModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null);

  const sectors = ['All', 'Bank', 'Pension Fund', 'Asset Manager', 'Corporate', 'Insurance'];
  const riskCategories = ['All', 'Low', 'Medium', 'High'];

  const filteredCounterparties = useMemo(() => {
    return allCounterparties.filter(cp => {
      const matchesSearch =
        cp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cp.counterparty_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'All' || cp.sector === selectedSector;
      const matchesRisk = selectedRisk === 'All' || cp.risk_category === selectedRisk;

      return matchesSearch && matchesSector && matchesRisk;
    });
  }, [searchTerm, selectedSector, selectedRisk]);

  const sectorDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};
    allCounterparties.forEach(cp => {
      distribution[cp.sector] = (distribution[cp.sector] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Counterparties Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Complete counterparty intelligence and profiles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Total Counterparties</p>
            <p className="text-2xl font-bold text-gray-900">{allCounterparties.length}</p>
            <p className="text-xs text-gray-400 mt-1">Active relationships</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Low Risk</p>
            <p className="text-2xl font-bold text-green-600">
              {allCounterparties.filter(cp => cp.risk_category === 'Low').length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Counterparties</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Medium Risk</p>
            <p className="text-2xl font-bold text-orange-600">
              {allCounterparties.filter(cp => cp.risk_category === 'Medium').length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Counterparties</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">High Risk</p>
            <p className="text-2xl font-bold text-red-600">
              {allCounterparties.filter(cp => cp.risk_category === 'High').length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Counterparties</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sectorDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#1e3a5f', '#4a90e2', '#f39c12', '#27ae60', '#e74c3c'][index % 5]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search counterparties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                >
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>

                <select
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                >
                  {riskCategories.map(risk => (
                    <option key={risk} value={risk}>{risk}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredCounterparties.map((cp) => (
              <div
                key={cp.counterparty_id}
                onClick={() => setSelectedCounterparty(cp)}
                className="border border-gray-200 rounded-lg p-4 hover:border-[#1e3a5f] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{cp.short_name}</p>
                      <p className="text-xs text-gray-500">{cp.counterparty_id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    cp.risk_category === 'Low' ? 'bg-green-100 text-green-800' :
                    cp.risk_category === 'Medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {cp.risk_category}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Exposure</span>
                    <span className="font-medium text-gray-900">₦{(cp.exposure_ngn / 1000000).toFixed(0)}M</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Utilization</span>
                    <span className="font-medium text-gray-900">{cp.utilization_percentage.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Reliability</span>
                    <span className="font-medium text-gray-900">{cp.settlement_reliability.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Trades YTD</span>
                    <span className="font-medium text-gray-900">{cp.total_trades_ytd}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">{cp.sector} • {cp.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCounterparty && (
        <CounterpartyProfile counterparty={selectedCounterparty} onClose={() => setSelectedCounterparty(null)} />
      )}
    </div>
  );
}

function CounterpartyProfile({ counterparty, onClose }: { counterparty: Counterparty; onClose: () => void }) {
  const sentiment = sentimentData.find(s => s.counterparty_id === counterparty.counterparty_id);

  const exposureTrend = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    exposure: counterparty.exposure_ngn * (0.8 + Math.random() * 0.4) / 1000000,
  }));

  const tradingVolume = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2025, i, 1).toLocaleDateString('en-US', { month: 'short' }),
    volume: counterparty.total_volume_ytd_ngn * (0.05 + Math.random() * 0.15) / 1000000000,
  }));

  const behaviorLogs = [
    { date: '2025-11-25', event: 'Trade Confirmed', status: 'Success', delay: '1.2h' },
    { date: '2025-11-24', event: 'Settlement Completed', status: 'Success', delay: '24h' },
    { date: '2025-11-23', event: 'Trade Confirmed', status: 'Delayed', delay: '4.5h' },
    { date: '2025-11-22', event: 'Trade Confirmed', status: 'Success', delay: '2.1h' },
    { date: '2025-11-21', event: 'Settlement Completed', status: 'Success', delay: '28h' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{counterparty.name}</h2>
              <p className="text-sm text-gray-500">{counterparty.counterparty_id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600">Exposure (NGN)</p>
              <p className="text-2xl font-bold text-blue-600">₦{(counterparty.exposure_ngn / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-gray-500 mt-1">{counterparty.utilization_percentage.toFixed(0)}% utilized</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600">Reliability</p>
              <p className="text-2xl font-bold text-green-600">{counterparty.settlement_reliability.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Settlement success</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-gray-600">Trades YTD</p>
              <p className="text-2xl font-bold text-orange-600">{counterparty.total_trades_ytd}</p>
              <p className="text-xs text-gray-500 mt-1">{counterparty.outstanding_trades} outstanding</p>
            </div>
            <div className={`rounded-lg p-4 border ${
              counterparty.risk_category === 'Low' ? 'bg-green-50 border-green-200' :
              counterparty.risk_category === 'Medium' ? 'bg-orange-50 border-orange-200' :
              'bg-red-50 border-red-200'
            }`}>
              <p className="text-sm text-gray-600">Risk Category</p>
              <p className={`text-2xl font-bold ${
                counterparty.risk_category === 'Low' ? 'text-green-600' :
                counterparty.risk_category === 'Medium' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {counterparty.risk_category}
              </p>
              <p className="text-xs text-gray-500 mt-1">{counterparty.internal_rating} rating</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{counterparty.city}, {counterparty.country}</p>
                    <p className="text-xs text-gray-500">{counterparty.region}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{counterparty.primary_contact_name}</p>
                    <p className="text-xs text-gray-500">Primary Contact</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">{counterparty.primary_contact_email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <p className="text-sm text-gray-600">{counterparty.primary_contact_phone}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Relationship Manager</p>
                  <p className="font-medium text-gray-900">{counterparty.relationship_manager}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Desk Assignment</p>
                  <p className="font-medium text-gray-900">{counterparty.desk_assignment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Onboarding Date</p>
                  <p className="font-medium text-gray-900">{counterparty.onboarding_date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tenure</p>
                  <p className="font-medium text-gray-900">{counterparty.relationship_tenure_months} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Sector</p>
                  <p className="font-medium text-gray-900">{counterparty.sector}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                    {counterparty.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {sentiment && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Likelihood Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(sentiment.likelihood_score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{sentiment.likelihood_score}/5</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Fit Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(sentiment.fit_score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-green-600">{sentiment.fit_score}/5</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-2">Recommendation</p>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    sentiment.recommendation === 'Increase Exposure' ? 'bg-green-100 text-green-800' :
                    sentiment.recommendation === 'Reduce Exposure' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {sentiment.recommendation}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exposure Trend (12 Months)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={exposureTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}M`} />
                  <Tooltip formatter={(value: any) => [`₦${value.toFixed(1)}M`, '']} />
                  <Line type="monotone" dataKey="exposure" stroke="#1e3a5f" strokeWidth={2} dot={{ fill: '#1e3a5f' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Volume (12 Months)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={tradingVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#999" tickFormatter={(v) => `₦${v}B`} />
                  <Tooltip formatter={(value: any) => [`₦${value.toFixed(2)}B`, '']} />
                  <Bar dataKey="volume" fill="#27ae60" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Behavior Log</h3>
            <div className="space-y-2">
              {behaviorLogs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">{log.event}</p>
                      <p className="text-xs text-gray-500">{log.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{log.delay}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-6 py-3 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5a8f] flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              Review Limits
            </button>
            <button className="flex-1 px-6 py-3 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Contact RM
            </button>
            <button className="flex-1 px-6 py-3 border border-[#1e3a5f] text-[#1e3a5f] rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Launch Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
