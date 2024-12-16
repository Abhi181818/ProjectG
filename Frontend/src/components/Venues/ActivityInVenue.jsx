import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaMapMarkerAlt, FaClock, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ActivityInVenue = () => {
    const { id } = useParams(); 
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [venueName, setVenueName] = useState('');

    const getActivitiesByVenue = async () => {
        setLoading(true);
        setError(null);
        try {
            const activitiesRef = collection(db, 'activities');
            const q = query(activitiesRef, where('venueId', '==', id)); 
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setActivities(data);
        } catch (error) {
            setError('Failed to load activities. Please try again.');
            console.error('Error fetching activities:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getVenueName = async () => {
        try {
            const venueRef = collection(db, 'venues');
            const venueDoc = await getDocs(venueRef);
            const venueData = venueDoc.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            const venue = venueData.find(venue => venue.id === id);
            setVenueName(venue.name);
        } catch (error) {
            console.error('Error fetching venue name:', error.message);
        }
    }

    useEffect(() => {
        getActivitiesByVenue();
        getVenueName();
    }, [id]);

    return (
        <div className="bg-white min-h-screen py-16 px-4">
            <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="container mx-auto"
            >
                <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center 
                    bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent
                    drop-shadow-lg">
                    Activities in {venueName}
                </h1>

                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-16 h-16 border-4 border-blue-500 rounded-full"
                        />
                    </div>
                )}

                {error && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-red-600 bg-red-100 p-4 rounded-lg"
                    >
                        <p className="text-lg">{error}</p>
                    </motion.div>
                )}

                {!loading && !error && activities.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center text-gray-600 bg-gray-100 p-8 rounded-xl"
                    >
                        <p className="text-2xl font-bold mb-4">No activities found for this venue</p>
                    </motion.div>
                )}

                {!loading && !error && activities.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {activities.map((activity) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ 
                                    scale: 1.05,
                                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                                }}
                                className="bg-white border-2 border-gray-200 rounded-2xl 
                                    overflow-hidden transform transition-all duration-300 
                                    hover:border-blue-500 shadow-md"
                            >
                                <div className="relative">
                                    <img
                                        src={activity.imageUrl}
                                        alt={activity.title}
                                        className="w-full h-56 object-cover filter brightness-90 transition-all duration-300 hover:brightness-100"
                                    />
                                    <div className="absolute top-4 right-4 bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm">
                                        {activity.city}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3 
                                        bg-gradient-to-r from-blue-600 to-cyan-700 
                                        bg-clip-text text-transparent">
                                        {activity.title}
                                    </h2>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                        <span>{activity.city}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <FaClock className="mr-2 text-blue-500" />
                                        <span>{activity.venueId.openingHours}</span>
                                    </div>
                                    <p className="text-gray-700 mb-6 line-clamp-3">{activity.description}</p>
                                    <Link
                                        to={`/activities/${activity.id}`}
                                        className="group inline-flex items-center 
                                            bg-gradient-to-r from-blue-600 to-cyan-700 
                                            text-white rounded-lg px-4 py-2 
                                            hover:from-blue-700 hover:to-cyan-800 
                                            transition-all duration-300"
                                    >
                                        Learn More
                                        <FaChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ActivityInVenue;