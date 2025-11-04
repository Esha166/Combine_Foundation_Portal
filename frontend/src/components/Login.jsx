import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PasswordResetModal from './shared/PasswordResetModal';
import PasswordInput from './shared/PasswordInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="Logo" className="h-16 mx-auto mb-4" />
          </Link>
          <h2 className="text-3xl font-bold text-[#FF6900]">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="mb-6">
              <PasswordInput
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6900] text-white py-3 rounded-lg font-medium hover:bg-[#ff6a00d6] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setShowPasswordResetModal(true)}
              className="text-sm text-[#FF6900] hover:text-[#ff6a00d6] font-medium"
            >
              Forgot your password?
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-[#FF6900] hover:text-[#ff6a00d6]">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      <PasswordResetModal 
        isOpen={showPasswordResetModal} 
        onClose={() => setShowPasswordResetModal(false)} 
      />
    </div>
  );
};

export default Login;