import React from 'react';
import { Link } from 'react-router-dom';
import GoBackButton from '../shared/GoBackButton';

const LectureHeader = ({ totalLectures, canManage }) => {
    return (
        <div className="bg-gradient-to-r from-[#FF6900] to-[#ae4b04] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
                <h1 className="text-2xl font-bold text-white">Lectures</h1>
                <p className="text-white opacity-80 mt-1">
                    {totalLectures} {totalLectures === 1 ? 'Lecture' : 'Lectures'} available
                </p>
            </div>
            <div className="flex space-x-3">
                {canManage && (
                    <Link to="/admin/lectures" className="px-4 py-2 bg-white text-[#FF6900] rounded-lg hover:bg-gray-100 transition font-medium">
                        Add New Lecture
                    </Link>
                )}
                <GoBackButton className="text-white" />
            </div>
        </div>
    );
};

export default LectureHeader;
