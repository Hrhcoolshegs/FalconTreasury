import { useState, useMemo } from 'react';
import { Trade } from '../../types';
import { Search, Plus, Edit2, Trash2, X, Save, AlertCircle, Download, Upload, CheckSquare, Square, Menu } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useCounterparties } from '../../hooks/useCounterparties';
import { useDateFilter } from '../../hooks/useDateFilter';
import DateRangeFilter from '../common/DateRangeFilter';
import { format } from 'date-fns';

export default function TransactionsModuleBulk() {
  const { transactions, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { counterparties } = useCounterparties();
  const { dateRange, setDateRange, filterByDate } = useDateFilter('transactions-date-filter');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTransaction, setSelectedTransaction] = useState<Trade | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false);

  const products = ['All', 'FX Spot', 'FX Forward', 'MM', 'T-Bills', 'Bonds'];
  const statuses = ['All', 'Confirmed', 'Pending', 'Settled', 'Failed'];

  const filteredTransactions = useMemo(() => {
    // First filter by date
    const dateFiltered = filterByDate(transactions, 'trade_date');

    // Then apply other filters
    return dateFiltered.filter(txn => {
      const matchesSearch =
        txn.trade_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.counterparty_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProduct = selectedProduct === 'All' || txn.product === selectedProduct;
      const matchesStatus = selectedStatus === 'All' || txn.settlement_status === selectedStatus;

      return matchesSearch && matchesProduct && matchesStatus;
    });
  }, [transactions, searchTerm, selectedProduct, selectedStatus, filterByDate]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredTransactions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTransactions.map(t => t.trade_id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach(id => deleteTransaction(id));
    showNotification('success', `${selectedIds.size} transactions deleted successfully`);
    setSelectedIds(new Set());
    setShowBulkActions(false);
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    selectedIds.forEach(id => {
      const txn = transactions.find(t => t.trade_id === id);
      if (txn) {
        updateTransaction(id, { ...txn, settlement_status: newStatus });
      }
    });
    showNotification('success', `${selectedIds.size} transactions updated to ${newStatus}`);
    setSelectedIds(new Set());
    setShowBulkStatusModal(false);
    setShowBulkActions(false);
  };

  const handleBulkExport = () => {
    const selected = transactions.filter(t => selectedIds.has(t.trade_id));
    const csv = [
      ['Trade ID', 'Date', 'Counterparty', 'Product', 'Amount NGN', 'Amount USD', 'Rate', 'P&L', 'Status'].join(','),
      ...selected.map(t => [
        t.trade_id,
        t.trade_date,
        t.counterparty_name,
        t.product,
        t.amount_ngn,
        t.amount_usd,
        t.rate,
        t.pnl_ngn || 0,
        t.settlement_status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    showNotification('success', `${selectedIds.size} transactions exported successfully`);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedTransaction({
      trade_id: `TXN-${Date.now()}`,
      trade_date: new Date().toISOString().split('T')[0],
      value_date: new Date().toISOString().split('T')[0],
      counterparty_id: counterparties[0]?.counterparty_id || '',
      counterparty_name: counterparties[0]?.name || '',
      product: 'FX Spot',
      currency_pair: 'USD/NGN',
      buy_sell: 'Buy',
      amount_ngn: 0,
      amount_usd: 0,
      rate: 1360,
      tenor: 'Overnight',
      trader: 'Aisha Bello',
      desk: 'FX Desk A',
      settlement_status: 'Pending',
      settlement_date: new Date().toISOString().split('T')[0],
      confirmation_time_hours: 0,
      pnl_ngn: 0,
      margin_bps: 0,
    });
  };

  const handleSave = () => {
    if (!selectedTransaction) return;

    if (!selectedTransaction.counterparty_id || selectedTransaction.amount_ngn === 0) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    if (isCreating) {
      createTransaction(selectedTransaction);
      showNotification('success', `Transaction "${selectedTransaction.trade_id}" created successfully`);
    } else {
      updateTransaction(selectedTransaction.trade_id, selectedTransaction);
      showNotification('success', `Transaction "${selectedTransaction.trade_id}" updated successfully`);
    }

    setIsCreating(false);
    setIsEditing(false);
    setSelectedTransaction(null);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    showNotification('success', `Transaction "${id}" deleted successfully`);
    setShowDeleteConfirm(null);
  };

  const handleEdit = (txn: Trade) => {
    setSelectedTransaction({ ...txn });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedTransaction(null);
  };

  const stats = useMemo(() => {
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount_ngn, 0);
    const totalPnL = transactions.reduce((sum, t) => sum + (t.pnl_ngn || 0), 0);
    const settledCount = transactions.filter(t => t.settlement_status === 'Settled').length;
    const settlementRate = (settledCount / transactions.length * 100) || 0;

    return { totalVolume, totalPnL, settledCount, settlementRate };
  }, [transactions]);

  const isAllSelected = selectedIds.size === filteredTransactions.length && filteredTransactions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all trade transactions with enterprise bulk operations</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Transaction
            </button>
          </div>
        </div>

        {notification && (
          <div className={`${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg flex items-center gap-2`}>
            <AlertCircle className="w-5 h-5" />
            <span>{notification.message}</span>
          </div>
        )}

        {selectedIds.size > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                {selectedIds.size} transaction{selectedIds.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBulkStatusModal(true)}
                className="px-3 py-1.5 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Menu className="w-4 h-4" />
                Update Status
              </button>
              <button
                onClick={handleBulkExport}
                className="px-3 py-1.5 bg-white text-green-600 border border-green-300 rounded-lg hover:bg-green-50 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete ${selectedIds.size} transactions? This action cannot be undone.`)) {
                    handleBulkDelete();
                  }
                }}
                className="px-3 py-1.5 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-3 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-6 border border-blue-100">
            <p className="text-sm text-gray-600 font-medium">Total Transactions</p>
            <p className="text-3xl font-bold text-blue-600">{transactions.length}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md p-6 border border-green-100">
            <p className="text-sm text-gray-600 font-medium">Total Volume</p>
            <p className="text-3xl font-bold text-green-600">₦{(stats.totalVolume / 1000000000).toFixed(1)}B</p>
            <p className="text-xs text-gray-500 mt-1">Year to date</p>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md p-6 border border-purple-100">
            <p className="text-sm text-gray-600 font-medium">Total P&L</p>
            <p className="text-3xl font-bold text-purple-600">₦{(stats.totalPnL / 1000000).toFixed(1)}M</p>
            <p className="text-xs text-gray-500 mt-1">Realized</p>
          </div>
          <div className="bg-gradient-to-br from-white to-teal-50 rounded-xl shadow-md p-6 border border-teal-100">
            <p className="text-sm text-gray-600 font-medium">Settlement Rate</p>
            <p className="text-3xl font-bold text-teal-600">{stats.settlementRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">{stats.settledCount} settled</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {products.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <DateRangeFilter
                value={dateRange}
                onChange={setDateRange}
                label="Trade Date"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <button onClick={toggleSelectAll} className="hover:bg-gray-200 p-1 rounded">
                      {isAllSelected ? (
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Trade ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Counterparty</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">P&L</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.trade_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <button onClick={() => toggleSelect(txn.trade_id)} className="hover:bg-gray-200 p-1 rounded">
                        {selectedIds.has(txn.trade_id) ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{txn.trade_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {format(new Date(txn.trade_date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{txn.counterparty_name}</td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {txn.product}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      ₦{(txn.amount_ngn / 1000000).toFixed(1)}M
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${(txn.pnl_ngn || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(txn.pnl_ngn || 0) >= 0 ? '+' : ''}₦{((txn.pnl_ngn || 0) / 1000).toFixed(0)}K
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        txn.settlement_status === 'Settled' ? 'bg-green-100 text-green-700' :
                        txn.settlement_status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                        txn.settlement_status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {txn.settlement_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(txn)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(txn.trade_id)}
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

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No transactions found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {showBulkStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBulkStatusModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Update Status for {selectedIds.size} Transactions</h3>
            <div className="space-y-2">
              {['Pending', 'Confirmed', 'Settled', 'Failed'].map(status => (
                <button
                  key={status}
                  onClick={() => handleBulkStatusUpdate(status)}
                  className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                >
                  <span className="font-medium">{status}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowBulkStatusModal(false)}
              className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {(isCreating || isEditing) && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCancel}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900">
                {isCreating ? 'Create New Transaction' : 'Edit Transaction'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trade ID</label>
                  <input
                    type="text"
                    value={selectedTransaction.trade_id}
                    onChange={(e) => onChange({ ...selectedTransaction, trade_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!isCreating}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select
                    value={selectedTransaction.product}
                    onChange={(e) => onChange({ ...selectedTransaction, product: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {products.filter(p => p !== 'All').map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (NGN)</label>
                  <input
                    type="number"
                    value={selectedTransaction.amount_ngn}
                    onChange={(e) => onChange({ ...selectedTransaction, amount_ngn: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedTransaction.settlement_status}
                    onChange={(e) => onChange({ ...selectedTransaction, settlement_status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statuses.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isCreating ? 'Create' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete transaction {showDeleteConfirm}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
