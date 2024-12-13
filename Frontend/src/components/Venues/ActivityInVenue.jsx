import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
            const q = query(activitiesRef, where('venueId', '==', id)); // Filter by venueId
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
        <div className="container mx-auto px-4 py-8 mt-28">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Activities in  {venueName }</h1>
            {loading && (
                <div className="text-center">
                    <p className="text-xl text-gray-500">Loading activities...</p>
                </div>
            )}
            {error && (
                <div className="text-center text-red-500">
                    <p className="text-lg">{error}</p>
                </div>
            )}
            {!loading && !error && activities.length === 0 && (
                <div className="text-center text-gray-600">
                    <p className="text-2xl font-bold mb-4">No activities found for this venue</p>
                </div>
            )}
            {!loading && !error && activities.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="bg-white border rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:bg-blue-50"
                        >
                            <img
                                src={activity.imageUrl}
                                alt={activity.title}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{activity.title}</h2>
                                <p className="text-gray-600 mb-2">
                                    <FaMapMarkerAlt className="inline mr-1" /> {activity.city}
                                </p>
                                <p className="text-gray-600 mb-2">
                                    <FaClock className="inline mr-1" /> {activity.venueId.openingHours}
                                </p>
                                <p className="text-gray-700 mb-4">{activity.description}</p>
                                <Link
                                    to={`/activities/${activity.id}`}
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

export default ActivityInVenue;
