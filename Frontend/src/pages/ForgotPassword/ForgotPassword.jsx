import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Info, KeyRound, ShieldCheck } from 'lucide-react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = ({ user }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isGoogleUser = user?.providerData?.some(
        (provider) => provider.providerId === 'google.com'
    );

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (isGoogleUser) {
            setError('Google Sign-In users cannot reset password');
            return;
        }
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            setIsLoading(true);
            setError('');
            setSuccess('');

            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);

            setSuccess('Password reset email sent. Check your inbox.');
            setEmail('');
        } catch (err) {
            switch (err.code) {
                case 'auth/user-not-found':
                    setError('No account associated with this email exists');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address');
                    break;
                case 'auth/too-many-requests':
                    setError('Too many requests. Please try again later.');
                    break;
                default:
                    setError('Failed to send password reset email. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isGoogleUser) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-2xl border border-yellow-200"
            >
                <div className="flex items-center text-yellow-600 mb-4">
                    <Info className="mr-3 w-8 h-8" />
                    <p className="text-sm font-medium">
                        You are signed in with Google. Password reset is not available for Google Sign-In accounts.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
                    <h2 className="text-3xl font-bold text-white flex items-center justify-center">
                        <KeyRound className="mr-3 w-8 h-8" />
                        Reset Password
                    </h2>
                </div>

                <div className="p-8">
                    <div className="mb-6 text-center">
                        <p className="text-gray-600 mb-2">
                            Enter the email address associated with your account
                        </p>
                        <p className="text-sm text-gray-500">
                            We'll send you a link to reset your password
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="text-gray-400 w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            />
                        </motion.div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
                            >
                                <Lock className="mr-3 text-red-500 w-6 h-6" />
                                <span className="text-sm">{error}</span>
                            </motion.div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
                            >
                                <ShieldCheck className="mr-3 text-green-500 w-6 h-6" />
                                <span className="text-sm">{success}</span>
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                                isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Remember your password? <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold">Sign In</a>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;