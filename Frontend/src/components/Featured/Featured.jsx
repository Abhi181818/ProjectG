import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h2
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl mt-5 text-white font-extrabold text-center tracking-tight h-14 bg-slate-700"
      >
        Featured Activities
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-10"
      >
        {/* Loading and Error Handling */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center text-white text-xl"
          >
            Loading activities...
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-full text-center text-red-400 text-xl"
          >
            {error}
          </motion.div>
        )}

        {/* Display fetched activities */}
        <AnimatePresence>
          {activities.length > 0 &&
            activities.map((activity) => (
              <motion.div
                key={activity.id}
                variants={cardVariants}
                whileHover="hover"
                className="bg-slate-700 rounded-2xl shadow-2xl overflow-hidden"
              >
                <motion.img
                  src={activity.imageUrl || 'https://via.placeholder.com/300x200'}
                  alt={activity.title}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-3">{activity.title}</h3>
                  <p className="text-slate-300 flex-grow mb-4">{activity.description}</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors w-full text-center block"
                      to={`/activities/${activity.slug}/${activity.id}`}
                    >
                      Book Now
                      <ArrowRightIcon className="h-6 w-6 inline-block ml-2" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}

          {/* "Browse All Activities" card */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="bg-slate-700 rounded-2xl shadow-2xl overflow-hidden relative"
          >
            <motion.img
              src="https://i0.wp.com/actionsporter.com/wp-content/uploads/2023/10/virtual-reality-experience-games-arcades-23.png?resize=1024%2C587&ssl=1"
              alt="Browse All Activities"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-6 text-center">
              <h3 className="text-2xl text-white font-bold mb-3">Browse All Activities</h3>
              <p className="text-slate-200 mb-4">Check out all the activities we have to offer!</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  className="bg-blue-600 text-white font-bold py-3 px-6 rounded-full hover:bg-blue-700 transition-colors"
                  to="/activities"
                >
                  View All
                  <ArrowRightIcon className="h-6 w-6 inline-block ml-2" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
};

export default FeaturedActivities;