import React from 'react';
import { Link } from 'react-router-dom';
import GoBackButton from '../shared/GoBackButton';

const ProfileHeader = () => {
    return (
        <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-8 py-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
            </div>
            <div className="flex space-x-3">
                <Link to="/id-card" className="px-4 py-2 bg-white text-[#FF6900] rounded-lg hover:bg-gray-100 transition whitespace-nowrap">
                    View ID Card
                </Link>
                <GoBackButton className="text-white" />
            </div>
        </div>
    );
};

export default ProfileHeader;
