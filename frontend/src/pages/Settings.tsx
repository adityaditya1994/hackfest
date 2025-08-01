import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    riskSignals: true,
    weeklyReports: false,
    performanceUpdates: true,
  });

  const [privacy, setPrivacy] = useState({
    dataRetention: '12',
    anonymizeData: true,
    shareAnalytics: false,
  });

  const [dashboard, setDashboard] = useState({
    theme: 'light',
    defaultView: 'overview',
    autoRefresh: true,
    refreshInterval: '5',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-xl">⚙️</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Customize your Jarvis Analytics experience</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Settings */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Email Alerts</label>
                  <p className="text-xs text-gray-500">Receive email notifications for important updates</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, emailAlerts: !prev.emailAlerts }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.emailAlerts ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Risk Signal Alerts</label>
                  <p className="text-xs text-gray-500">Get notified when employees are flagged as at-risk</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, riskSignals: !prev.riskSignals }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.riskSignals ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.riskSignals ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Weekly Reports</label>
                  <p className="text-xs text-gray-500">Receive weekly analytics summary reports</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, weeklyReports: !prev.weeklyReports }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.weeklyReports ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Performance Updates</label>
                  <p className="text-xs text-gray-500">Notifications for performance review updates</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, performanceUpdates: !prev.performanceUpdates }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.performanceUpdates ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications.performanceUpdates ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Settings */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Dashboard Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Theme</label>
                <select
                  value={dashboard.theme}
                  onChange={(e) => setDashboard(prev => ({ ...prev, theme: e.target.value }))}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Default View</label>
                <select
                  value={dashboard.defaultView}
                  onChange={(e) => setDashboard(prev => ({ ...prev, defaultView: e.target.value }))}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="overview">Overview</option>
                  <option value="detailed">Detailed</option>
                  <option value="compact">Compact</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Auto Refresh</label>
                  <p className="text-xs text-gray-500">Automatically refresh dashboard data</p>
                </div>
                <button
                  onClick={() => setDashboard(prev => ({ ...prev, autoRefresh: !prev.autoRefresh }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    dashboard.autoRefresh ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      dashboard.autoRefresh ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {dashboard.autoRefresh && (
                <div>
                  <label className="text-sm font-medium text-gray-900 block mb-2">Refresh Interval (minutes)</label>
                  <input
                    type="number"
                    value={dashboard.refreshInterval}
                    onChange={(e) => setDashboard(prev => ({ ...prev, refreshInterval: e.target.value }))}
                    min="1"
                    max="60"
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 block mb-2">Data Retention (months)</label>
                <select
                  value={privacy.dataRetention}
                  onChange={(e) => setPrivacy(prev => ({ ...prev, dataRetention: e.target.value }))}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Anonymize Sensitive Data</label>
                  <p className="text-xs text-gray-500">Remove personally identifiable information from reports</p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, anonymizeData: !prev.anonymizeData }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.anonymizeData ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.anonymizeData ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-900">Share Analytics</label>
                  <p className="text-xs text-gray-500">Allow sharing anonymized analytics for benchmarking</p>
                </div>
                <button
                  onClick={() => setPrivacy(prev => ({ ...prev, shareAnalytics: !prev.shareAnalytics }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacy.shareAnalytics ? 'bg-primary-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacy.shareAnalytics ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100">
          <div className="px-6 py-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="text-sm font-medium text-gray-900">Change Password</div>
                <div className="text-xs text-gray-500">Update your account password</div>
              </button>

              <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="text-sm font-medium text-gray-900">Download Data</div>
                <div className="text-xs text-gray-500">Export your personal data</div>
              </button>

              <button className="w-full text-left px-4 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                <div className="text-sm font-medium text-red-700">Delete Account</div>
                <div className="text-xs text-red-500">Permanently delete your account and data</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Save Changes</h3>
            <p className="text-sm text-gray-600">Your preferences will be saved automatically</p>
          </div>
          <button className="bg-primary-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-600 transition-colors">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
} 