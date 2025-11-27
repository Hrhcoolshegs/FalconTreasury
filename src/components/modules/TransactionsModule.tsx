import { useState, useMemo } from 'react';
import { allTrades } from '../../data/transactionData';
import { Trade } from '../../types';
import { Search, Download, ChevronDown, ChevronUp, X, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function TransactionsModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedProduct, setSelectedProduct] = useState<string>('All');
  const [selectedDesk, setSelectedDesk] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof Trade>('trade_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const itemsPerPage = 20;

  const statuses = ['All', 'Confirmed', 'Pending Confirmation', 'Settled', 'Failed', 'Cancelled'];
  const products = ['All', 'FX Spot', 'FX Forward', 'Money Market', 'Treasury Bills', 'Bonds'];
  const desks = ['All', 'FX Desk A', 'FX Desk B', 'MM Desk', 'Fixed Income'];

  const filteredTrades = useMemo(() => {
    let filtered = allTrades.filter(trade => {
      const matchesSearch =
        trade.trade_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.counterparty_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || trade.status === selectedStatus;
      const matchesProduct = selectedProduct === 'All' || trade.product_type === selectedProduct;
      const matchesDesk = selectedDesk === 'All' || trade.desk === selectedDesk;

      return matchesSearch && matchesStatus && matchesProduct && matchesDesk;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === null) return 1;
      if (bVal === null) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });

    return filtered;
  }, [allTrades, searchTerm, selectedStatus, selectedProduct, selectedDesk, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage);
  const paginatedTrades = filteredTrades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Trade) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Settled':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Pending Confirmation':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'Failed':
      case 'Cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Settled':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending Confirmation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Failed':
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const settlementStats = useMemo(() => {
    const delayed = allTrades.filter(t => t.settlement_delay_hours && t.settlement_delay_hours > 48).length;
    const onTime = allTrades.filter(t => t.status === 'Settled' && t.settlement_delay_hours && t.settlement_delay_hours <= 48).length;
    const avgConfirmation = allTrades.filter(t => t.settlement_delay_hours).reduce((sum, t) => sum + (t.settlement_delay_hours || 0), 0) / allTrades.filter(t => t.settlement_delay_hours).length;

    return { delayed, onTime, avgConfirmation };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions Module</h1>
          <p className="text-sm text-gray-500 mt-1">Complete transaction history with advanced filtering</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Total Trades</p>
            <p className="text-2xl font-bold text-gray-900">{allTrades.length}</p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Settled On Time</p>
            <p className="text-2xl font-bold text-green-600">{settlementStats.onTime}</p>
            <p className="text-xs text-gray-400 mt-1">Within 48 hours</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Settlement Delays</p>
            <p className="text-2xl font-bold text-red-600">{settlementStats.delayed}</p>
            <p className="text-xs text-gray-400 mt-1">&gt;48 hours</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm text-gray-500">Avg Confirmation</p>
            <p className="text-2xl font-bold text-blue-600">{settlementStats.avgConfirmation.toFixed(1)}h</p>
            <p className="text-xs text-gray-400 mt-1">Confirmation time</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Trade ID or Counterparty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                >
                  {products.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>

                <select
                  value={selectedDesk}
                  onChange={(e) => setSelectedDesk(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]"
                >
                  {desks.map(desk => (
                    <option key={desk} value={desk}>{desk}</option>
                  ))}
                </select>

                <button className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm hover:bg-[#2d5a8f] flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    <button onClick={() => handleSort('trade_id')} className="flex items-center gap-1 hover:text-[#1e3a5f]">
                      Trade ID
                      {sortField === 'trade_id' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    <button onClick={() => handleSort('trade_date')} className="flex items-center gap-1 hover:text-[#1e3a5f]">
                      Date
                      {sortField === 'trade_date' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Counterparty</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Direction</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount (NGN)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Amount (USD)</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Desk</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTrades.map((trade) => (
                  <tr
                    key={trade.trade_id}
                    onClick={() => setSelectedTrade(trade)}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-[#1e3a5f]">{trade.trade_id}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(trade.trade_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-900">{trade.counterparty_name}</td>
                    <td className="py-3 px-4 text-gray-600">{trade.product_type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.trade_direction === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {trade.trade_direction}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">
                      ₦{(trade.amount_ngn_equivalent / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-gray-600">
                      ${(trade.amount_usd_equivalent / 1000).toFixed(2)}K
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(trade.status)}
                        <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(trade.status)}`}>
                          {trade.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{trade.desk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredTrades.length)} of {filteredTrades.length} trades
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedTrade && (
        <TradeDetailDrawer trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
      )}
    </div>
  );
}

function TradeDetailDrawer({ trade, onClose }: { trade: Trade; onClose: () => void }) {
  const confirmationSteps = [
    { label: 'Trade Initiated', time: new Date(trade.trade_date), completed: true },
    { label: 'Confirmation Sent', time: trade.confirmation_time ? new Date(trade.confirmation_time) : null, completed: !!trade.confirmation_time },
    { label: 'Settlement', time: trade.settlement_date ? new Date(trade.settlement_date) : null, completed: !!trade.settlement_date },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div className="bg-white h-full w-full max-w-2xl overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{trade.trade_id}</h2>
            <p className="text-sm text-gray-500">Trade Details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {trade.status === 'Settled' && <CheckCircle className="w-5 h-5 text-green-600" />}
              {trade.status === 'Pending Confirmation' && <Clock className="w-5 h-5 text-yellow-600" />}
              {trade.status === 'Failed' && <XCircle className="w-5 h-5 text-red-600" />}
              <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                trade.status === 'Settled' ? 'bg-green-100 text-green-800 border-green-200' :
                trade.status === 'Pending Confirmation' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                'bg-red-100 text-red-800 border-red-200'
              }`}>
                {trade.status}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Trade Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Counterparty</p>
                <p className="font-medium text-gray-900">{trade.counterparty_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product</p>
                <p className="font-medium text-gray-900">{trade.product_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Direction</p>
                <p className="font-medium text-gray-900">{trade.trade_direction}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Currency Pair</p>
                <p className="font-medium text-gray-900">{trade.currency_pair}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount (NGN)</p>
                <p className="font-medium text-gray-900">₦{(trade.amount_ngn_equivalent / 1000000).toFixed(2)}M</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount (USD)</p>
                <p className="font-medium text-gray-900">${(trade.amount_usd_equivalent / 1000).toFixed(2)}K</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Exchange Rate</p>
                <p className="font-medium text-gray-900">{trade.exchange_rate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Desk</p>
                <p className="font-medium text-gray-900">{trade.desk}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Confirmation Timeline</h3>
            <div className="space-y-4">
              {confirmationSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{step.label}</p>
                    {step.time && (
                      <p className="text-sm text-gray-500">{step.time.toLocaleString()}</p>
                    )}
                    {!step.completed && (
                      <p className="text-sm text-gray-400">Pending</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {trade.settlement_delay_hours !== null && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Timing Analytics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-700">Confirmation Time</span>
                  <span className="font-bold text-blue-600">{trade.settlement_delay_hours.toFixed(1)} hours</span>
                </div>
                {trade.settlement_delay_hours !== null && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Settlement Time</span>
                    <span className="font-bold text-green-600">{trade.settlement_delay_hours.toFixed(1)} hours</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {trade.pnl_realized > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">P&L</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-500">Realized P&L</p>
                  <p className="text-2xl font-bold text-green-600">₦{(trade.pnl_realized / 1000000).toFixed(2)}M</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-500">Unrealized P&L</p>
                  <p className="text-2xl font-bold text-green-600">₦{(trade.pnl_unrealized / 1000000).toFixed(2)}M</p>
                </div>
              </div>
            </div>
          )}

          {trade.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-gray-700">{trade.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
