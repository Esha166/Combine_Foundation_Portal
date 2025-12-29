import React from 'react';

const LectureList = ({ lectures, loading, onOpenLink }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <p className="text-gray-400 mt-2">Try selecting a different category</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        {!lecture.isPublic && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                Private
                            </div>
                        )}
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
                        <button
                            onClick={() => onOpenLink(lecture.watchLink)}
                            className="w-full bg-[#FF6900] text-white py-2 rounded-lg hover:bg-[#ff6a00d6] transition font-medium"
                        >
                            Watch Now
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LectureList;
