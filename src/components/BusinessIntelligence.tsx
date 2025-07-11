import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Calendar,
  Download,
  FileText,
  Target,
  Zap,
  Globe,
  Activity
} from 'lucide-react';
import { useBusinessIntelligence, useMissionControl } from '../hooks/useCorporateData';
import { formatCurrency, formatNumber, formatPercentage } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface RevenueChartProps {
  data: any[];
}

function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map(item => ({
    name: item.platform_id.charAt(0).toUpperCase() + item.platform_id.slice(1),
    revenue: parseFloat(item.metric_value),
    platform: item.platform_id
  })).sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Revenue by Platform</h3>
        <BarChart3 className="h-5 w-5 text-blue-500" />
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
          />
          <Tooltip 
            formatter={(value: any) => [formatCurrency(value), 'Revenue']}
            labelStyle={{ color: '#374151' }}
          />
          <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface UserGrowthChartProps {
  data: any[];
}

function UserGrowthChart({ data }: UserGrowthChartProps) {
  const chartData = data.map(item => ({
    name: item.platform_id.charAt(0).toUpperCase() + item.platform_id.slice(1),
    users: parseInt(item.metric_value),
    platform: item.platform_id
  })).sort((a, b) => b.users - a.users);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">User Distribution</h3>
        <Users className="h-5 w-5 text-green-500" />
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="users"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => [formatNumber(value), 'Users']} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.slice(0, 6).map((item, index) => (
          <div key={item.platform} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-sm text-gray-700">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down' | 'stable';
}

function KPICard({ title, value, change, icon, color, trend }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center text-sm font-medium ${
            change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
          }`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${
              change < 0 ? 'rotate-180' : change === 0 ? 'rotate-90' : ''
            }`} />
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
    </div>
  );
}

export function BusinessIntelligence() {
  const { data: biData, loading: biLoading, error: biError } = useBusinessIntelligence();
  const { generateExecutiveReport } = useMissionControl();
  const [generating, setGenerating] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Q4_2024');

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const report = await generateExecutiveReport();
      if (report) {
        // Create download link for the report
        const reportData = JSON.stringify(report, null, 2);
        const blob = new Blob([reportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `executive-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (biLoading) {
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

  if (biError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">Error loading business intelligence data: {biError}</p>
        </div>
      </div>
    );
  }

  const revenue = biData?.revenue || [];
  const userGrowth = biData?.userGrowth || [];
  const engagement = biData?.engagement || [];
  
  const totalRevenue = revenue.reduce((sum: number, item: any) => sum + parseFloat(item.metric_value), 0);
  const totalUsers = userGrowth.reduce((sum: number, item: any) => sum + parseInt(item.metric_value), 0);
  const avgEngagement = engagement.reduce((sum: number, item: any) => sum + parseFloat(item.metric_value), 0) / (engagement.length || 1);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-green-500 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Intelligence</h1>
            <p className="text-gray-600">Advanced analytics and executive reporting</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Q4_2024">Q4 2024</option>
            <option value="Q3_2024">Q3 2024</option>
            <option value="Q2_2024">Q2 2024</option>
            <option value="Q1_2024">Q1 2024</option>
          </select>
          
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {generating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          change={12.5}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-green-500"
          trend="up"
        />
        
        <KPICard
          title="Active Users"
          value={formatNumber(totalUsers)}
          change={8.7}
          icon={<Users className="h-6 w-6 text-white" />}
          color="bg-blue-500"
          trend="up"
        />
        
        <KPICard
          title="Avg Engagement"
          value={formatPercentage(avgEngagement)}
          change={15.3}
          icon={<Activity className="h-6 w-6 text-white" />}
          color="bg-purple-500"
          trend="up"
        />
        
        <KPICard
          title="Platform Growth"
          value="+3.4%"
          change={3.4}
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-orange-500"
          trend="up"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {revenue.length > 0 && <RevenueChart data={revenue} />}
        {userGrowth.length > 0 && <UserGrowthChart data={userGrowth} />}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Performers</h3>
            <Target className="h-5 w-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            {revenue.slice(0, 5).map((item: any, index: number) => (
              <div key={item.platform_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-900 capitalize">
                    {item.platform_id.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <span className="font-bold text-gray-900">{formatCurrency(item.metric_value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Trends */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Growth Trends</h3>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Revenue Growth</span>
                <span className="text-lg font-bold text-green-600">+12.5%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">User Growth</span>
                <span className="text-lg font-bold text-blue-600">+8.7%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-800">Engagement</span>
                <span className="text-lg font-bold text-purple-600">+15.3%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Quick Insights</h3>
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm text-yellow-800">
                <strong>Revenue Peak:</strong> FEChannel leads with ${revenue[0]?.metric_value || '245K'} in Q4
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
              <p className="text-sm text-blue-800">
                <strong>User Surge:</strong> 15.3% engagement increase across all platforms
              </p>
            </div>
            
            <div className="p-3 bg-green-50 border-l-4 border-green-400">
              <p className="text-sm text-green-800">
                <strong>Growth Target:</strong> On track to exceed Q1 2025 projections by 8%
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
              <p className="text-sm text-purple-800">
                <strong>Opportunity:</strong> FE Merch showing 34% month-over-month growth
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-600 rounded-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Achievements</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span>Exceeded Q4 revenue targets by 12.5% with ${formatCurrency(totalRevenue)} total</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span>Reached {formatNumber(totalUsers)} active users across all platforms</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span>Maintained 99.9% network uptime with improved response times</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <span>Launched 3 new platform features increasing engagement by 15.3%</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Strategic Priorities</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <span>Expand FEChannel premium content library for Q1 2025</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <span>Optimize FE Merch supply chain for international markets</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                <span>Integrate AI-powered content recommendations across platforms</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                <span>Launch unified mobile app for cross-platform access</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}