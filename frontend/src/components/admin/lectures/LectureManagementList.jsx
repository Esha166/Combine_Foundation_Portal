import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';

const LectureManagementList = ({ lectures, loading, onDelete, onToggleStatus }) => {
    if (loading) {
        return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="bg-gray-200 animate-pulse rounded-xl h-64"></div>
                ))}
            </div>
        );
    }

    if (lectures.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No lectures found</p>
                <Link to="/admin/lectures/new">
                    <Button className="mt-4">
                        Create Your First Lecture
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lectures.map((lecture) => (
                <div key={lecture._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="relative">
                        <img
                            src={lecture.thumbnail}
                            alt={lecture.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                            }}
                        />
                        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${lecture.isActive
                            ? (lecture.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {lecture.isActive ? (lecture.isPublic ? 'Public' : 'Private') : 'Inactive'}
                        </div>
                    </div>
                    <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                            {lecture.title}
                        </h3>
                        {lecture.subtitle && (
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {lecture.subtitle}
                            </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>By {lecture.author?.name || 'Unknown'}</span>
                            <span>{lecture.views || 0} views</span>
                        </div>
                        {lecture.category && (
                            <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mb-3">
                                {lecture.category}
                            </span>
                        )}
                        <div className="flex space-x-2">
                            <Link
                                to={`/admin/lectures/edit/${lecture._id}`}
                                className="flex-1 text-center px-3 py-2 bg-[#FF6900] text-white text-sm rounded-lg hover:bg-[#ff6a00d6]"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => onToggleStatus(lecture)}
                                className="flex-1 text-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            >
                                {lecture.isActive ? 'Deact' : 'Act'}
                            </button>
                            <button
                                onClick={() => onDelete(lecture._id)}
                                className="flex-1 text-center px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                            >
                                Del
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LectureManagementList;
