import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/userContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, TicketIcon } from 'lucide-react';
import DownloadTicket from './DownloadTicket';

const Bookings = () => {
  const { state } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (state.user) {
        try {
          setLoading(true);
          const bookingsRef = collection(db, 'bookings');
          const q = query(bookingsRef, where('userId', '==', state.user.uid));
          const querySnapshot = await getDocs(q);

          const fetchedBookings = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setBookings(fetchedBookings);
        } catch (error) {
          console.error('Error fetching bookings:', error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookings();
  }, [state.user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Ziplay : My Bookings</title>
        <meta name="description" content="description" />
        <meta name="keywords" content="react, seo, optimization" />
      </Helmet>

      {state.user ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* User Info Section */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-bold text-white mb-2"
            >
              My Bookings
            </motion.h2>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full">
                <TicketIcon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-white/90">{state.user.name}</p>
                <p className="text-white/70 text-sm">{state.user.email}</p>
              </div>
            </div>
          </div>

          {/* Bookings Content */}
          <div className="p-6">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500"
              >
                Loading bookings...
              </motion.div>
            ) : bookings.length > 0 ? (
              <AnimatePresence>
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1
                    }}
                    className="bg-gray-50 rounded-xl p-5 mb-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Booking #{booking.id.slice(-6)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.paymentStatus === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600">
                        Total Amount:
                        <span className="font-semibold text-indigo-600 ml-2">
                          ₹{booking.totalAmount}
                        </span>
                      </p>
                      <p className="text-gray-500 text-sm">
                        Booked On: {new Date(booking.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-2">Activities</h4>
                      {booking.activities.map((activity, actIndex) => (
                        <div
                          key={actIndex}
                          className="flex justify-between border-b last:border-b-0 py-2"
                        >
                          <span>{activity.title}</span>
                          <span className="text-gray-600">
                            ₹{activity.price} x {activity.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-indigo-700 transition-colors"
                    >
                      <Download size={20} />
                      <span>Download Ticket</span>
                    </motion.button> */}
                    <DownloadTicket booking={booking} />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 text-gray-500"
              >
                <p>No bookings found. Make your first booking today!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Bookings</h2>
          <p className="text-gray-600">
            Please login to view your bookings.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Bookings;