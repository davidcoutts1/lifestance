import React, { useState } from 'react';
import { useApp } from '../store';
import { Download, Upload, Trash2, AlertCircle, CheckCircle, Database } from 'lucide-react';
import { downloadFile } from '../utils';

const Settings: React.FC = () => {
  const { exportData, importData, clearAllData, projects, people, timeEntries } = useApp();
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleExport = () => {
    try {
      const data = exportData();
      const filename = `project-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
      downloadFile(data, filename);
      showNotification('success', 'Data exported successfully!');
    } catch (error) {
      showNotification('error', 'Failed to export data');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        importData(content);
        showNotification('success', 'Data imported successfully!');
      } catch (error) {
        showNotification('error', 'Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      'Are you sure you want to clear all data? This action cannot be undone. Consider exporting your data first.'
    );
    if (confirmed) {
      const doubleConfirm = window.confirm(
        'This will permanently delete all projects, tasks, people, and time entries. Are you absolutely sure?'
      );
      if (doubleConfirm) {
        clearAllData();
        showNotification('success', 'All data has been cleared');
      }
    }
  };

  const stats = {
    projects: projects.length,
    tasks: projects.reduce((sum, p) => sum + p.tasks.length, 0),
    people: people.length,
    timeEntries: timeEntries.length,
    totalHours: timeEntries.reduce((sum, e) => sum + e.hours, 0),
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      {notification && (
        <div
          className={`animate-slide-in p-4 rounded-lg flex items-center space-x-3 ${
            notification.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="card">
        <div className="flex items-center mb-6">
          <Database className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">Data Overview</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{stats.projects}</div>
            <div className="text-sm text-blue-700 mt-1">Projects</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{stats.tasks}</div>
            <div className="text-sm text-green-700 mt-1">Tasks</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{stats.people}</div>
            <div className="text-sm text-purple-700 mt-1">Team Members</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{stats.timeEntries}</div>
            <div className="text-sm text-orange-700 mt-1">Time Entries</div>
          </div>

          <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
            <div className="text-3xl font-bold text-pink-600">{stats.totalHours.toFixed(0)}h</div>
            <div className="text-sm text-pink-700 mt-1">Total Hours</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-6">
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center mb-2">
                  <Download className="w-5 h-5 text-primary-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Export Data</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Download all your data as a JSON file. This includes all projects, tasks, team
                  members, and time entries.
                </p>
              </div>
              <button onClick={handleExport} className="btn-primary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center mb-2">
                  <Upload className="w-5 h-5 text-primary-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Import Data</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Import data from a previously exported JSON file. This will replace all current
                  data.
                </p>
              </div>
              <label className="btn-primary flex items-center space-x-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1 mr-4">
                <div className="flex items-center mb-2">
                  <Trash2 className="w-5 h-5 text-red-600 mr-2" />
                  <h4 className="font-semibold text-gray-900">Clear All Data</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Permanently delete all data from the application. This action cannot be undone.
                  Make sure to export your data first if you want to keep a backup.
                </p>
              </div>
              <button
                onClick={handleClearData}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-blue-50 border border-blue-200">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Data Storage</h4>
            <p className="text-sm text-blue-800">
              All data is stored locally in your browser's localStorage. Your data never leaves
              your device and is not sent to any server. Make sure to export your data regularly
              to avoid losing it if you clear your browser data.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">About</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <strong className="text-gray-900">Project Manager Pro</strong> - A comprehensive
            project management tool
          </p>
          <p>Version 1.0.0</p>
          <p className="pt-4 border-t border-gray-200">
            Built with React, TypeScript, and TailwindCSS
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
