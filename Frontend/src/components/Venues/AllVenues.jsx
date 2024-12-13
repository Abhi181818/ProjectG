import React, { useState, useEffect } from 'react';
import { FaGlobe, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import { Helmet } from 'react-helmet';

const AllVenues = () => {
    const [venues, setVenues] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = localStorage.getItem('selectedCity');

    const getVenues = async () => {
        setLoading(true);
        setError(null);
        try {
            const venuesRef = collection(db, 'venues');
            const querySnapshot = await getDocs(venuesRef);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            if (location) {
                const filteredData = data.filter(venue =>
                    venue.address.toLowerCase().includes(location.toLowerCase())
                );
                setVenues(filteredData);
            } else {
                setVenues(data);
            }
        } catch (error) {
            setError('Failed to load venues. Please try again.');
            console.error('Error fetching venues:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getVenues();
    }, [location]);

    const filteredVenues = venues
        .filter(venue => venue.name.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => {
            return sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });

    return (
        <div className="container mx-auto px-4 py-8 mt-28">

            <Helmet>
                <title>Ziplay : Venues</title>
                <meta name="description" content="description" />
                <meta name="keywords" content="react, seo, optimization" />
            </Helmet>
            {/* Search and Sort Filters */}
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by venue name"
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

            {/* Loading State */}
            {loading && (
                <div className="text-center">
                    <p className="text-xl text-gray-500">Loading venues...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center text-red-500">
                    <p className="text-lg">{error}</p>
                </div>
            )}

            {/* No Data State */}
            {!loading && !error && filteredVenues.length === 0 && (
                <div className="text-center text-gray-600">
                    <p className="text-2xl font-bold mb-4">No venues found</p>
                    <p>Try changing the search query or sorting order</p>
                </div>
            )}

            {/* Venues List */}
            {!loading && !error && filteredVenues.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVenues.map((venue) => (
                        <div
                            key={venue.id}
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
                                    <FaMapMarkerAlt className="inline mr-1" /> {venue.address}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <FaClock className="inline mr-1" /> {venue.openingHours}
                                </p>
                                <p className="text-gray-700 mb-4">{venue.description}</p>
                                <Link
                                    to={`/venues/${venue.slug}/${venue.id}`}
                                    className="inline-block bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-500 transition-colors mb-2"
                                >
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllVenues;
