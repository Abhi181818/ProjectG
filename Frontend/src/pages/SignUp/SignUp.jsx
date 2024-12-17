import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Globe,
  MapPin,
  Building,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlusIcon,
} from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import { auth, db, googleProvider } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';
import { doc, setDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const countries = Country.getAllCountries();
  const states = country ? State.getStatesOfCountry(country) : [];
  const cities = state ? City.getCitiesOfState(country, state) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name': setName(value); break;
      case 'email': setEmail(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPassword': setConfirmPassword(value); break;
    }
  };

  const validateFields = () => {
    const validationErrors = {};

    if (!name) validationErrors.name = 'Name is required';

    if (!email) validationErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Email is not valid';

    if (!password) validationErrors.password = 'Password is required';
    else if (password.length < 8) validationErrors.password = 'Password must be at least 8 characters';

    if (password !== confirmPassword) validationErrors.confirmPassword = 'Passwords do not match';

    if (!country) validationErrors.country = 'Country is required';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = userCredential.user;

      await setDoc(doc(db, 'users', userData.uid), {
        name,
        email,
        country,
        state,
        city,
        interests: []
      });

      toast.success('Registration successful', {
        duration: 3000,
      });
      navigate('/interests');
    } catch (error) {
      setErrors((prev) => ({ ...prev, server: error.message }));
      toast.error(error.message, {
        duration: 3000,
      });
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        country: '',
        state: '',
        city: '',
        interests: []
      });

      toast.success('Google signup successful', {
        duration: 3000,
      });
      navigate('/interests');
    } catch (error) {
      toast.error('Google signup failed', {
        duration: 3000,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <Helmet>
        <title>Ziplay : Signup</title>
        <meta name="description" content="Create your Ziplay account" />
        <meta name="keywords" content="signup, registration, account creation" />
      </Helmet>

      {/* Left Side - Background Image */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:block relative"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://ideogram.ai/assets/image/lossless/response/DfAAJEvoSs6fS0VrkxVoaA)',
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-80" />
        <div className="relative z-10 flex items-center justify-center h-full p-12 text-white">
          <div className="text-center max-w-md">
            <h1 className="text-5xl font-bold mb-6 tracking-tight">Welcome to Ziplay</h1>
            <p className="text-xl opacity-90">Create your account and start connecting with people around the world</p>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Signup Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center px-6 py-12 lg:px-8 bg-gray-50"
      >
        <div className="w-full max-w-xl space-y-8">
          <div className="text-center">
            <img
              alt="Ziplay Logo"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-16 w-auto"
            />
            <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
              Create Your Account
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Join Ziplay and connect with the world
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Input fields with enhanced styling */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Name Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder='Full Name'
                    value={name}
                    onChange={handleChange}
                    className={`pl-10 p-3 block w-full rounded-lg border ${errors.name
                      ? 'border-red-500 ring-1 ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      } shadow-sm`}
                  />
                  {errors.name && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder='Email Address'
                    value={email}
                    onChange={handleChange}
                    className={`pl-10 p-3 block w-full rounded-lg border ${errors.email
                      ? 'border-red-500 ring-1 ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      } shadow-sm`}
                  />
                  {errors.email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Password Inputs */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Password Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder='Password'
                    value={password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 p-3 block w-full rounded-lg border ${errors.password
                      ? 'border-red-500 ring-1 ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      } shadow-sm`}
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password Input */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 p-3 block w-full rounded-lg border ${errors.confirmPassword
                      ? 'border-red-500 ring-1 ring-red-500'
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                      } shadow-sm`}
                  />
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
            {/* Location Selection */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setState('');
                    setCity('');
                  }}
                  className={`pl-10 p-3 block w-full rounded-lg border ${errors.country
                    ? 'border-red-500 ring-1 ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                    } shadow-sm`}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {country && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setCity('');
                    }}
                    className="pl-10 p-3 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {state && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pl-10 p-3 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-semibold 
    bg-gradient-to-r from-indigo-600 to-purple-600 
    hover:from-indigo-700 hover:to-purple-700 
    transition-all duration-300 ease-in-out 
    transform hover:scale-[1.02] 
    shadow-lg hover:shadow-xl 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
    flex items-center justify-center space-x-2"
              >
                <span>Create Account</span>
                <UserPlusIcon className="h-4" />
              </button>

              <div className="flex items-center justify-center space-x-4">
                <div className="h-px bg-gray-300 flex-grow"></div>
                <span className="text-gray-500 text-sm font-medium">or</span>
                <div className="h-px bg-gray-300 flex-grow"></div>
              </div>

              {/* Google Signup with Modern Styling */}
              <button
                onClick={handleGoogleSignup}
                className="w-full flex justify-center items-center py-3.5 
    rounded-xl border border-gray-300 
    bg-white text-gray-700 
    hover:bg-gray-50 
    transition-all duration-300 
    transform hover:scale-[1.02] 
    shadow-md hover:shadow-lg 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FcGoogle className="h-6 w-6 mr-3" />
                <span className="font-semibold">Continue with Google</span>
              </button>

              {/* Login Redirect with Softer Styling */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-indigo-600 font-semibold 
        hover:text-indigo-700 
        transition-colors duration-300"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div >
  );
};

export default Signup;
