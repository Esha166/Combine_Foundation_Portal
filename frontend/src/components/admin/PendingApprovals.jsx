import React, { useState, useEffect } from 'react';
import { volunteerService } from '../../services/volunteerService';
import Loader from '../shared/Loader';
import GoBackButton from '../shared/GoBackButton';

const PendingApprovals = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    fetchPendingVolunteers();
  }, []);

  const fetchPendingVolunteers = async () => {
    try {
      setLoading(true);
      const response = await volunteerService.getPendingVolunteers();
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (volunteerId) => {
    if (!confirm('Are you sure you want to approve this volunteer?')) return;

    try {
      await volunteerService.approveVolunteer(volunteerId);
      setMessage('Volunteer approved successfully! Email sent.');
      setMessageType('success');
      fetchPendingVolunteers();
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error approving volunteer');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setMessage('Please provide a rejection reason');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
      return;
    }

    try {
      await volunteerService.rejectVolunteer(selectedVolunteer._id, rejectionReason);
      setMessage('Volunteer rejected. Email sent.');
      setMessageType('success');
      setShowRejectModal(false);
      setRejectionReason('');
      setSelectedVolunteer(null);
      fetchPendingVolunteers();
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error rejecting volunteer');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  const openRejectModal = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setShowRejectModal(true);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#FF6900]">
          Pending Approvals ({volunteers.length})
        </h2>
        <GoBackButton />
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`text-sm ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
        </div>
      )}

      {volunteers.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <svg className="w-16 h-16 text-[#FF6900] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600">No pending volunteer applications</p>
        </div>
      ) : (
        volunteers.map((volunteer) => (
          <div key={volunteer._id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{volunteer.name}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    volunteer.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                    volunteer.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {volunteer.gender}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Email:</strong> {volunteer.email}</p>
                  <p><strong>Phone:</strong> {volunteer.phone || 'N/A'}</p>
                  <p><strong>Gender:</strong> {volunteer.gender}</p>
                  {volunteer.cnic && (
                    <p><strong>CNIC:</strong> {volunteer.cnic}</p>
                  )}
                  {volunteer.age && (
                    <p><strong>Age:</strong> {volunteer.age}</p>
                  )}
                  {volunteer.city && (
                    <p><strong>City:</strong> {volunteer.city}</p>
                  )}
                  {volunteer.education && (
                    <p><strong>Education:</strong> {volunteer.education}</p>
                  )}
                  {volunteer.institute && (
                    <p><strong>Institute:</strong> {volunteer.institute}</p>
                  )}
                  {volunteer.skills && Array.isArray(volunteer.skills) && volunteer.skills.length > 0 && (
                    <p><strong>Skills:</strong> {volunteer.skills.join(', ')}</p>
                  )}
                  {volunteer.expertise && Array.isArray(volunteer.expertise) && volunteer.expertise.length > 0 && (
                    <p><strong>Expertise:</strong> {volunteer.expertise.join(', ')}</p>
                  )}
                  {volunteer.priorExperience && (
                    <p><strong>Prior Experience:</strong> {volunteer.priorExperience}</p>
                  )}
                  {volunteer.experienceDesc && (
                    <p><strong>Experience Details:</strong> {volunteer.experienceDesc}</p>
                  )}
                  {volunteer.availabilityDays && Array.isArray(volunteer.availabilityDays) && volunteer.availabilityDays.length > 0 && (
                    <p><strong>Available Days:</strong> {volunteer.availabilityDays.join(', ')}</p>
                  )}
                  {volunteer.availabilityHours && (
                    <p><strong>Available Hours:</strong> {volunteer.availabilityHours}</p>
                  )}
                  <p><strong>Applied:</strong> {new Date(volunteer.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleApprove(volunteer._id)}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => openRejectModal(volunteer)}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Reject Volunteer Application
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting <strong>{selectedVolunteer?.name}</strong>
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
              rows="4"
              placeholder="Reason for rejection..."
            />
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                  setSelectedVolunteer(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;