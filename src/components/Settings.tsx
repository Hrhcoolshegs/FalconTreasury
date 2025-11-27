import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Users, Building2, Bell, Database, Server, Globe, Clock, Mail, Smartphone, AlertCircle, Save, CheckCircle } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'system' | 'security' | 'departments' | 'notifications'>('system');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl shadow-lg">
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Configure system-wide preferences and security</p>
              </div>
            </div>
          </div>
        </div>

        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('system')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === 'system'
                    ? 'border-slate-500 text-slate-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  System Configuration
                </div>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === 'security'
                    ? 'border-slate-500 text-slate-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Settings
                </div>
              </button>
              <button
                onClick={() => setActiveTab('departments')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === 'departments'
                    ? 'border-slate-500 text-slate-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Departments & Users
                </div>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === 'notifications'
                    ? 'border-slate-500 text-slate-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notification System
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'system' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">General System Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        System Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Falcon Treasury"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Zone
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                        <option>Africa/Lagos (WAT)</option>
                        <option>UTC</option>
                        <option>Europe/London</option>
                        <option>America/New_York</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Currency
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                        <option>NGN - Nigerian Naira</option>
                        <option>USD - US Dollar</option>
                        <option>EUR - Euro</option>
                        <option>GBP - British Pound</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Format
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                        <option>DD/MM/YYYY</option>
                        <option>MM/DD/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data Retention (days)
                      </label>
                      <input
                        type="number"
                        defaultValue="365"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Configuration</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Database Status</h4>
                          <p className="text-sm text-gray-600">Connected to Supabase PostgreSQL</p>
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Healthy</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Backup Frequency
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                          <option>Daily</option>
                          <option>Hourly</option>
                          <option>Weekly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Connection Pool Size
                        </label>
                        <input
                          type="number"
                          defaultValue="20"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save System Settings
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Policies</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Require Two-Factor Authentication</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 ml-8">Enforce 2FA for all users in the system</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Auto-lock Inactive Sessions</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 ml-8">Lock sessions after 15 minutes of inactivity</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Key className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Strong Password Policy</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 ml-8">Require 12+ characters with mixed case, numbers, and symbols</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">IP Whitelisting</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 ml-8">Restrict access to specific IP addresses</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        defaultValue="12"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Expiry (days)
                      </label>
                      <input
                        type="number"
                        defaultValue="90"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Failed Login Attempts Limit
                      </label>
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Lockout Duration (minutes)
                      </label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Security Settings
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Management</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Treasury Operations', users: 12, head: 'John Adewale' },
                      { name: 'Risk Management', users: 8, head: 'Sarah Ibrahim' },
                      { name: 'Trading Desk', users: 15, head: 'Michael Okafor' },
                      { name: 'Finance', users: 10, head: 'Grace Musa' },
                      { name: 'Compliance', users: 6, head: 'David Oluwaseun' },
                    ].map((dept, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{dept.name}</p>
                            <p className="text-sm text-gray-500">Head: {dept.head}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">
                            <Users className="w-4 h-4 inline mr-1" />
                            {dept.users} users
                          </span>
                          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                            Manage
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Roles & Permissions</h3>
                  <div className="space-y-3">
                    {[
                      { role: 'Administrator', permissions: 'Full system access', users: 3 },
                      { role: 'Treasury Manager', permissions: 'Treasury operations, Reports', users: 5 },
                      { role: 'Risk Analyst', permissions: 'Risk monitoring, Analytics', users: 7 },
                      { role: 'Trader', permissions: 'Trading, Counterparties', users: 12 },
                      { role: 'Viewer', permissions: 'Read-only access', users: 8 },
                    ].map((role, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="font-semibold text-gray-900">{role.role}</p>
                          <p className="text-sm text-gray-500">{role.permissions}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">{role.users} users</span>
                          <button className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Department Settings
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notification Settings</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Server
                        </label>
                        <input
                          type="text"
                          defaultValue="smtp.falcon.ng"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="number"
                          defaultValue="587"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Email
                        </label>
                        <input
                          type="email"
                          defaultValue="notifications@falcon.ng"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Falcon Treasury System"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Triggers</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Limit Breach Alerts', desc: 'Send alerts when counterparty limits are breached', channels: ['Email', 'SMS'], enabled: true },
                      { label: 'Settlement Failures', desc: 'Notify when trades fail to settle', channels: ['Email', 'SMS'], enabled: true },
                      { label: 'Large Transactions', desc: 'Alert for transactions above threshold', channels: ['Email'], enabled: true },
                      { label: 'System Errors', desc: 'Critical system error notifications', channels: ['Email', 'SMS'], enabled: true },
                      { label: 'Daily Reports', desc: 'Automated daily summary reports', channels: ['Email'], enabled: false },
                    ].map((notif, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{notif.label}</p>
                              <p className="text-xs text-gray-500">{notif.desc}</p>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={notif.enabled} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                          </label>
                        </div>
                        <div className="flex gap-2 ml-8 mt-2">
                          {notif.channels.map((channel, cidx) => (
                            <span key={cidx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                              {channel === 'Email' && <Mail className="w-3 h-3 inline mr-1" />}
                              {channel === 'SMS' && <Smartphone className="w-3 h-3 inline mr-1" />}
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Notification Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
