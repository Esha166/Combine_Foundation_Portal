import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import { volunteerService } from '../../services/volunteerService';

const VolunteerManagement = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    fetchVolunteers();
  }, [activeTab]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      if (activeTab === 'pending') {
        const response = await volunteerService.getPendingVolunteers();
        const data = response.data?.data || response.data || [];
        setPendingVolunteers(Array.isArray(data) ? data : []);
      } else {
        const response = await volunteerService.getAllVolunteers(activeTab);
        const data = response.data?.data || response.data || [];
        setVolunteers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      // Set empty arrays as fallback
      if (activeTab === 'pending') {
        setPendingVolunteers([]);
      } else {
        setVolunteers([]);
      }
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
      fetchVolunteers();
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
    try {
      await volunteerService.rejectVolunteer(selectedVolunteer._id, rejectionReason);
      setMessage('Volunteer rejected. Email sent.');
      setMessageType('success');
      setShowRejectModal(false);
      setRejectionReason('');
      fetchVolunteers();
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

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!inviteName.trim() || !inviteEmail.trim()) {
      alert('Please enter both name and email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      await volunteerService.inviteVolunteer({
        name: inviteName.trim(),
        email: inviteEmail.trim()
      });
      alert('Volunteer invited successfully! Email with login credentials sent.');
      setInviteEmail('');
      setInviteName('');
      setShowInviteForm(false);
    } catch (error) {
      alert(error.response?.data?.message || 'Error inviting volunteer');
    }
  };

  const handleDeleteVolunteer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;

    try {
      await volunteerService.deleteVolunteer(id);
      setMessage('Volunteer deleted successfully');
      setMessageType('success');
      fetchVolunteers(); // Refresh the list
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to delete volunteer');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Are you sure you want to mark this volunteer as completed?')) return;

    try {
      await volunteerService.completeVolunteer(id);
      setMessage('Volunteer marked as completed successfully');
      setMessageType('success');
      fetchVolunteers(); // Refresh the list
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update volunteer status');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#FF6900]">Volunteer Management</h1>
              <p className="text-gray-600 mt-2">Approve or reject volunteer applications and invite new volunteers</p>
            </div>
            <GoBackButton />
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
          </div>
        )}

        {/* Invite Section */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Invite New Volunteer</h2>
            <button
              onClick={() => setShowInviteForm(!showInviteForm)}
              className="px-4 py-2 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition"
            >
              {showInviteForm ? 'Cancel' : 'Invite Volunteer'}
            </button>
          </div>

          {showInviteForm && (
            <form onSubmit={handleInvite} className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volunteer Name *
                  </label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter volunteer's full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter volunteer's email"
                    required
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['pending', 'approved', 'completed', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 text-sm font-medium capitalize ${activeTab === tab
                    ? 'border-b-2 border-[#FF6900] text-[#FF6900]'
                    : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                  {tab}
                  {tab === 'pending' && pendingVolunteers && pendingVolunteers.length > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                      {Array.isArray(pendingVolunteers) ? pendingVolunteers.length : 0}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900] mx-auto"></div>
              </div>
            ) : (
              <VolunteerList
                volunteers={activeTab === 'pending' ? pendingVolunteers : volunteers}
                status={activeTab}
                onApprove={handleApprove}
                onReject={openRejectModal}
                onDelete={handleDeleteVolunteer}
                onComplete={handleComplete}
              />
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <Transition appear show={showRejectModal} as={React.Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {
          setShowRejectModal(false);
          setRejectionReason('');
        }}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold text-gray-900"
                    >
                      Reject Volunteer Application
                    </Dialog.Title>
                    <button
                      onClick={() => {
                        setShowRejectModal(false);
                        setRejectionReason('');
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-2">
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

const VolunteerList = ({ volunteers, status, onApprove, onReject, onDelete, onComplete }) => {
  // Ensure volunteers is always an array, and handle nested data structures
  const safeVolunteers = volunteers && Array.isArray(volunteers) ? volunteers : [];
  // Filter out any undefined, null, or invalid entries
  const filteredVolunteers = safeVolunteers.filter(volunteer => volunteer && typeof volunteer === 'object');

  if (filteredVolunteers.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-[#FF6900] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-gray-600">No {status} volunteers found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredVolunteers.map((volunteer) => (
        <div key={volunteer._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{volunteer.name}</h3>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${volunteer.gender === 'male' ? 'bg-primary-100 text-primary-800' :
                  volunteer.gender === 'female' ? 'bg-primary-100 text-primary-800' :
                    'bg-gray-100 text-gray-800'
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
                {volunteer.rejectionReason && (
                  <p className="text-red-600">
                    <strong>Rejection Reason:</strong> {volunteer.rejectionReason}
                  </p>
                )}
              </div>
            </div>

            <div className="flex space-x-2 ml-4">
              {status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onApprove(volunteer._id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(volunteer)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              )}
              {(status === 'approved' || status === 'rejected' || status === 'completed') && (
                <div className="flex space-x-2">
                  {status === 'approved' && (
                    <button
                      onClick={() => onComplete(volunteer._id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      Mark Completed
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(volunteer._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VolunteerManagement;