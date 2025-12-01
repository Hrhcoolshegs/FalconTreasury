import { useState, useMemo } from 'react';
import { Counterparty } from '../../types';
import { Search, Building2, Phone, Mail, MapPin, Plus, Edit2, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { useCounterparties } from '../../hooks/useCounterparties';

export default function CounterpartiesModuleEnhanced() {
  const { counterparties, createCounterparty, updateCounterparty, deleteCounterparty } = useCounterparties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedCounterparty, setSelectedCounterparty] = useState<Counterparty | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const sectors = ['All', 'Bank', 'Pension Fund', 'Asset Manager', 'Corporate', 'Insurance'];
  const riskCategories = ['All', 'Low', 'Medium', 'High'];

  const filteredCounterparties = useMemo(() => {
    return counterparties.filter(cp => {
      const matchesSearch =
        cp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cp.counterparty_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = selectedSector === 'All' || cp.sector === selectedSector;
      const matchesRisk = selectedRisk === 'All' || cp.risk_category === selectedRisk;

      return matchesSearch && matchesSector && matchesRisk;
    });
  }, [counterparties, searchTerm, selectedSector, selectedRisk]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedCounterparty({
      counterparty_id: '',
      name: '',
      short_name: '',
      sector: 'Bank',
      country: 'Nigeria',
      region: 'West Africa',
      city: 'Lagos',
      internal_rating: 'A',
      external_rating: 'A',
      exposure_ngn: 0,
      exposure_usd: 0,
      exposure_limit_ngn: 1000000000,
      exposure_limit_usd: 1000000,
      utilization_percentage: 0,
      settlement_reliability: 95.0,
      avg_confirmation_time: 2.0,
      total_trades_ytd: 0,
      total_volume_ytd_ngn: 0,
      total_volume_ytd_usd: 0,
      outstanding_trades: 0,
      last_trade_date: new Date().toISOString().split('T')[0],
      onboarding_date: new Date().toISOString().split('T')[0],
      relationship_tenure_months: 0,
      primary_contact_name: '',
      primary_contact_email: '',
      primary_contact_phone: '',
      product_mix: [],
      preferred_settlement: 'T+0',
      kyc_status: 'Pending',
      kyc_expiry_date: '',
      aml_status: 'Pending',
      pep_status: false,
      sanction_status: 'Clear',
      relationship_manager: '',
      desk_assignment: '',
      legal_entity_identifier: '',
      swift_code: '',
      bank_sort_code: '',
      status: 'Active',
      risk_category: 'Medium',
    });
  };

  const handleSave = () => {
    if (!selectedCounterparty) return;

    if (!selectedCounterparty.name || !selectedCounterparty.short_name) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    if (isCreating) {
      createCounterparty(selectedCounterparty);
      showNotification('success', `Counterparty "${selectedCounterparty.name}" created successfully`);
    } else {
      updateCounterparty(selectedCounterparty.counterparty_id, selectedCounterparty);
      showNotification('success', `Counterparty "${selectedCounterparty.name}" updated successfully`);
    }

    setIsCreating(false);
    setIsEditing(false);
    setSelectedCounterparty(null);
  };

  const handleDelete = (id: string) => {
    deleteCounterparty(id);
    const cp = counterparties.find(c => c.counterparty_id === id);
    showNotification('success', `Counterparty "${cp?.name}" deleted successfully`);
    setShowDeleteConfirm(null);
  };

  const handleEdit = (cp: Counterparty) => {
    setSelectedCounterparty({ ...cp });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedCounterparty(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Counterparties Directory</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all counterparty relationships and profiles</p>
          </div>
          {/* <button
            onClick={handleCreate}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Counterparty
          </button> */}
        </div>

        {notification && (
          <div className={`${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg flex items-center gap-2`}>
            <AlertCircle className="w-5 h-5" />
            <span>{notification.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-6 border border-blue-100">
            <p className="text-sm text-gray-600 font-medium">Total Counterparties</p>
            <p className="text-3xl font-bold text-blue-600">{counterparties.length}</p>
            <p className="text-xs text-gray-500 mt-1">Active relationships</p>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md p-6 border border-green-100">
            <p className="text-sm text-gray-600 font-medium">Low Risk</p>
            <p className="text-3xl font-bold text-green-600">
              {counterparties.filter(cp => cp.risk_category === 'Low').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Counterparties</p>
          </div>
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-md p-6 border border-orange-100">
            <p className="text-sm text-gray-600 font-medium">Medium Risk</p>
            <p className="text-3xl font-bold text-orange-600">
              {counterparties.filter(cp => cp.risk_category === 'Medium').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Counterparties</p>
          </div>
          <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-md p-6 border border-red-100">
            <p className="text-sm text-gray-600 font-medium">High Risk</p>
            <p className="text-3xl font-bold text-red-600">
              {counterparties.filter(cp => cp.risk_category === 'High').length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Counterparties</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search counterparties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
              <select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {riskCategories.map(risk => (
                  <option key={risk} value={risk}>{risk} Risk</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Counterparty</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Sector</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Exposure</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilization</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCounterparties.map((cp) => (
                  <tr key={cp.counterparty_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{cp.name}</p>
                        <p className="text-sm text-gray-500">{cp.counterparty_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cp.sector}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-blue-600">{cp.internal_rating}</span>
                      <span className="text-xs text-gray-500"> / {cp.external_rating}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ₦{(cp.exposure_ngn / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              cp.utilization_percentage > 90 ? 'bg-red-500' :
                              cp.utilization_percentage > 75 ? 'bg-orange-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(cp.utilization_percentage, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-700 min-w-[45px]">
                          {cp.utilization_percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        cp.risk_category === 'Low' ? 'bg-green-100 text-green-700' :
                        cp.risk_category === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {cp.risk_category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(cp)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(cp.counterparty_id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {(isCreating || isEditing) && selectedCounterparty && (
        <CounterpartyForm
          counterparty={selectedCounterparty}
          onChange={setSelectedCounterparty}
          onSave={handleSave}
          onCancel={handleCancel}
          isCreating={isCreating}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          counterparty={counterparties.find(cp => cp.counterparty_id === showDeleteConfirm)!}
          onConfirm={() => handleDelete(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

function CounterpartyForm({
  counterparty,
  onChange,
  onSave,
  onCancel,
  isCreating,
}: {
  counterparty: Counterparty;
  onChange: (cp: Counterparty) => void;
  onSave: () => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const updateField = (field: keyof Counterparty, value: any) => {
    onChange({ ...counterparty, [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{isCreating ? 'Add New Counterparty' : 'Edit Counterparty'}</h2>
            <p className="text-sm text-blue-100 mt-1">Fill in all required information</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={counterparty.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Name *</label>
              <input
                type="text"
                value={counterparty.short_name}
                onChange={(e) => updateField('short_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
              <select
                value={counterparty.sector}
                onChange={(e) => updateField('sector', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Bank</option>
                <option>Pension Fund</option>
                <option>Asset Manager</option>
                <option>Corporate</option>
                <option>Insurance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Category</label>
              <select
                value={counterparty.risk_category}
                onChange={(e) => updateField('risk_category', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Internal Rating</label>
              <input
                type="text"
                value={counterparty.internal_rating}
                onChange={(e) => updateField('internal_rating', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">External Rating</label>
              <input
                type="text"
                value={counterparty.external_rating}
                onChange={(e) => updateField('external_rating', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exposure Limit (NGN)</label>
              <input
                type="number"
                value={counterparty.exposure_limit_ngn}
                onChange={(e) => updateField('exposure_limit_ngn', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exposure Limit (USD)</label>
              <input
                type="number"
                value={counterparty.exposure_limit_usd}
                onChange={(e) => updateField('exposure_limit_usd', Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Contact</label>
              <input
                type="text"
                value={counterparty.primary_contact_name}
                onChange={(e) => updateField('primary_contact_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={counterparty.primary_contact_email}
                onChange={(e) => updateField('primary_contact_email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="tel"
                value={counterparty.primary_contact_phone}
                onChange={(e) => updateField('primary_contact_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT Code</label>
              <input
                type="text"
                value={counterparty.swift_code}
                onChange={(e) => updateField('swift_code', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isCreating ? 'Create Counterparty' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  counterparty,
  onConfirm,
  onCancel,
}: {
  counterparty: Counterparty;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete <strong>{counterparty.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
