import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { auth, googleProvider } from '../firebase';
import { useUser } from '../context/userContext';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { Helmet } from 'react-helmet';
import { 
  LockIcon, 
  MailIcon, 
  EyeIcon, 
  EyeOffIcon, 
  LogInIcon 
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { dispatch } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const validateFields = () => {
    const validationErrors = {};
    if (!email) validationErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Email is not valid';
    if (!password) validationErrors.password = 'Password is required';
    if (password.length < 6) validationErrors.password = 'Password must be at least 6 characters';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = userCredential.user;

      dispatch({ type: 'SET_USER', payload: userData });

      toast.success('Login successful', { duration: 3000 });
      navigate('/');
    } catch (error) {
      setErrors((prev) => ({ ...prev, server: error.message }));
      toast.error(error.message, { duration: 3000 });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = result.user;
      dispatch({ type: 'SET_USER', payload: userData });

      toast.success('Logged in with Google', { duration: 3000 });
      navigate('/');
    } catch (error) {
      toast.error(error.message, { duration: 3000 });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <Helmet>
        <title>Ziplay : Login</title>
        <meta name="description" content="Login to your Ziplay account" />
      </Helmet>

      {/* Left section (Login Form) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-blue-100 p-4 rounded-full">
                <LogInIcon className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800">
              Welcome Back
            </h2>
            <p className="mt-2 text-slate-600">Sign in to continue to Ziplay</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                placeholder="Enter your email"
                onChange={handleChange}
                className={`pl-10 p-3 block w-full rounded-xl border-2 text-slate-900 
                  ${errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                placeholder="Enter your password"
                onChange={handleChange}
                className={`pl-10 pr-12 p-3 block w-full rounded-xl border-2 text-slate-900 
                  ${errors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-slate-300 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-slate-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>

              <div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 
                  border border-transparent rounded-xl shadow-sm 
                  text-sm font-semibold text-white 
                  bg-gradient-to-r from-blue-600 to-indigo-600 
                  hover:from-blue-700 hover:to-indigo-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-blue-500 transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center py-3 px-4 
                  border border-slate-300 rounded-xl shadow-sm 
                  text-sm font-medium text-slate-700 
                  bg-white hover:bg-slate-50 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-blue-500 items-center space-x-2 transition-all duration-300"
              >
                <FcGoogle className="h-6 w-6" />
                <span>Sign in with Google</span>
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right section (Image) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-700 opacity-50"></div>
        <img
          src="https://ideogram.ai/assets/image/lossless/response/UkWQ3IfgRuCOVC_PNRfvdg"
          alt="Login Illustration"
          className="z-10 h-full w-full object-cover mix-blend-overlay opacity-80"
        />
        <div className="absolute z-20 text-center text-white px-8">
          <h2 className="text-4xl font-bold mb-4">Explore. Experience. Enjoy.</h2>
          <p className="text-xl opacity-80">
            Discover amazing activities and create unforgettable memories with Ziplay
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;