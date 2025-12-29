import React from 'react';
import Navbar from './shared/Navbar';
import GoBackButton from './shared/GoBackButton';
import { useIdCard } from '../hooks/useIdCard';
import IdCardFront from './idCard/IdCardFront';
import IdCardBack from './idCard/IdCardBack';

const IdCard = () => {
  const { idCardData, loading, error, downloading, handleDownload } = useIdCard();

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

          <div className="p-8">
            {/* ID Card Preview */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">ID Card Preview</h2>

              <IdCardFront userData={userData} idCardInfo={idCardInfo} />

              <IdCardBack userData={userData} idCardInfo={idCardInfo} />
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-6 py-3 bg-[#FF6900] text-white rounded-lg hover:bg-[#ff6a00d6] transition disabled:opacity-50 flex items-center"
              >
                {downloading ? (
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