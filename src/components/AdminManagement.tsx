import React, { useState } from 'react';
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  UserCheck,
  Settings,
  Key,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAdminManagement } from '../hooks/useCorporateData';
import { formatRelativeTime } from '../lib/utils';

interface AdminCardProps {
  admin: any;
  onEdit: (admin: any) => void;
  onDeactivate: (adminId: string) => void;
}

function AdminCard({ admin, onEdit, onDeactivate }: AdminCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'ceo': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cto': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cmo': return 'bg-green-100 text-green-800 border-green-200';
      case 'director': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {admin.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{admin.name}</h3>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(admin.role)}`}>
              {admin.role}
            </span>
            <div className={`w-2 h-2 rounded-full ${
              admin.is_active ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Platform Access:</span>
            <span className="font-medium text-gray-900">{admin.platform_access?.length || 0} platforms</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Last Login:</span>
            <span className="text-gray-700">
              {admin.last_login ? formatRelativeTime(admin.last_login) : 'Never'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Created:</span>
            <span className="text-gray-700">{formatRelativeTime(admin.created_at)}</span>
          </div>
        </div>
        
        {showDetails && (
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(admin.permissions || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    {value ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Platform Access</h4>
              <div className="flex flex-wrap gap-1">
                {admin.platform_access?.slice(0, 6).map((platform: string) => (
                  <span key={platform} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                    {platform.split('.')[0]}
                  </span>
                ))}
                {admin.platform_access?.length > 6 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{admin.platform_access.length - 6} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showDetails ? 'Hide Details' : 'View Details'}
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(admin)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Admin"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDeactivate(admin.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Deactivate Admin"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AdminFormProps {
  admin?: any;
  onSave: (adminData: any) => void;
  onCancel: () => void;
}

function AdminForm({ admin, onSave, onCancel }: AdminFormProps) {
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    role: admin?.role || 'Director',
    permissions: admin?.permissions || {},
    platform_access: admin?.platform_access || []
  });

  const availableRoles = ['CEO', 'CTO', 'CMO', 'Director', 'Manager', 'Admin'];
  const availablePlatforms = [
    'flatearthastan.com', 'femgp.com', 'fechannel.com', 'ferlive.com',
    'fepeople.com', 'fenewsnet.com', 'fevids.com', 'fetunes.com',
    'fememes.com', 'fepub.com', 'fetalks.com', 'fethink.com', 'femerch.com'
  ];

  const availablePermissions = [
    'all_access', 'executive_reports', 'financial_data', 'admin_management',
    'technical_access', 'system_monitoring', 'platform_management',
    'marketing_access', 'content_management', 'analytics_access',
    'operations_access', 'user_management'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...admin, ...formData });
  };

  const handlePermissionChange = (permission: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }));
  };

  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platform_access: checked
        ? [...prev.platform_access, platform]
        : prev.platform_access.filter(p => p !== platform)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {admin ? 'Edit Admin' : 'Create New Admin'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {availableRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
            <div className="grid grid-cols-2 gap-3">
              {availablePermissions.map(permission => (
                <label key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions[permission] || false}
                    onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">
                    {permission.replace(/_/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Platform Access</label>
            <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
              {availablePlatforms.map(platform => (
                <label key={platform} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.platform_access.includes(platform)}
                    onChange={(e) => handlePlatformChange(platform, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{platform}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {admin ? 'Update Admin' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminManagement() {
  const { admins, loading, error, createAdmin, updateAdmin, deactivateAdmin } = useAdminManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleSaveAdmin = async (adminData: any) => {
    try {
      if (editingAdmin) {
        await updateAdmin(adminData);
      } else {
        await createAdmin(adminData);
      }
      setShowForm(false);
      setEditingAdmin(null);
    } catch (err) {
      console.error('Failed to save admin:', err);
    }
  };

  const handleDeactivateAdmin = async (adminId: string) => {
    if (window.confirm('Are you sure you want to deactivate this admin?')) {
      try {
        await deactivateAdmin(adminId);
      } catch (err) {
        console.error('Failed to deactivate admin:', err);
      }
    }
  };

  const uniqueRoles = [...new Set(admins.map(admin => admin.role))];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-gray-600">Manage corporate administrators and permissions</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{admins.length}</div>
              <div className="text-sm text-gray-600">Total Admins</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <UserCheck className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {admins.filter(a => a.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Active Admins</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">{uniqueRoles.length}</div>
              <div className="text-sm text-gray-600">Admin Roles</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <Key className="h-8 w-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">13</div>
              <div className="text-sm text-gray-600">Platforms</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search admins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Admin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAdmins.map(admin => (
          <AdminCard
            key={admin.id}
            admin={admin}
            onEdit={(admin) => {
              setEditingAdmin(admin);
              setShowForm(true);
            }}
            onDeactivate={handleDeactivateAdmin}
          />
        ))}
      </div>

      {filteredAdmins.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No admins found</h3>
          <p className="text-gray-600 mb-4">No admins match your current search and filter criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setRoleFilter('');
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Admin Form Modal */}
      {showForm && (
        <AdminForm
          admin={editingAdmin}
          onSave={handleSaveAdmin}
          onCancel={() => {
            setShowForm(false);
            setEditingAdmin(null);
          }}
        />
      )}
    </div>
  );
}