import React, { useState, useEffect } from 'react';
import { FaGlobe, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AllVenues = () => {
    const [venues, setVenues] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const location = localStorage.getItem('selectedCity');

    const getVenues = async () => {
        try {
            const response = await fetch('http://localhost:3002/api/venues/');
            const data = await response.json();
            setVenues(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const getVenuesByLocation = async (location) => {
        try {
            const response = await fetch(`http://localhost:3002/api/venues/location/${location}`);
            const data = await response.json();
            setVenues(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        if (location) {
            getVenuesByLocation(location);
        } else {
            getVenues();
        }
    }, []);

    const filteredVenues = Array.isArray(venues)
        ? venues
            .filter(venue => venue.name.toLowerCase().includes(filter.toLowerCase()))
            .sort((a, b) => {
                return sortOrder === 'asc' 
                    ? a.name.localeCompare(b.name) 
                    : b.name.localeCompare(a.name);
            })
        : []; 

    return (
        <div className="container mx-auto px-4 py-8 mt-28">
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <input 
                    type="text" 
                    placeholder="Search by location" 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)} 
                    className="border border-gray-300 rounded-lg px-4 py-2 mb-2 md:mb-0 md:mr-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <select 
                    onChange={(e) => setSortOrder(e.target.value)} 
                    value={sortOrder} 
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="asc">Sort Ascending</option>
                    <option value="desc">Sort Descending</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredVenues.length > 0 ? (
                    filteredVenues.map(venue => (
                    <div 
                        key={venue._id} 
                        className="bg-white border rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:bg-blue-50"
                    >
                        <img 
                            src={venue.imageUrl} 
                            alt={venue.name} 
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{venue.name}</h2>
                            <p className="text-gray-600 mb-2">
                                <FaPhoneAlt className="inline mr-1" /> {venue.phoneNumber}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <FaEnvelope className="inline mr-1" /> {venue.email}
                            </p>
                            <p className="text-gray-700 mb-4">{venue.description}</p>
                            <ul className="list-disc list-inside mb-4">
                                {venue.amenities.map(amenity => (
                                    <li key={amenity} className="text-gray-600">{amenity}</li>
                                ))}
                            </ul>
                            <Link
                                to={`/venues/${venue._id}`} 
                                className="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition-colors mb-2"
                            >
                                Book Now
                            </Link>
                            <p className="text-gray-500">{venue.openingHours}</p>
                        </div>
                    </div>
                ))):(

                    <div className="text-center text-gray-600">
                        <p className="text-2xl font-bold mb-4">No venues found</p>
                        <p>Try changing the search query or sorting order</p>
                        </div>
                )}
            </div>
        </div>
    );
};

export default AllVenues;
