import { useState, useEffect } from 'react';
import { 
  getCorporateDashboard, 
  getAdminManagement, 
  getMissionControl,
  subscribeToSystemHealth,
  subscribeToNetworkAnalytics
} from '../lib/supabase';

// Hook for executive dashboard data
export function useExecutiveDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getCorporateDashboard('executive_overview');
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load executive data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// Hook for system health monitoring
export function useSystemHealth() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getCorporateDashboard('system_status');
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system health');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Set up real-time subscription
    const subscription = subscribeToSystemHealth(() => {
      fetchData();
    });
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(fetchData, 15000);
    
    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// Hook for business intelligence
export function useBusinessIntelligence() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getCorporateDashboard('business_intelligence');
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchData };
}

// Hook for admin management
export function useAdminManagement() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const result = await getAdminManagement('get_admins');
      setAdmins(result?.admins || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async (adminData: any) => {
    try {
      const result = await getAdminManagement('create_admin', adminData);
      if (result) {
        await fetchAdmins(); // Refresh list
        return result;
      }
      throw new Error('Failed to create admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin');
      throw err;
    }
  };

  const updateAdmin = async (adminData: any) => {
    try {
      const result = await getAdminManagement('update_admin', adminData);
      if (result) {
        await fetchAdmins(); // Refresh list
        return result;
      }
      throw new Error('Failed to update admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update admin');
      throw err;
    }
  };

  const deactivateAdmin = async (adminId: string) => {
    try {
      const result = await getAdminManagement('deactivate_admin', { id: adminId });
      if (result) {
        await fetchAdmins(); // Refresh list
        return result;
      }
      throw new Error('Failed to deactivate admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate admin');
      throw err;
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return { 
    admins, 
    loading, 
    error, 
    refetch: fetchAdmins,
    createAdmin,
    updateAdmin,
    deactivateAdmin
  };
}

// Hook for mission control real-time monitoring
export function useMissionControl() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getMissionControl('real_time_metrics');
      setData(result);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mission control data');
    } finally {
      setLoading(false);
    }
  };

  const generateExecutiveReport = async () => {
    try {
      const result = await getMissionControl('generate_executive_report');
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      throw err;
    }
  };

  const performHealthCheck = async () => {
    try {
      const result = await getMissionControl('network_health_check');
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to perform health check');
      throw err;
    }
  };

  useEffect(() => {
    fetchData();
    
    // Real-time updates every 10 seconds
    const interval = setInterval(fetchData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return { 
    data, 
    loading, 
    error, 
    lastUpdate,
    refetch: fetchData,
    generateExecutiveReport,
    performHealthCheck
  };
}