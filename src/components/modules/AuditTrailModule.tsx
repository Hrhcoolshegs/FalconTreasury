import { useState } from 'react';
import { FileText, Search, Filter, Download, Calendar, User, Activity, AlertCircle, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Settings, Database, Key, Shield, Mail, Smartphone, LogIn, LogOut, Edit, Trash2, Plus } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  email: string;
  action: string;
  category: 'authentication' | 'system' | 'data' | 'security' | 'user_management' | 'settings';
  status: 'success' | 'failed' | 'warning';
  ipAddress: string;
  location: string;
  details: string;
  affectedResource?: string;
}

const generateAuditLogs = (): AuditLog[] => {
  const actions = [
    { action: 'User Login', category: 'authentication' as const, status: 'success' as const, details: 'Successful authentication via email/password' },
    { action: 'User Logout', category: 'authentication' as const, status: 'success' as const, details: 'User initiated logout' },
    { action: 'Failed Login Attempt', category: 'authentication' as const, status: 'failed' as const, details: 'Invalid credentials provided' },
    { action: 'Password Changed', category: 'security' as const, status: 'success' as const, details: 'User password updated successfully' },
    { action: 'Transaction Created', category: 'data' as const, status: 'success' as const, details: 'New transaction record added', affectedResource: 'Transaction #TXN-2025-001' },
    { action: 'Transaction Updated', category: 'data' as const, status: 'success' as const, details: 'Transaction record modified', affectedResource: 'Transaction #TXN-2025-002' },
    { action: 'Transaction Deleted', category: 'data' as const, status: 'warning' as const, details: 'Transaction record removed', affectedResource: 'Transaction #TXN-2024-999' },
    { action: 'Report Generated', category: 'data' as const, status: 'success' as const, details: 'Monthly treasury report exported' },
    { action: 'Settings Modified', category: 'settings' as const, status: 'success' as const, details: 'System configuration updated' },
    { action: 'User Created', category: 'user_management' as const, status: 'success' as const, details: 'New user account created', affectedResource: 'User: john.doe@falcon.ng' },
    { action: 'User Role Changed', category: 'user_management' as const, status: 'success' as const, details: 'User permissions updated', affectedResource: 'User: sarah.ibrahim@falcon.ng' },
    { action: 'User Deactivated', category: 'user_management' as const, status: 'warning' as const, details: 'User account disabled', affectedResource: 'User: old.user@falcon.ng' },
    { action: 'API Key Generated', category: 'security' as const, status: 'success' as const, details: 'New API key created for integration' },
    { action: 'API Key Revoked', category: 'security' as const, status: 'warning' as const, details: 'API key access terminated' },
    { action: 'Database Backup', category: 'system' as const, status: 'success' as const, details: 'Automated database backup completed' },
    { action: 'System Error', category: 'system' as const, status: 'failed' as const, details: 'Database connection timeout' },
    { action: '2FA Enabled', category: 'security' as const, status: 'success' as const, details: 'Two-factor authentication activated' },
    { action: 'Email Notification Sent', category: 'system' as const, status: 'success' as const, details: 'Limit breach alert notification delivered' },
    { action: 'Counterparty Created', category: 'data' as const, status: 'success' as const, details: 'New counterparty record added', affectedResource: 'Counterparty: GTBank PLC' },
    { action: 'Limit Updated', category: 'data' as const, status: 'success' as const, details: 'Counterparty exposure limit modified', affectedResource: 'Counterparty: Access Bank' },
  ];

  const users = [
    { name: 'John Adewale', email: 'john.adewale@falcon.ng' },
    { name: 'Sarah Ibrahim', email: 'sarah.ibrahim@falcon.ng' },
    { name: 'Michael Okafor', email: 'michael.okafor@falcon.ng' },
    { name: 'Grace Musa', email: 'grace.musa@falcon.ng' },
    { name: 'David Oluwaseun', email: 'david.oluwaseun@falcon.ng' },
    { name: 'System', email: 'system@falcon.ng' },
  ];

  const locations = ['Lagos, Nigeria', 'Abuja, Nigeria', 'Port Harcourt, Nigeria', 'Kano, Nigeria'];
  const ips = ['192.168.1.', '10.0.0.', '172.16.0.'];

  const logs: AuditLog[] = [];
  for (let i = 0; i < 150; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const actionData = actions[Math.floor(Math.random() * actions.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);

    logs.push({
      id: `log-${i + 1}`,
      timestamp: subDays(new Date(), daysAgo),
      user: user.name,
      email: user.email,
      action: actionData.action,
      category: actionData.category,
      status: actionData.status,
      ipAddress: `${ips[Math.floor(Math.random() * ips.length)]}${Math.floor(Math.random() * 255)}`,
      location: locations[Math.floor(Math.random() * locations.length)],
      details: actionData.details,
      affectedResource: actionData.affectedResource,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export default function AuditTrailModule() {
  const [logs] = useState<AuditLog[]>(generateAuditLogs());
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');
  const [itemsPerPage] = useState(20);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || log.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;

    const daysAgo = Math.floor((new Date().getTime() - log.timestamp.getTime()) / (1000 * 60 * 60 * 24));
    const matchesDateRange = dateRange === 'all' || daysAgo <= parseInt(dateRange);

    return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return LogIn;
      case 'system': return Settings;
      case 'data': return Database;
      case 'security': return Shield;
      case 'user_management': return User;
      case 'settings': return Settings;
      default: return Activity;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'authentication': return 'bg-blue-100 text-blue-700';
      case 'system': return 'bg-gray-100 text-gray-700';
      case 'data': return 'bg-green-100 text-green-700';
      case 'security': return 'bg-red-100 text-red-700';
      case 'user_management': return 'bg-purple-100 text-purple-700';
      case 'settings': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'failed': return XCircle;
      case 'warning': return AlertCircle;
      default: return CheckCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'warning': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Email', 'Action', 'Category', 'Status', 'IP Address', 'Location', 'Details', 'Affected Resource'].join(','),
      ...filteredLogs.map(log => [
        format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        log.user,
        log.email,
        log.action,
        log.category,
        log.status,
        log.ipAddress,
        log.location,
        `"${log.details}"`,
        log.affectedResource || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Trail</h1>
                <p className="text-sm text-gray-500 mt-1">Complete system activity and security logs</p>
              </div>
            </div>
          </div>
          <button
            onClick={exportLogs}
            className="px-4 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-md flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="authentication">Authentication</option>
                <option value="system">System</option>
                <option value="data">Data</option>
                <option value="security">Security</option>
                <option value="user_management">User Management</option>
                <option value="settings">Settings</option>
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent appearance-none"
              >
                <option value="1">Last 24 hours</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} logs
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {currentLogs.map((log) => {
              const CategoryIcon = getCategoryIcon(log.category);
              const StatusIcon = getStatusIcon(log.status);

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${getCategoryColor(log.category)}`}>
                      <CategoryIcon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">{log.action}</p>
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(log.status)}`} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.user}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {log.ipAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(log.category)}`}>
                      {log.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No audit logs found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${getCategoryColor(selectedLog.category)}`}>
                    {(() => {
                      const CategoryIcon = getCategoryIcon(selectedLog.category);
                      return <CategoryIcon className="w-5 h-5" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedLog.action}</h2>
                    <p className="text-sm text-gray-500 mt-1">Log ID: {selectedLog.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {(() => {
                      const StatusIcon = getStatusIcon(selectedLog.status);
                      return <StatusIcon className={`w-4 h-4 ${getStatusColor(selectedLog.status)}`} />;
                    })()}
                    <span className={`font-semibold capitalize ${getStatusColor(selectedLog.status)}`}>
                      {selectedLog.status}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Category</p>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryColor(selectedLog.category)}`}>
                    {selectedLog.category.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Timestamp</p>
                  <p className="text-sm text-gray-900">{format(selectedLog.timestamp, 'PPpp')}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">User</p>
                  <p className="text-sm text-gray-900">{selectedLog.user}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Email</p>
                  <p className="text-sm text-gray-900">{selectedLog.email}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">IP Address</p>
                  <p className="text-sm text-gray-900">{selectedLog.ipAddress}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Location</p>
                  <p className="text-sm text-gray-900">{selectedLog.location}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Details</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{selectedLog.details}</p>
              </div>

              {selectedLog.affectedResource && (
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Affected Resource</p>
                  <p className="text-sm text-gray-900 font-medium bg-blue-50 p-3 rounded-lg border border-blue-200">
                    {selectedLog.affectedResource}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
