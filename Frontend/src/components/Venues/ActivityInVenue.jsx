import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaMapMarkerAlt, FaClock, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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

                {!loading && !error && activities?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {activities.map((activity) => (
                                <motion.div
                                    key={activity.id}
                                    whileHover="hover"
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 transform transition-all duration-300"
                                >
                                    <motion.img
                                        src={activity.imageUrl}
                                        alt={activity.title}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="w-full h-56 object-cover transform transition-transform duration-300"
                                    />
                                    <div className="p-6">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-3 truncate">
                                            {activity.title}
                                        </h2>
                                        <div className="absolute top-4 right-4 bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm">
                                            {activity.city}
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <p className="text-gray-600 flex items-center">
                                                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                                <span className="truncate">{activity.city}</span>
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <FaClock className="mr-2 text-green-500" />
                                                {activity.venueId.openingHours}
                                            </p>

                                            <p className="text-gray-700 line-clamp-3">
                                                {activity.description?.length > 30
                                                    ? `${activity.description.slice(0, 30)}...`
                                                    : activity.description}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/activities/${activity.slug}/${activity.id}`}
                                            className="inline-block w-full text-center bg-blue-600 text-white rounded-full px-6 py-3 hover:bg-blue-700 transition-colors duration-300 ease-in-out font-semibold text-lg"
                                        >
                                            Learn More
                                            <ArrowRight className="inline-block ml-2" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ActivityInVenue;