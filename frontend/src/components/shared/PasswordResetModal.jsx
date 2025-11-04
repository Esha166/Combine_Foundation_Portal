import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from './PasswordInput';

const PasswordResetModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP verification, 3: New password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Timer for re-sending OTP
  
  const { forgotPassword, verifyOTP, resetPassword } = useAuth();

  React.useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (timer === 0 && step === 2) {
      // Timer finished, user can request new OTP
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setStep(2);
      setTimer(60); // 60 seconds to re-send
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await verifyOTP(email, otp);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return; // Can't resend while timer is running

    setError('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await resetPassword(email, otp, newPassword);
      // Go to success state or close modal
      setStep(4); // Success step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setStep(1);
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setLoading(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold text-gray-900"
                  >
                    {step === 1 && 'Forgot Password'}
                    {step === 2 && 'Verify OTP'}
                    {step === 3 && 'Reset Password'}
                    {step === 4 && 'Password Reset Successful'}
                  </Dialog.Title>
                  <button 
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Enter your email address and we'll send you an OTP to reset your password.
                    </p>
                    
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
                      />
                    </div>

                    <button
                      onClick={handleSendOTP}
                      disabled={loading}
                      className="w-full bg-[#FF6900] text-white py-3 rounded-lg font-medium hover:bg-[#ff6a00d6] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <p className="text-gray-600 mb-4">
                      We've sent an OTP to <span className="font-semibold">{email}</span>. 
                      Please enter it to continue.
                    </p>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        One-Time Password (OTP)
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>

                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={handleVerifyOTP}
                        disabled={loading}
                        className="flex-1 bg-[#FF6900] text-white py-3 rounded-lg font-medium hover:bg-[#ff6a00d6] transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                      
                      <button
                        onClick={handleResendOTP}
                        disabled={loading || timer > 0}
                        className={`py-3 px-4 rounded-lg font-medium transition ${
                          timer > 0 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {timer > 0 ? `${timer}s` : 'Resend'}
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 text-center">
                      OTP expires in 10 minutes
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Enter your new password.
                    </p>
                    
                    <div className="mb-4">
                      <PasswordInput
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <PasswordInput
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <button
                      onClick={handleResetPassword}
                      disabled={loading}
                      className="w-full bg-[#FF6900] text-white py-3 rounded-lg font-medium hover:bg-[#ff6a00d6] transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Resetting Password...' : 'Reset Password'}
                    </button>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Password Reset Successful!</h4>
                    <p className="text-gray-600 mb-4">
                      Your password has been successfully reset. You can now log in with your new password.
                    </p>
                    <button
                      onClick={closeModal}
                      className="w-full bg-[#FF6900] text-white py-3 rounded-lg font-medium hover:bg-[#ff6a00d6] transition"
                    >
                      Close
                    </button>
                  </div>
                )}

                {step !== 4 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => {
                        if (step === 1) closeModal();
                        else setStep(step - 1);
                      }}
                      className="text-sm text-[#FF6900] hover:text-[#002db3]"
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PasswordResetModal;