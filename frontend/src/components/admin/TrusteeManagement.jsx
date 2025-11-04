import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import AddTrusteeForm from './AddTrusteeForm';
import { trusteeService } from '../../services/trusteeService';

const TrusteeManagement = () => {
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTrustees();
  }, []);

  const fetchTrustees = async () => {
    try {
      setLoading(true);
      const response = await trusteeService.getTrustees();
      setTrustees(response.data);
    } catch (error) {
      console.error('Error fetching trustees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrustee = (msg) => {
    setMessage(msg);
    fetchTrustees(); // Refresh the list after adding a trustee
    setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
  };

  const handleDeleteTrustee = async (id) => {
    if (!window.confirm('Are you sure you want to delete this trustee?')) return;

    try {
      await trusteeService.deleteTrustee(id);
      setMessage('Trustee deleted successfully');
      fetchTrustees(); // Refresh the list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete trustee');
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
              <h1 className="text-3xl font-bold text-[#FF6900]">Trustee Management</h1>
              <p className="text-gray-600 mt-2">Add and manage trustees</p>
            </div>
            <GoBackButton />
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{message}</p>
          </div>
        )}

        {/* Add Trustee Form */}
        <AddTrusteeForm onSuccess={handleAddTrustee} />

        {/* Trustees List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trustees List</h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900] mx-auto"></div>
              </div>
            ) : trustees.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No trustees found. Add a trustee to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trustees.map((trustee) => (
                  <div key={trustee._id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">{trustee.name}</h4>
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full capitalize">
                          {trustee.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{trustee.email}</p>
                      {trustee.education && (
                        <p className="text-sm text-gray-500">Education: {trustee.education}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Joined: {new Date(trustee.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteTrustee(trustee._id)}
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

export default TrusteeManagement;