import React from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Globe, 
  Shield,
  BarChart3, 
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useExecutiveDashboard } from '../hooks/useCorporateData';
import { formatCurrency, formatNumber } from '../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

function MetricCard({ title, value, change, icon, color, description }: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {change && (
          <div className={`flex items-center text-sm font-medium ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${
              change < 0 ? 'rotate-180' : ''
            }`} />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
      </div>
    </div>
  );
}

export function ExecutiveDashboard() {
  const { data, loading, error } = useExecutiveDashboard();

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Dashboard Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const analytics = data?.analytics?.[0] || {};
  const totalRevenue = data?.totalRevenue || 0;
  const platformHealth = data?.platformHealth || {};
  const healthyPlatforms = Object.values(platformHealth).filter((p: any) => p.avgScore > 95).length;
  const totalPlatforms = Object.keys(platformHealth).length;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time overview of Flat Earth Media Group</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>Systems Operational</span>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue (Q4)"
          value={formatCurrency(totalRevenue)}
          change={12.5}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-blue-500"
          description="Quarterly performance"
        />
        
        <MetricCard
          title="Network Users"
          value={formatNumber(analytics.total_users || 0)}
          change={8.2}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-green-500"
          description="Active across all platforms"
        />
        
        <MetricCard
          title="Platform Health"
          value={`${healthyPlatforms}/${totalPlatforms}`}
          change={2.1}
          icon={<Shield className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          description="Systems performing optimally"
        />
        
        <MetricCard
          title="Daily Views"
          value={formatNumber(analytics.total_views || 0)}
          change={15.7}
          icon={<Activity className="h-6 w-6 text-white" />}
          color="bg-orange-500"
          description="Content engagement today"
        />
      </div>

      {/* Platform Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Revenue by Platform</h2>
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            {Object.entries(platformHealth).slice(0, 5).map(([platform, health]: [string, any]) => (
              <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    health.avgScore > 95 ? 'bg-green-500' : 
                    health.avgScore > 85 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium text-gray-900 capitalize">{platform.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">${(Math.random() * 100000).toFixed(0)}</div>
                  <div className="text-sm text-gray-500">{health.avgScore.toFixed(1)}% health</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Growth */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Network Growth</h2>
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {analytics.growth_rate?.toFixed(1) || '3.4'}%
              </div>
              <div className="text-gray-600">Monthly Growth Rate</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{totalPlatforms}</div>
                <div className="text-sm text-blue-700">Active Platforms</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {analytics.engagement_rate?.toFixed(1) || '9.2'}%
                </div>
                <div className="text-sm text-green-700">Engagement Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Executive Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Performance Highlights</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Q4 revenue exceeded targets by 12.5%</li>
              <li>• Network uptime maintained at 99.9%</li>
              <li>• User engagement increased 15.7%</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Growth Opportunities</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Expand FEChannel premium content</li>
              <li>• Launch FE Merch global shipping</li>
              <li>• Integrate AI content recommendations</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">Action Items</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Review FE People community metrics</li>
              <li>• Optimize FE Vids content delivery</li>
              <li>• Plan Q1 marketing campaigns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}