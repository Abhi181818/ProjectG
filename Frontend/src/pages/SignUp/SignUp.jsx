import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { Country, State, City } from 'country-state-city';
import { auth, db, googleProvider } from '../../firebase'; 
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';
import { doc, setDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const navigate = useNavigate();

  const countries = Country.getAllCountries();
  const states = country ? State.getStatesOfCountry(country) : [];
  const cities = state ? City.getCitiesOfState(country, state) : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const validateFields = () => {
    const validationErrors = {};
    if (!name) validationErrors.name = 'Name is required';
    if (!email) validationErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Email is not valid';
    if (!password) validationErrors.password = 'Password is required';
    if (password.length < 6) validationErrors.password = 'Password must be at least 6 characters';

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
      navigate('/interests'); // Redirect to the interests selection page
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
    <div className="flex min-h-screen bg-gray-100">
       <Helmet>
                <title>Ziplay : Signup</title>
                <meta name="description" content="description" />
                <meta name="keywords" content="react, seo, optimization" />
            </Helmet>
      <div className="hidden lg:flex w-1/2 bg-cover rounded-lg bg-center" style={{ backgroundImage: 'url(https://ideogram.ai/assets/image/lossless/response/DfAAJEvoSs6fS0VrkxVoaA)' }}>
      </div>

      <div className="flex border shadow-lg w-full rounded-lg lg:w-1/2 items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create your account
            </h2>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-xl font-medium leading-6 text-gray-900">Name</label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder='John Doe'
                  required
                  value={name}
                  onChange={handleChange}
                  className={`p-2 h-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  hover:shadow-lg focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg sm:leading-6 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <span className="text-red-500">{errors.name}</span>}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xl font-medium leading-6 text-gray-900">Email address</label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder='your@email.com'
                  required
                  value={email}
                  onChange={handleChange}
                  className={`hover:shadow-lg p-2 h-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg sm:leading-6 ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <span className="text-red-500">{errors.email}</span>}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xl font-medium leading-6 text-gray-900">Password</label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder='********'
                  required
                  value={password}
                  onChange={handleChange}
                  className={`hover:shadow-lg p-2 h-10 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg sm:leading-6 ${errors.password ? 'border-red-500' : ''}`}
                />
                {errors.password && <span className="text-red-500">{errors.password}</span>}
              </div>
            </div>

            {/* Location Selection */}
            <div className="max-w-md mx-auto p-4 border rounded shadow-md mt-4">
              <h2 className="text-lg font-semibold mb-4">Select Location</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Country</label>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setState('');
                    setCity('');
                  }}
                  className="block w-full border rounded p-2"
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
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">State</label>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setCity('');
                    }}
                    className="block w-full border rounded p-2"
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
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="block w-full border rounded p-2"
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

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>

            {errors.server && <span className="text-red-500">{errors.server}</span>}
          </form>

          <div className="mt-4 text-center">or</div>
          <div className="flex justify-center mt-4">
            <button
              onClick={handleGoogleSignup}
              className="flex justify-center items-center rounded-full bg-white px-4 py-2 text-sm font-semibold leading-6 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <FcGoogle className="h-6 w-6 mr-2" /> 
              <span>Sign Up with Google</span>
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{' '}
            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
