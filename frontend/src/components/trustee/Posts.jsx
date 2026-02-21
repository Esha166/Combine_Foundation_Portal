import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import api from '../../services/api';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/trustee/posts');
      setPosts(response.data.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPostDetails = async (postId) => {
    try {
      setDetailsLoading(true);
      setSelectedPost({ _id: postId });
      const response = await api.get(`/posts/${postId}`);
      setSelectedPost(response.data.data);
    } catch (error) {
      console.error('Error fetching post details:', error);
      setSelectedPost(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6900]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-[#FF6900]">Published Posts</h1>
              <p className="text-gray-600 mt-2">View all published posts in the system</p>
            </div>
            <GoBackButton />
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                {post.subtitle && (
                  <p className="text-gray-700 text-sm font-medium mb-2">{post.subtitle}</p>
                )}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>By {post.createdBy?.name || post.author?.name || 'Unknown'}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.content?.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openPostDetails(post._id)}
                      className="inline-flex items-center px-3 py-1.5 bg-[#FF6900] text-white text-xs font-medium rounded-md hover:bg-[#e65e00] transition-colors"
                    >
                      More
                    </button>
                    {post.socialLink && (
                      <a
                        href={post.socialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-[#FF6900] text-white text-xs font-medium rounded-md hover:bg-[#e65e00] transition-colors"
                      >
                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        View Link
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="mt-1 text-gray-500">There are currently no published posts in the system.</p>
          </div>
        )}

        {selectedPost && (
          <div className="fixed inset-0 bg-[#000000a1] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Post Details</h2>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Close
                </button>
              </div>

              {detailsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6900] mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">ID: {selectedPost._id}</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedPost.title}</p>
                  {selectedPost.subtitle && (
                    <p className="text-sm text-gray-700">{selectedPost.subtitle}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    By {selectedPost.createdBy?.name || selectedPost.author?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {selectedPost.createdAt ? new Date(selectedPost.createdAt).toLocaleString() : 'N/A'}
                  </p>
                  {selectedPost.socialLink && (
                    <p className="text-sm text-gray-500 break-all">Link: {selectedPost.socialLink}</p>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Content</p>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {selectedPost.content || 'No content available'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
