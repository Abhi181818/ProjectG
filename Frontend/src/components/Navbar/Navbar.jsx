import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  ShoppingCartIcon,
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/userContext';
import Cart from '../Cart/Cart';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { toast } from 'sonner';
import CityPopup from '../CityPopup/CityPopup'; // Import the CityPopup component

const navigation = [
  { name: 'Home', href: '/' },
  // { name: 'About Us', href: '/about' },
  // { name: 'Contact Us', href: '/contact' },
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
  const { state, dispatch } = useUser();
  const [isCartOpen, setCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  // const currUser=auth.currentUser;

  const storedCity = localStorage.getItem('selectedCity');

  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: 'CLEAR_USER' });
      toast.success('Logout successful', {
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChangeCity = () => {
    setShowPopup(true); 
    // console.log('Change city');
  };

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
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                <XMarkIcon className="hidden h-6 w-6" aria-hidden="true" />
              </DisclosureButton>
            </div>
            <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      aria-current={location.pathname === item.href ? 'page' : undefined}
                      className={classNames(
                        location.pathname === item.href
                          ? 'bg-slate-800 text-white'
                          : 'text-gray-300 hover:bg-slate-600 hover:text-white hover:scale-110 transition-transform',
                        'rounded-md px-3 py-2 text-lg font-extrabold'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              {/* Display the selected city */}
              <div className="flex items-center text-gray-300">
                <MapPinIcon className="h-6 w-6 mr-1" aria-hidden="true" />
                <span className="text-lg">{storedCity || 'Select City'}</span>
                <button
                  onClick={handleChangeCity}
                  className="ml-2 text-sm text-blue-400 hover:underline"
                >
                  Change
                </button>
              </div>

              <button
                type="button"
                className="relative rounded-full bg-slate-700 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-700"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              <button
                onClick={openCart}
                className="ml-3 relative rounded-full bg-slate-700 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-700"
              >
                <span className="sr-only">View cart</span>
                <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
              </button>

              {state.user ? (
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="flex rounded-full bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-700 hover:scale-110 transition-transform">
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt="user avatar"
                        src={state.user.avatar? state.user.avatar : 'https://ui-avatars.com/api/?name='+state.user.name}
                        className="h-8 w-8 rounded-full"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                    <MenuItem>
                      <div className="block px-4 py-2 text-sm text-gray-700">
                        Welcome, {state.user.name}!
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Your Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              ) : (
                <>
                  <Link to="/login">
                    <button className="ml-3 px-4 py-2 text-lg text-white bg-slate-600 rounded hover:bg-slate-500 hover:scale-110 transition-transform font-extrabold">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="ml-3 px-4 py-2 text-lg text-white bg-slate-600 rounded hover:bg-slate-500 hover:scale-110 transition-transform font-extrabold">
                      Signup
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Disclosure>
      <Cart isOpen={isCartOpen} closeCart={closeCart} />
      {showPopup && <CityPopup onClose={() => setShowPopup(false)} />} 

        </>
  );
}
