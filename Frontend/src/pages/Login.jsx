import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // For notifications
import { auth, googleProvider } from '../firebase'; // Import the auth and Google provider instance
import { useUser } from '../context/userContext';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { Helmet } from 'react-helmet';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      // Set the user in context
      dispatch({ type: 'SET_USER', payload: userData });

      toast.success('Login successful', {
        duration: 3000,
      });
      navigate('/');
      console.log('User logged in:', userData);
    } catch (error) {
      setErrors((prev) => ({ ...prev, server: error.message }));
      toast.error(error.message, {
        duration: 3000,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = result.user;

      // Set the user in context
      dispatch({ type: 'SET_USER', payload: userData });

      toast.success('Logged in with Google', {
        duration: 3000,
      });
      navigate('/');
      console.log('Google user logged in:', userData);
    } catch (error) {
      toast.error(error.message, {
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
       <Helmet>
        <title>Ziplay : Login</title>
        <meta name="description" content="description" />
        <meta name="keywords" content="react, seo, optimization" />
      </Helmet>
      {/* Left section (Login Form) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-100 p-6 md:p-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xl font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    placeholder="your@email.com"
                    onChange={handleChange}
                    className={`p-2 h-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && <span className="text-red-500">{errors.email}</span>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-xl font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    placeholder="********"
                    onChange={handleChange}
                    className={`p-2 h-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.password && <span className="text-red-500">{errors.password}</span>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="flex justify-center mt-4">
            <button
              onClick={handleGoogleLogin}
              className="flex justify-center items-center rounded-full bg-white px-4 py-2 text-sm font-semibold leading-6 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <FcGoogle className="h-6 w-6 mr-2" /> 
              <span>Sign In with Google</span>
            </button>
          </div>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{' '}
              <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right section (Image) */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-indigo-600">
        <img
          src="https://ideogram.ai/assets/image/lossless/response/UkWQ3IfgRuCOVC_PNRfvdg"
          alt="Right Section"
          className="h-full max-w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;