import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGlobe, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaSearch, 
  FaSort 
} from 'react-icons/fa';
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

    const getVenues = useCallback(async () => {
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
    }, [location]);

    useEffect(() => {
        getVenues();
    }, [getVenues]);

    const filteredVenues = venues
        .filter(venue => venue.name.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => {
            return sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });

    // Enhanced Variants for Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
                duration: 0.6
            }
        },
        hover: {
            scale: 1.03,
            boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
            transition: { 
                type: "spring",
                damping: 10,
                stiffness: 300 
            }
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-16">
            <Helmet>
                <title>Ziplay : Venues</title>
                <meta name="description" content="Explore our diverse venues" />
            </Helmet>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Modern Search and Sort Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        type: "spring",
                        damping: 12,
                        stiffness: 100 
                    }}
                    className="mb-12 bg-white shadow-xl rounded-2xl p-6"
                >
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search venues by name"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-gray-700 text-lg"
                            />
                            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        </div>
                        <div className="relative w-full md:w-auto">
                            <select
                                onChange={(e) => setSortOrder(e.target.value)}
                                value={sortOrder}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 appearance-none text-gray-700 text-lg"
                            >
                                <option value="asc">Sort A-Z</option>
                                <option value="desc">Sort Z-A</option>
                            </select>
                            <FaSort className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        </div>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center h-64"
                    >
                        <div className="animate-pulse text-2xl text-gray-500 font-semibold">
                            Loading venues...
                        </div>
                    </motion.div>
                )}

                {/* Error State */}
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center bg-red-50 border-2 border-red-200 p-8 rounded-2xl max-w-md mx-auto"
                    >
                        <p className="text-2xl font-bold text-red-600 mb-4">Oops!</p>
                        <p className="text-lg text-red-700">{error}</p>
                    </motion.div>
                )}

                {/* No Data State */}
                {!loading && !error && filteredVenues.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center bg-white shadow-lg p-12 rounded-2xl max-w-md mx-auto"
                    >
                        <p className="text-3xl font-bold text-gray-800 mb-4">No Venues Found</p>
                        <p className="text-gray-600">Try adjusting your search or sorting criteria</p>
                    </motion.div>
                )}

                {/* Venues List */}
                {!loading && !error && filteredVenues.length > 0 && (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredVenues.map((venue) => (
                                <motion.div
                                    key={venue.id}
                                    variants={itemVariants}
                                    whileHover="hover"
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transform transition-all duration-300"
                                >
                                    <motion.img
                                        src={venue.imageUrl}
                                        alt={venue.name}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-full h-56 object-cover transform transition-transform duration-300"
                                    />
                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-3 truncate">
                                            {venue.name}
                                        </h2>
                                        <div className="space-y-2 mb-4">
                                            <p className="text-gray-600 flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-blue-500" /> 
                                                <span className="truncate">{venue.address}</span>
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <FaClock className="mr-2 text-green-500" /> 
                                                {venue.openingHours}
                                            </p>
                                            <p className="text-gray-700 line-clamp-3">
                                                {venue.description}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/venues/${venue.slug}/${venue.id}`}
                                            className="inline-block w-full text-center bg-blue-600 text-white rounded-full px-6 py-3 hover:bg-blue-700 transition-colors duration-300 ease-in-out font-semibold text-lg"
                                        >
                                            Explore Venue
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AllVenues;