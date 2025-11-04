import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import GoBackButton from '../shared/GoBackButton';
import PostForm from './PostForm.jsx';
import { postService } from '../../services/postService';
import Loader from '../shared/Loader';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await postService.getAllPosts();
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      if (editingPost) {
        await postService.updatePost(editingPost._id, formData);
        setMessage('Post updated successfully!');
        setMessageType('success');
      } else {
        await postService.createPost(formData);
        setMessage('Post created successfully!');
        setMessageType('success');
      }
      
      setShowForm(false);
      setEditingPost(null);
      fetchPosts();
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving post');
      setMessageType('error');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await postService.deletePost(postId);
      setMessage('Post deleted successfully!');
      setMessageType('success');
      fetchPosts();
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error deleting post');
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
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#FF6900]">Post Management</h1>
            <p className="text-gray-600 mt-2">Create and manage blog posts</p>
          </div>
          <div className="flex space-x-4">
            <GoBackButton />
            <button
              onClick={() => {
                setShowForm(true);
                setEditingPost(null);
              }}
              className="px-6 py-3 bg-[#FF6900] text-white font-medium rounded-lg hover:bg-[#ff6a00d6] transition"
            >
              + Add Post
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm ${messageType === 'success' ? 'text-green-700' : 'text-red-700'}`}>{message}</p>
          </div>
        )}

        {loading ? (
          <Loader />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  {post.subtitle && (
                    <p className="text-gray-600 text-sm mb-4">{post.subtitle}</p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="flex-1 px-4 py-2 bg-[#FF6900] text-white text-sm font-medium rounded-lg hover:bg-[#ff6a00d6]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Post Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-[#000000a1] bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
              
              <PostForm
                post={editingPost}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingPost(null);
                }}
                loading={submitting}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;