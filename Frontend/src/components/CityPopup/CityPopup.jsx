import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { XMarkIcon } from '@heroicons/react/24/outline';

const popularCities = [
  { name: 'Mumbai', icon: <FaMapMarkerAlt /> },
  { name: 'Delhi', icon: <FaMapMarkerAlt /> },
  { name: 'Bangalore', icon: <FaMapMarkerAlt /> },
  { name: 'Kolkata', icon: <FaMapMarkerAlt /> },
  { name: 'Chennai', icon: <FaMapMarkerAlt /> },
  { name: 'Hyderabad', icon: <FaMapMarkerAlt /> },
  { name: 'Ahmedabad', icon: <FaMapMarkerAlt /> },
  { name: 'Pune', icon: <FaMapMarkerAlt /> },
  { name: 'Jaipur', icon: <FaMapMarkerAlt /> },
  { name: 'Surat', icon: <FaMapMarkerAlt /> },
  { name: 'Lucknow', icon: <FaMapMarkerAlt /> },
  { name: 'Nagpur', icon: <FaMapMarkerAlt /> },
];

const CityPopup = ({ onClose }) => {
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const selectedCity = localStorage.getItem('selectedCity');
    if (selectedCity) {
      setCity(selectedCity);
    }
  }, []);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    localStorage.setItem('selectedCity', selectedCity);
    setIsOpen(false);
    onClose();
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCities = popularCities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900/60 to-slate-700/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden relative"
          >
            {/* Close Icon */}
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setIsOpen(false); onClose(); }}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition duration-200"
            >
              <XMarkIcon className="h-7 w-7" />
            </motion.button>

            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-3xl font-extrabold mb-6 text-slate-800 tracking-tight"
            >
              Select Your City
            </motion.h2>

            {/* Search Box */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative mb-6"
            >
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search for a city..."
                className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
              />
            </motion.div>

            {/* Grid of Cities */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 h-56 overflow-y-auto border-t border-gray-200"
            >
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
              >
                {filteredCities.map((city, index) => (
                  <motion.div
                    key={city.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.4 + index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCitySelect(city.name)}
                    className="cursor-pointer flex flex-col items-center p-6 border rounded-lg bg-white hover:bg-blue-50 transition duration-300 ease-in-out"
                  >
                    <motion.div 
                      initial={{ rotate: -20 }}
                      animate={{ rotate: 0 }}
                      className="text-4xl mb-4 text-blue-600"
                    >
                      {city.icon}
                    </motion.div>
                    <span className="text-lg font-semibold text-slate-700">{city.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CityPopup;