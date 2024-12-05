import React, { useEffect, useState } from 'react';
import { Disclosure, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MapPinIcon, ShoppingCartIcon, BellIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'sonner';
import Cart from '../Cart/Cart';
import CityPopup from '../CityPopup/CityPopup';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Venues', href: '/venues' },
  { name: 'Activities', href: '/activities' },
  { name: 'Bookings', href: '/bookings' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const storedCity = localStorage.getItem('selectedCity') || 'Select City';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout successful');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const handleChangeCity = () => setShowPopup(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Disclosure
        as="nav"
        className={`fixed top-0 z-50 w-full transition-all ${
          isScrolled
            ? 'bg-slate-700 bg-opacity-70 backdrop-blur-md shadow-md'
            : 'bg-slate-700'
        }`}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Mobile menu button */}
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                {/* Logo */}
                <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      alt="Your Company"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      className="h-8 w-auto"
                    />
                  </div>

                  {/* Desktop Menu */}
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            location.pathname === item.href
                              ? 'bg-slate-800 text-white'
                              : 'text-gray-300 hover:bg-slate-600 hover:text-white hover:scale-110 transition-transform',
                            'rounded-md px-3 py-2 text-lg font-bold'
                          )}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Location */}
                  <div className="hidden sm:flex items-center text-gray-300">
                    <MapPinIcon className="h-6 w-6 mr-1" aria-hidden="true" />
                    <span className="text-lg">{storedCity}</span>
                    <button
                      onClick={handleChangeCity}
                      className="ml-2 text-sm text-blue-400 hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  {/* Notifications */}
                  <button className="relative rounded-full bg-slate-700 p-1 text-gray-400 hover:text-white focus:outline-none">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Cart */}
                  <button
                    onClick={openCart}
                    className="ml-3 relative rounded-full bg-slate-700 p-1 text-gray-400 hover:text-white focus:outline-none"
                  >
                    <span className="sr-only">View cart</span>
                    <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* User Authentication */}
                  <div className="ml-3">
                    <Link to="/login">
                      <button className="px-4 py-2 text-lg text-white bg-slate-600 rounded hover:bg-slate-500 font-bold">
                        Login
                      </button>
                    </Link>
                    <Link to="/signup">
                      <button className="ml-3 px-4 py-2 text-lg text-white bg-slate-600 rounded hover:bg-slate-500 font-bold">
                        Signup
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <DisclosurePanel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? 'bg-slate-800 text-white'
                        : 'text-gray-300 hover:bg-slate-600 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex items-center text-gray-300 mt-3">
                  <MapPinIcon className="h-6 w-6 mr-1" aria-hidden="true" />
                  <span className="text-lg">{storedCity}</span>
                  <button
                    onClick={handleChangeCity}
                    className="ml-2 text-sm text-blue-400 hover:underline"
                  >
                    Change
                  </button>
                </div>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      <Cart isOpen={isCartOpen} closeCart={closeCart} />
      {showPopup && <CityPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}
