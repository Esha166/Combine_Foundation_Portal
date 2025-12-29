import React from 'react';

const IdCardFront = ({ userData, idCardInfo }) => {
    return (
        <div className="bg-gray-100 p-4 rounded-xl mb-6 flex justify-center">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-xs" style={{ height: '400px' }}>
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
                    <h1 className="text-white text-base font-bold mt-20 tracking-wide">
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
    );
};

export default IdCardFront;
