import React, { useState } from 'react';
import { AppProvider } from './store';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import Projects from './components/Projects';
import Tasks from './components/Tasks';
import TimeTracking from './components/TimeTracking';
import Team from './components/Team';
import Settings from './components/Settings';
import {
  LayoutDashboard,
  User,
  FolderKanban,
  CheckSquare,
  Clock,
  Users,
  Settings as SettingsIcon,
} from 'lucide-react';

type Tab = 'dashboard' | 'profile' | 'projects' | 'tasks' | 'time' | 'team' | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile' as Tab, label: 'My Profile', icon: User },
    { id: 'projects' as Tab, label: 'Projects', icon: FolderKanban },
    { id: 'tasks' as Tab, label: 'Tasks', icon: CheckSquare },
    { id: 'time' as Tab, label: 'Time Tracking', icon: Clock },
    { id: 'team' as Tab, label: 'Team', icon: Users },
    { id: 'settings' as Tab, label: 'Settings', icon: SettingsIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <UserProfile />;
      case 'projects':
        return <Projects />;
      case 'tasks':
        return <Tasks />;
      case 'time':
        return <TimeTracking />;
      case 'team':
        return <Team />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Project Manager Pro
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Professional Project Management Tool
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
