import React, { useState, useEffect } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';  // Adjust this import to your actual Firebase config path

const FeaturedActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch activities from Firestore
  const getActivities = async () => {
    try {
      const activitiesRef = collection(db, 'activities');
      const querySnapshot = await getDocs(activitiesRef);
      const data = querySnapshot.docs.map((doc) => ({
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

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <section className="py-12 relative overflow-hidden">
      <h2 className="text-3xl text-white font-bold text-center bg-slate-700 p-3 mb-6">
        Featured Activities
      </h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-10">
        {/* Loading and Error Handling */}
        {loading && (
          <div className="text-center text-white">Loading activities...</div>
        )}
        {error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        {/* Display fetched activities */}
        {activities.length > 0 &&
          activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-slate-500 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <img
                src={activity.imageUrl || 'https://via.placeholder.com/300x200'}
                alt={activity.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6 flex flex-col">
                <h3 className="text-xl font-semibold text-white">{activity.title}</h3>
                <p className="mt-2 text-white flex-grow">{activity.description}</p>
                <div className="mt-4">
                  <Link
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition-transform w-full text-center block"
                    to={`/activities/${activity.slug}/${activity.id}`}
                  >
                    Book Now
                    <ArrowRightIcon className="h-6 w-6 inline-block ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

        {/* "Browse All Activities" card */}
        <div className="bg-slate-500 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform relative">
          <img
            src="https://i0.wp.com/actionsporter.com/wp-content/uploads/2023/10/virtual-reality-experience-games-arcades-23.png?resize=1024%2C587&ssl=1"
            alt="Browse All Activities"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
            <h3 className="text-xl text-white font-semibold">Browse All Activities</h3>
            <p className="mt-2 text-white">Check out all the activities we have to offer!</p>
            <Link
              className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
              to="/activities"
            >
              View All
              <ArrowRightIcon className="h-6 w-6 inline-block ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedActivities;
