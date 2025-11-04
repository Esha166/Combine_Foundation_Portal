import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import AddAdminForm from './AddAdminForm';
import { adminService } from '../../services/adminService';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllAdmins();
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setMessage(error.message || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = (msg) => {
    setMessage(msg);
    fetchAdmins(); // Refresh the list after adding an admin
    setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return;

    try {
      await adminService.deleteAdmin(id);
      setMessage('Admin deleted successfully');
      fetchAdmins(); // Refresh the list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete admin');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#FF6900]">Admin Management</h1>
              <p className="text-gray-600 mt-2">Add and manage admin users</p>
            </div>
            <GoBackButton />
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-600">{message}</p>
          </div>
        )}

        {/* Add Admin Form */}
        <div className="mb-8">
          <AddAdminForm onSuccess={handleAddAdmin} />
        </div>

        {/* Admins List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admins List</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900] mx-auto"></div>
              </div>
            ) : admins.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No admins found. Add an admin to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {admins.map((admin) => (
                  <div key={admin._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{admin.name}</h4>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full capitalize">
                          {admin.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                      {admin.phone && (
                        <p className="text-sm text-gray-500">Phone: {admin.phone}</p>
                      )}
                      {admin.permissions && admin.permissions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 mb-1">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {admin.permissions.map((permission, idx) => (
                              <span 
                                key={idx} 
                                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full capitalize"
                              >
                                {permission.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Created: {new Date(admin.createdAt).toLocaleDateString()}
                      </p>
                      {admin.createdBy && (
                        <p className="text-xs text-gray-500">
                          Created by: {admin.createdBy.name || admin.createdBy.email}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(admin._id)}
                      className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;