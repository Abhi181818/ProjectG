import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Helmet } from 'react-helmet';
const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [filter, setFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = localStorage.getItem('selectedCity');

    const getActivities = async () => {
        setLoading(true);
        setError(null);
        try {
            const activitiesRef = collection(db, 'activities');
            const querySnapshot = await getDocs(activitiesRef);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            if (location) {
                const filteredData = data.filter(activity =>
                    activity.city && activity.city.toLowerCase().includes(location.toLowerCase())
                );
                setActivities(filteredData);
            } else {
                setActivities(data);
            }
        } catch (error) {
            setError('Failed to load activities. Please try again.');
            console.error('Error fetching activities:', error.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getActivities();
    }, [location]);

    const filteredActivities = activities
        .filter(activity => activity.title.toLowerCase().includes(filter.toLowerCase()))
        .sort((a, b) => {
            return sortOrder === 'asc'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });

    return (
        <div className="container mx-auto px-4 py-8 mt-28">
            <Helmet>
                <title>Ziplay : Activities</title>
                <meta name="description" content="description" />
                <meta name="keywords" content="react, seo, optimization" />
            </Helmet>
            {/* Search and Sort Filters */}
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search by activity"
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
                    <p className="text-xl text-gray-500">Loading activities...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center text-red-500">
                    <p className="text-lg">{error}</p>
                </div>
            )}

            {/* No Data State */}
            {!loading && !error && filteredActivities.length === 0 && (
                <div className="text-center text-gray-600">
                    <p className="text-2xl font-bold mb-4">No activities found</p>
                    <p>Try changing the search query or sorting order</p>
                </div>
            )}

            {/* Activities List */}
            {!loading && !error && filteredActivities.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredActivities.map((activity) => (
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
                                    to={`/activities/${activity.slug}/${activity.id}`}
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

export default Activities;
