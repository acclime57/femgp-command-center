import React, { useState } from 'react';
import {
  Monitor,
  Server,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Wifi,
  HardDrive,
  Cpu,
  Network,
  RefreshCw,
  Eye
} from 'lucide-react';
import { useSystemHealth, useMissionControl } from '../hooks/useCorporateData';
import { getStatusColor, getStatusDotColor, formatNumber, formatRelativeTime } from '../lib/utils';

interface PlatformStatusProps {
  platform: string;
  data: any;
  onViewDetails: (platform: string) => void;
}

function PlatformStatusCard({ platform, data, onViewDetails }: PlatformStatusProps) {
  const avgPerformance = data.avgPerformance || 0;
  const status = data.overallStatus || 'unknown';
  const serviceCount = data.services?.length || 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getStatusDotColor(status)} animate-pulse`}></div>
            <h3 className="font-semibold text-gray-900 capitalize">
              {platform.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
            {status.toUpperCase()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{avgPerformance.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Performance</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{serviceCount}</div>
            <div className="text-xs text-gray-500">Services</div>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              avgPerformance >= 95 ? 'bg-green-500' :
              avgPerformance >= 85 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${avgPerformance}%` }}
          ></div>
        </div>
        
        <button
          onClick={() => onViewDetails(platform)}
          className="w-full bg-blue-50 text-blue-700 py-2 px-3 rounded text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}

interface ServiceDetailProps {
  service: any;
}

function ServiceDetail({ service }: ServiceDetailProps) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${getStatusDotColor(service.status)}`}></div>
          <span className="font-medium text-gray-900">{service.service_name}</span>
        </div>
      </td>
      <td className="py-3 px-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
          {service.status.toUpperCase()}
        </span>
      </td>
      <td className="py-3 px-4 text-gray-700">{service.response_time}ms</td>
      <td className="py-3 px-4 text-gray-700">{service.uptime_percentage}%</td>
      <td className="py-3 px-4">
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                service.performance_score >= 95 ? 'bg-green-500' :
                service.performance_score >= 85 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${service.performance_score}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {service.performance_score.toFixed(1)}%
          </span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-500 text-sm">
        {formatRelativeTime(service.last_check)}
      </td>
    </tr>
  );
}

export function NetworkOperationsCenter() {
  const { data: systemData, loading: systemLoading, refetch: refreshSystem } = useSystemHealth();
  const { data: missionData, loading: missionLoading, lastUpdate } = useMissionControl();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshSystem();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const platformStatus = systemData?.platformStatus || {};
  const networkOverview = missionData?.networkOverview || {};
  const alerts = missionData?.alerts || [];

  if (systemLoading || missionLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Monitor className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Network Operations Center</h1>
            <p className="text-gray-600">Real-time monitoring and system health</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors ${
              refreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Globe className="h-8 w-8 opacity-80" />
            <span className="text-blue-100 text-sm font-medium">NETWORK</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{networkOverview.totalPlatforms || 13}</div>
            <div className="text-blue-100 text-sm">Active Platforms</div>
            <div className="text-xs text-blue-200">{networkOverview.platformHealth || 92}% healthy</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="h-8 w-8 opacity-80" />
            <span className="text-green-100 text-sm font-medium">UPTIME</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">99.9%</div>
            <div className="text-green-100 text-sm">Network Uptime</div>
            <div className="text-xs text-green-200">30-day average</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Zap className="h-8 w-8 opacity-80" />
            <span className="text-orange-100 text-sm font-medium">RESPONSE</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{networkOverview.avgResponseTime || 245}ms</div>
            <div className="text-orange-100 text-sm">Avg Response Time</div>
            <div className="text-xs text-orange-200">Across all services</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Activity className="h-8 w-8 opacity-80" />
            <span className="text-purple-100 text-sm font-medium">TRAFFIC</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{formatNumber(networkOverview.totalViews || 2340000)}</div>
            <div className="text-purple-100 text-sm">Daily Views</div>
            <div className="text-xs text-purple-200">+15.7% from yesterday</div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-lg font-bold text-red-900">Active Alerts ({alerts.length})</h2>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusDotColor(alert.status)}`}></div>
                    <span className="font-medium text-gray-900">
                      {alert.platform.charAt(0).toUpperCase() + alert.platform.slice(1)} - {alert.service}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                    {alert.status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Performance: {alert.performance}% | {formatRelativeTime(alert.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Status Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Platform Status Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(platformStatus).map(([platform, data]) => (
            <PlatformStatusCard
              key={platform}
              platform={platform}
              data={data}
              onViewDetails={setSelectedPlatform}
            />
          ))}
        </div>
      </div>

      {/* Detailed Service View */}
      {selectedPlatform && platformStatus[selectedPlatform] && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 capitalize">
                {selectedPlatform.replace(/([A-Z])/g, ' $1').trim()} - Service Details
              </h2>
              <button
                onClick={() => setSelectedPlatform(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Service</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Response</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Uptime</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Performance</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Last Check</th>
                </tr>
              </thead>
              <tbody>
                {platformStatus[selectedPlatform].services.map((service: any, index: number) => (
                  <ServiceDetail key={index} service={service} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}