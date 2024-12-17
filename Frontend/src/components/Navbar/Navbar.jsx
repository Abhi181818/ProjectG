import React, { useEffect, useState } from 'react';
import { Disclosure, DisclosurePanel, Menu, MenuItem, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { CiLogout } from "react-icons/ci";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, storage } from '../../firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
import Cart from '../Cart/Cart';
import CityPopup from '../CityPopup/CityPopup';
import { useUser } from '../../context/userContext';
import {
  Home,
  Tent,
  Activity,
  BellIcon,
  MapPinIcon,
  CalendarCheck,
  ScrollText,
  UserIcon,
  ShoppingCartIcon,
  LogInIcon,
  LogIn,
  UserPlus
} from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Venues', href: '/venues', icon: Tent },
  { name: 'Activities', href: '/activities', icon: Activity },
  { name: 'Bookings', href: '/bookings', icon: CalendarCheck },
  { name: 'Private Booking', href: '/about', icon: ScrollText },
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
  const { state, dispatch } = useUser();
  const [logoUrl, setLogoUrl] = useState('');

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
    const logoRef = ref(storage, 'cartLogo/logo.png');
    getDownloadURL(logoRef)
      .then((url) => {
        setLogoUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching the image URL", error);
      });

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Disclosure
        as="nav"
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled
          ? 'bg-gradient-to-r from-slate-800 to-slate-700 bg-opacity-90 backdrop-blur-lg shadow-2xl'
          : 'bg-gradient-to-r from-slate-900 to-slate-800'
          }`}
      >
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                {/* Mobile menu button */}
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-full p-2 text-gray-300 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      alt="Your Company"
                      src="https://banner2.cleanpng.com/20180604/buh/aa9l5rk2z.webp"
                      className="h-10 w-auto rounded-full transition-transform hover:scale-110"
                    />
                  </div>

                  {/* Desktop Menu */}
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            location.pathname === item.href
                              ? 'bg-slate-700 text-white'
                              : 'text-gray-300 hover:bg-slate-700 hover:text-white',
                            'flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-105'
                          )}
                        >
                          <item.icon className="h-5 w-5 mr-2 flex-shrink-0" aria-hidden="true" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Location */}
                  <div className="hidden sm:flex items-center text-gray-300 mr-3">
                    <MapPinIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    <span className="text-sm font-medium">{storedCity}</span>
                    <button
                      onClick={handleChangeCity}
                      className="ml-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Change
                    </button>
                  </div>

                  {/* Notifications */}
                  <button className="relative rounded-full p-2 text-gray-300 hover:bg-slate-700 hover:text-white focus:outline-none transition-all duration-200 mr-2">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {/* Cart */}
                  <button
                    onClick={openCart}
                    className="relative rounded-full p-2 text-gray-300 hover:bg-slate-700 hover:text-white focus:outline-none transition-all duration-200"
                  >
                    <span className="sr-only">View cart</span>
                    <ShoppingCartIcon className="h-5 w-5" aria-hidden="true" />
                  </button>

                  {state.user ? (
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex items-center focus:outline-none">
                          <span className="sr-only">Open user menu</span>
                          <img
                            src={state.user.avatar}
                            alt="User"
                            className="h-9 w-9 rounded-full ring-2 ring-blue-500 ring-opacity-50 hover:ring-opacity-80 transition-all duration-300 ease-in-out"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={React.Fragment}
                        enter="transition transform ease-out duration-300"
                        enterFrom="opacity-0 scale-90 -translate-y-4"
                        enterTo="opacity-100 scale-100 translate-y-0"
                        leave="transition transform ease-in duration-200"
                        leaveFrom="opacity-100 scale-100 translate-y-0"
                        leaveTo="opacity-0 scale-90 translate-y-4"
                      >
                        <Menu.Items className="absolute right-0 z-50 mt-3 w-64 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-subtle-bounce">
                          <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                            <p className="text-sm font-semibold text-gray-900">{state.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{state.user.email}</p>
                          </div>

                          <div className="py-1">
                            <MenuItem>
                              {({ active }) => (
                                <Link
                                  to="/profile"
                                  className={`
                                  ${active ? 'bg-blue-50 text-blue-800' : 'text-gray-700'}
                                  flex items-center px-4 py-2 text-sm transition-colors duration-200
                                `}
                                >
                                  <UserIcon className="h-5 w-5 mr-3 text-blue-500" />
                                  Profile
                                </Link>
                              )}
                            </MenuItem>

                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/settings"
                                  className={`
                                  ${active ? 'bg-blue-50 text-blue-800' : 'text-gray-700'}
                                  flex items-center px-4 py-2 text-sm transition-colors duration-200
                                `}
                                >
                                  <CogIcon className="h-5 w-5 mr-3 text-blue-500" />
                                  Settings
                                </Link>
                              )}
                            </Menu.Item>

                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleLogout}
                                  className={`
                                  ${active ? 'bg-red-50 text-red-800' : 'text-gray-700'}
                                  flex items-center w-full px-4 py-2 text-sm text-left transition-colors duration-200
                                `}
                                >
                                  <CiLogout className="h-5 w-5 mr-3 text-red-500" />
                                  Logout
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Link to="/login">
                        <button className="px-3 py-1.5 text-sm font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors flex items-center">
                          <LogIn className="mr-2 h-4 w-4" />
                          Login
                        </button>
                      </Link>
                      <Link to="/signup">
                        <button className="px-3 py-1.5 text-sm font-bold text-white bg-purple-600 rounded-full hover:bg-purple-700 transition-colors flex items-center">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Signup
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <DisclosurePanel className="sm:hidden bg-slate-800">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? 'bg-slate-700 text-white'
                        : 'text-gray-300 hover:bg-slate-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium transition-colors'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
      <Cart isOpen={isCartOpen} onClose={closeCart} />
      {showPopup && <CityPopup onClose={() => setShowPopup(false)} />}
    </>
  );
}