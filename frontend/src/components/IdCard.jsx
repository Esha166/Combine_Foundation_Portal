import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from './shared/Navbar';
import GoBackButton from './shared/GoBackButton';
import { getIdCard } from '../services/idCardService';
import api from '../services/api';

const IdCard = () => {
  const { user } = useAuth();
  const [idCardData, setIdCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdCard = async () => {
      try {
        const response = await getIdCard();
        setIdCardData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch ID card data');
        console.error('Error fetching ID card:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdCard();
  }, []);

  const handleDownload = async () => {
    try {
      setLoading(true);
      // Directly use the API service to download the PDF
      const response = await api.get('/idcard/download', {
        responseType: 'blob' // Important for handling file downloads
      });
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `id-card-${user?.name?.replace(/\s+/g, '_')}-${idCardData?.idCard?.idNumber || 'temp'}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to download ID card');
      console.error('Error downloading ID card:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">My ID Card</h1>
              <GoBackButton className="text-white" />
            </div>
            <div className="p-8 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">My ID Card</h1>
              <GoBackButton className="text-white" />
            </div>
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userData = idCardData?.user;
  const idCardInfo = idCardData?.idCard;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">My ID Card</h1>
              <p className="text-white opacity-80 mt-1">Download your official ID card</p>
            </div>
            <GoBackButton className="text-white" />
          </div>

          {error && (
            <div className="px-8 py-3 bg-red-50 border-b border-red-200">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="p-8">
            {/* ID Card Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ID Card Preview</h2>
              
              {/* Front Side Card */}
              <div className="bg-gray-100 p-4 rounded-xl mb-6 flex justify-center">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-xs" style={{height: '400px'}}>
                  {/* Header with Logo */}
                  <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-4 text-center relative">
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                        <img
                          src="/logo.png"
                          alt="Combine Foundation"
                          className="w-14 h-14 object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="hidden w-14 h-14 items-center justify-center">
                          <span className="text-orange-600 font-bold text-lg">CF</span>
                        </div>
                      </div>
                    </div>
                    <h1 className="text-white text-base font-bold mt-14 tracking-wide">
                      COMBINE FOUNDATION
                    </h1>
                  </div>

                  {/* Profile Section */}
                  <div className="p-4 text-center">
                    {/* Profile Image/Initial */}
                    <div className="inline-block mb-2">
                      {userData?.profileImage ? (
                        <img
                          src={userData.profileImage}
                          alt={userData?.name}
                          className="w-20 h-20 rounded-full object-cover border-4 border-orange-200 shadow-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-200 to-orange-100 border-4 border-orange-200 shadow-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-orange-600">
                            {userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{userData?.name}</h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {userData?.expertise && userData?.expertise.length > 0
                        ? userData.expertise.join(' and ')
                        : userData?.role || 'Volunteer'}
                    </p>

                    {/* Details */}
                    <div className="space-y-1 text-left max-w-[160px] mx-auto">
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span className="font-semibold text-gray-700 text-xs">ID:</span>
                        <span className="text-gray-900 text-xs">{idCardInfo?.idNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-0.5">
                        <span className="font-semibold text-gray-700 text-xs">Join Date:</span>
                        <span className="text-gray-900 text-xs">
                          {new Date(userData?.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: '2-digit', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-700 text-xs">Phone:</span>
                        <span className="text-gray-900 text-xs">{userData?.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Back Side Card */}
              <div className="bg-gray-100 p-4 rounded-xl mb-6 flex justify-center">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-xs" style={{height: '400px'}} >
                  <div className="flex flex-col items-center justify-center h-full p-2">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Volunteer Information</h2>

                    {/* QR Code */}
                    <div className="bg-white p-2 rounded-xl shadow-lg mb-2 border-2 border-gray-200">
                      {idCardInfo?.qrCode ? (
                        <img 
                          src={idCardInfo.qrCode} 
                          alt="QR Code" 
                          className="w-24 h-24 object-contain"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 border border-dashed rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">QR Code</span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-base font-bold text-gray-900 mb-2">{userData?.name}</h3>

                    {/* Validity Info */}
                    <div className="space-y-1 text-center mb-2 flex-grow flex flex-col justify-center">
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Valid from: </span>
                        <span className="text-xs text-gray-900">
                          {new Date(idCardInfo?.validFrom).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-700">Valid thru: </span>
                        <span className="text-xs text-gray-900">
                          {new Date(idCardInfo?.validThru).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-gray-700">CNIC: </span>
                        <span className="text-xs text-gray-900">{userData?.cnic || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-2 w-full mt-auto">
                      <h4 className="text-center font-bold text-gray-900 text-xs mb-0.5">In Case of Emergency</h4>
                      <p className="text-center text-xs text-gray-700 mb-0.5">
                        Please contact COMBINE FOUNDATION
                      </p>
                      <p className="text-center font-bold text-sm text-gray-900">
                        +92 316 378243
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Download Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                disabled={loading}
                className="px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5a6 6 0 01-6-6h4a2 2 0 002 2v4zm10 0a6 6 0 01-6-6h4a2 2 0 002 2v4z"></path>
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download ID Card (PDF)
                  </>
                )}
              </button>
            </div>
            
            {/* ID Card Information */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 mb-2">ID Card Information</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your ID card is valid from {new Date(idCardInfo?.validFrom).toLocaleDateString()} to {new Date(idCardInfo?.validThru).toLocaleDateString()}</li>
                <li>• This ID card contains a unique identifier with your profile information</li>
                <li>• The QR code on the back can be scanned to verify your information</li>
                <li>• Keep your ID card secure and present it when requested</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCard;