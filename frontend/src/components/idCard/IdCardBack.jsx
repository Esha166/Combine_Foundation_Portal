import React from 'react';

const IdCardBack = ({ userData, idCardInfo }) => {
    return (
        <div className="bg-gray-100 p-4 rounded-xl mb-6 flex justify-center">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-xs" style={{ height: '400px' }} >
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
    );
};

export default IdCardBack;
