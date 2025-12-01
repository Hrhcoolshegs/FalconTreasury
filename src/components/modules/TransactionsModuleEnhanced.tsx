import { useState, useMemo } from 'react';
import { Trade } from '../../types';
import { Search, Plus, Edit2, Trash2, X, Save, AlertCircle, Calendar, DollarSign } from 'lucide-react';
import { useTransactions } from '../../hooks/useTransactions';
import { useCounterparties } from '../../hooks/useCounterparties';
import { format } from 'date-fns';
import { safeNumber, formatLargeNumber } from '../../utils/numberHelpers';

export default function TransactionsModuleEnhanced() {
  const { transactions, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { counterparties } = useCounterparties();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedTransaction, setSelectedTransaction] = useState<Trade | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const products = ['All', 'FX Spot', 'FX Forward', 'MM', 'T-Bills', 'Bonds'];
  const statuses = ['All', 'Confirmed', 'Pending', 'Settled', 'Failed'];

  const filteredTransactions = useMemo(() => {
    return transactions.filter(txn => {
      const matchesSearch =
        txn.trade_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.counterparty_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProduct = selectedProduct === 'All' || txn.product === selectedProduct;
      const matchesStatus = selectedStatus === 'All' || txn.settlement_status === selectedStatus;

      return matchesSearch && matchesProduct && matchesStatus;
    });
  }, [transactions, searchTerm, selectedProduct, selectedStatus]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setSelectedTransaction({
      trade_id: '',
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
      showNotification('success', `Transaction "${selectedTransaction.trade_id || 'New'}" created successfully`);
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
    const totalVolume = transactions.reduce((sum, t) => sum + safeNumber(t.amount_ngn_equivalent || (t as any).amount_ngn, 0), 0);
    const totalPnL = transactions.reduce((sum, t) => sum + safeNumber(t.pnl_realized || (t as any).pnl_ngn, 0), 0);
    const settledCount = transactions.filter(t => t.settlement_status === 'Settled').length;
    const settlementRate = transactions.length > 0 ? (settledCount / transactions.length * 100) : 0;

    return { totalVolume, totalPnL, settledCount, settlementRate };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all trade transactions and settlements</p>
          </div>
          {/* <button
            onClick={handleCreate}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Transaction
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
            <p className="text-sm text-gray-600 font-medium">Total Transactions</p>
            <p className="text-3xl font-bold text-blue-600">{transactions.length}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
          <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-md p-6 border border-green-100">
            <p className="text-sm text-gray-600 font-medium">Total Volume</p>
            <p className="text-3xl font-bold text-green-600">{formatLargeNumber(stats.totalVolume, 'NGN')}</p>
            <p className="text-xs text-gray-500 mt-1">Year to date</p>
          </div>
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md p-6 border border-purple-100">
            <p className="text-sm text-gray-600 font-medium">Total P&L</p>
            <p className="text-3xl font-bold text-purple-600">{formatLargeNumber(stats.totalPnL, 'NGN')}</p>
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
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
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
                      {formatLargeNumber(safeNumber((txn as any).amount_ngn || txn.amount_ngn_equivalent, 0), 'NGN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${safeNumber((txn as any).pnl_ngn || txn.pnl_realized, 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {safeNumber((txn as any).pnl_ngn || txn.pnl_realized, 0) >= 0 ? '+' : ''}{formatLargeNumber(safeNumber((txn as any).pnl_ngn || txn.pnl_realized, 0), 'NGN')}
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
        </div>
      </div>

      {(isCreating || isEditing) && selectedTransaction && (
        <TransactionForm
          transaction={selectedTransaction}
          counterparties={counterparties}
          onChange={setSelectedTransaction}
          onSave={handleSave}
          onCancel={handleCancel}
          isCreating={isCreating}
        />
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          transactionId={showDeleteConfirm}
          onConfirm={() => handleDelete(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

function TransactionForm({
  transaction,
  counterparties,
  onChange,
  onSave,
  onCancel,
  isCreating,
}: {
  transaction: Trade;
  counterparties: any[];
  onChange: (txn: Trade) => void;
  onSave: () => void;
  onCancel: () => void;
  isCreating: boolean;
}) {
  const updateField = (field: keyof Trade, value: any) => {
    const updated = { ...transaction, [field]: value };

    if (field === 'counterparty_id') {
      const cp = counterparties.find(c => c.counterparty_id === value);
      if (cp) {
        updated.counterparty_name = cp.name;
      }
    }

    onChange(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">{isCreating ? 'New Transaction' : 'Edit Transaction'}</h2>
            <p className="text-sm text-blue-100 mt-1">Fill in all transaction details</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trade Date *</label>
              <input
                type="date"
                value={transaction.trade_date}
                onChange={(e) => updateField('trade_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value Date *</label>
              <input
                type="date"
                value={transaction.value_date}
                onChange={(e) => updateField('value_date', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Counterparty *</label>
              <select
                value={transaction.counterparty_id}
                onChange={(e) => updateField('counterparty_id', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {counterparties.map(cp => (
                  <option key={cp.counterparty_id} value={cp.counterparty_id}>
                    {cp.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product *</label>
              <select
                value={transaction.product}
                onChange={(e) => updateField('product', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option>FX Spot</option>
                <option>FX Forward</option>
                <option>MM</option>
                <option>T-Bills</option>
                <option>Bonds</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buy/Sell</label>
              <select
                value={transaction.buy_sell}
                onChange={(e) => updateField('buy_sell', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Buy</option>
                <option>Sell</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (NGN) *</label>
              <input
                type="number"
                value={transaction.amount_ngn}
                onChange={(e) => updateField('amount_ngn', safeNumber(e.target.value, 0))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount (USD)</label>
              <input
                type="number"
                value={transaction.amount_usd}
                onChange={(e) => updateField('amount_usd', safeNumber(e.target.value, 0))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate</label>
              <input
                type="number"
                step="0.01"
                value={transaction.rate}
                onChange={(e) => updateField('rate', safeNumber(e.target.value, 0))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">P&L (NGN)</label>
              <input
                type="number"
                value={transaction.pnl_ngn || 0}
                onChange={(e) => updateField('pnl_ngn', safeNumber(e.target.value, 0))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Settlement Status</label>
              <select
                value={transaction.settlement_status}
                onChange={(e) => updateField('settlement_status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Settled</option>
                <option>Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trader</label>
              <input
                type="text"
                value={transaction.trader}
                onChange={(e) => updateField('trader', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desk</label>
              <input
                type="text"
                value={transaction.desk}
                onChange={(e) => updateField('desk', e.target.value)}
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
            {isCreating ? 'Create Transaction' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmModal({
  transactionId,
  onConfirm,
  onCancel,
}: {
  transactionId: string;
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
            Are you sure you want to delete transaction <strong>{transactionId}</strong>? This action cannot be undone.
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
