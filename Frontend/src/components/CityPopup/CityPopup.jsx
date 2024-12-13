import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa'; // You can replace this with custom icons for each city
import { XMarkIcon } from '@heroicons/react/24/outline'; // Correct import for Heroicons v2

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
  const [search, setSearch] = useState(''); // For search input
  const [isOpen, setIsOpen] = useState(true); // To track if the popup is open

  useEffect(() => {
    // Check localStorage for selected city on initial load
    const selectedCity = localStorage.getItem('selectedCity');
    if (selectedCity) {
      setCity(selectedCity);
    }
  }, []);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    localStorage.setItem('selectedCity', selectedCity); // Store the selected city in localStorage
    setIsOpen(false); // Close the popup after selection
    onClose(); // Trigger onClose function passed from the parent component
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value); // Update search term as the user types
  };

  // Filter the cities based on the search term
  const filteredCities = popularCities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div
        className={`bg-white w-full max-w-lg p-6 rounded-lg shadow-lg overflow-hidden relative transition-all transform ${isOpen ? 'scale-100' : 'scale-90'}`}
      >
        
        {/* Close Icon */}
        <button
          onClick={() => { setIsOpen(false); onClose(); }}
          className="absolute top-3 right-3 text-slate-600 hover:text-slate-800 transition duration-200"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Your City</h2>
        
        {/* Search Box */}
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search for a city..."
          className="w-full p-3 border border-slate-300 rounded-md mb-6 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />

        {/* Grid of Cities */}
        <div className="mt-4 h-56 overflow-y-auto border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <div
                key={city.name}
                className="cursor-pointer flex flex-col items-center p-6 border rounded-lg hover:bg-slate-100 transition duration-200 ease-in-out"
                onClick={() => handleCitySelect(city.name)}
              >
                <div className="text-4xl mb-4 text-slate-600">{city.icon}</div>
                <span className="text-lg font-semibold text-gray-700">{city.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPopup;
