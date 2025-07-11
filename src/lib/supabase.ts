import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pjqfangqpjldkptovoep.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqcWZhbmdxcGpsZGtwdG92b2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwOTQ4MzcsImV4cCI6MjA2NzY3MDgzN30.W9nT7bE3PREO263wb0yyhCrZBH-Z4yqUR_-tmJWk1u0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Corporate Types
export interface CorporateAdmin {
  id: string;
  email: string;
  name: string;
  role: string;
  permissions: Record<string, any>;
  platform_access: string[];
  last_login?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface SystemHealth {
  id: string;
  platform_id: string;
  service_name: string;
  status: 'healthy' | 'warning' | 'critical';
  response_time: number;
  uptime_percentage: number;
  last_check: string;
  error_count: number;
  performance_score: number;
  created_at: string;
}

export interface BusinessMetric {
  id: string;
  platform_id: string;
  metric_type: string;
  metric_value: number;
  currency?: string;
  time_period: string;
  recorded_at: string;
  metadata?: Record<string, any>;
}

export interface NetworkAnalytics {
  id: string;
  date: string;
  total_users: number;
  total_content: number;
  total_views: number;
  revenue: number;
  top_platform: string;
  engagement_rate: number;
  growth_rate: number;
  created_at: string;
}

export interface ExecutiveReport {
  id: string;
  report_type: string;
  title: string;
  summary: string;
  data: Record<string, any>;
  generated_by?: string;
  generated_at: string;
  period_start?: string;
  period_end?: string;
  status: string;
}

// API Functions
export async function getCorporateDashboard(action?: string): Promise<any> {
  try {
    const response = await supabase.functions.invoke('corporate-dashboard', {
      body: { action: action || 'executive_overview' }
    });

    if (response.error) {
      console.error('Corporate dashboard error:', response.error);
      return null;
    }

    return response.data?.data || null;
  } catch (error) {
    console.error('Dashboard API error:', error);
    return null;
  }
}

export async function getAdminManagement(action: string, adminData?: any): Promise<any> {
  try {
    const response = await supabase.functions.invoke('admin-management', {
      body: { action, adminData }
    });

    if (response.error) {
      console.error('Admin management error:', response.error);
      return null;
    }

    return response.data?.data || null;
  } catch (error) {
    console.error('Admin management API error:', error);
    return null;
  }
}

export async function getMissionControl(action?: string): Promise<any> {
  try {
    const response = await supabase.functions.invoke('mission-control', {
      body: { action: action || 'real_time_metrics' }
    });

    if (response.error) {
      console.error('Mission control error:', response.error);
      return null;
    }

    return response.data?.data || null;
  } catch (error) {
    console.error('Mission control API error:', error);
    return null;
  }
}

// Real-time subscriptions
export function subscribeToSystemHealth(callback: (payload: any) => void) {
  return supabase
    .channel('system_health_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'system_health' }, 
      callback
    )
    .subscribe();
}

export function subscribeToNetworkAnalytics(callback: (payload: any) => void) {
  return supabase
    .channel('network_analytics_changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'network_analytics' }, 
      callback
    )
    .subscribe();
}