import React, { useState } from 'react';
import {
  BarChart3,
  Monitor,
  Users,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Building2,
  Zap,
  Globe
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  page: string;
  currentPage: string;
  onClick: (page: string) => void;
  badge?: number;
}

function NavItem({ icon, label, page, currentPage, onClick, badge }: NavItemProps) {
  const isActive = currentPage === page;
  
  return (
    <button
      onClick={() => onClick(page)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
      {badge && badge > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Executive Dashboard',
      page: 'dashboard'
    },
    {
      icon: <Monitor className="h-5 w-5" />,
      label: 'Network Operations',
      page: 'operations'
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      label: 'Business Intelligence',
      page: 'intelligence'
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: 'Admin Management',
      page: 'admin'
    }
  ];

  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="flex items-center space-x-3">
              <img 
                src="/FEMG-logo.jpg" 
                alt="FEMG" 
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">FEMG Command Center</h1>
                <p className="text-sm text-gray-600">Flat Earth Media Group</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {/* Live Status */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">All Systems Operational</span>
            </div>
            
            {/* Current Time */}
            <div className="hidden lg:block text-sm text-gray-600">
              {currentTime}
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">AD</span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-900">Admin User</div>
                <div className="text-xs text-gray-600">CEO Access</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 shadow-lg md:shadow-none`}>
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <img src="/FEMG-logo.jpg" alt="FEMG" className="h-8 w-auto" />
                <span className="font-bold text-gray-900">FEMG</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              <div className="mb-6">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Mission Control
                </h2>
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <NavItem
                      key={item.page}
                      icon={item.icon}
                      label={item.label}
                      page={item.page}
                      currentPage={currentPage}
                      onClick={onPageChange}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Network Status
                </h2>
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-800">13 Platforms Online</span>
                    </div>
                    <div className="text-xs text-green-600">99.9% Uptime</div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Response Time</span>
                    </div>
                    <div className="text-xs text-blue-600">245ms avg</div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Globe className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-800">Daily Traffic</span>
                    </div>
                    <div className="text-xs text-purple-600">2.34M views</div>
                  </div>
                </div>
              </div>
            </nav>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">System Health</span>
                  <span className="text-xs font-bold text-green-600">98.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '98.7%' }}></div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <button className="flex items-center space-x-2 hover:text-gray-900">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-gray-900">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}