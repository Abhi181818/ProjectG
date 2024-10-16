import React, { useState } from 'react';

const popularCities = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Kolkata',
  'Chennai',
  'Hyderabad',
  'Ahmedabad',
  'Pune',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Nagpur',
];

const CityPopup = ({ onClose }) => {
  const [city, setCity] = useState('');

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    localStorage.setItem('selectedCity', selectedCity); // Store the selected city in localStorage
    window.location.reload(); // Reload the page
  };

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-1/2 p-6 rounded-md shadow-lg">
        <h2 className="text-xl font-bold">Select Your City</h2>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city name"
          className="mt-2 p-2 border rounded w-full"
        />
        <ul className="mt-4">
          {popularCities.map((popularCity) => (
            <li
              key={popularCity}
              className="cursor-pointer hover:bg-gray-200 p-2"
              onClick={() => handleCitySelect(popularCity)}
            >
              {popularCity}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 text-red-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CityPopup;
