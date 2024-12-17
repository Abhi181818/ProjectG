import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/userContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    TicketIcon, 
    PackageIcon, 
    CalendarClockIcon, 
    CreditCardIcon, 
    QrCodeIcon 
} from 'lucide-react';
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

  const getPaymentStatusColor = (status) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Ziplay : My Bookings</title>
        <meta name="description" content="View and manage your Ziplay bookings" />
      </Helmet>

      {state.user ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-100"
        >
          {/* User Info Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
            <div className="flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-5"
              >
                <div className="bg-white/20 p-4 rounded-full">
                  <TicketIcon className="text-white" size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">My Bookings</h2>
                  <div>
                    <p className="text-white/90 text-lg">{state.user.name}</p>
                    <p className="text-white/70 text-sm">{state.user.email}</p>
                  </div>
                </div>
              </motion.div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <PackageIcon className="text-white" size={24} />
                </div>
                <span className="text-white font-medium">Total Bookings: {bookings.length}</span>
              </div>
            </div>
          </div>

          {/* Bookings Content */}
          <div className="p-8">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-500 py-12"
              >
                <div className="animate-pulse">
                  <QrCodeIcon className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-4 text-xl">Loading bookings...</p>
                </div>
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
                    className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200 
                    hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-xl">
                      Booking #{booking.id.slice(-6)}
                    </div>

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <CalendarClockIcon className="text-blue-500" size={24} />
                        <span className="text-gray-700 font-medium">
                          {new Date(booking.createdAt).toLocaleString()}
                        </span>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border 
                        ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
                        <div className="flex items-center space-x-2 mb-2">
                          <CreditCardIcon className="text-green-500" size={20} />
                          <h4 className="font-semibold text-gray-700">Total Amount</h4>
                        </div>
                        <p className="text-indigo-600 font-bold">₹{booking.totalAmount}</p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm col-span-2">
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center space-x-2">
                          <PackageIcon className="text-blue-500" size={20} />
                          <span>Activities</span>
                        </h4>
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
                    </div>

                    <DownloadTicket booking={booking} />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16 bg-slate-100 rounded-2xl"
              >
                <QrCodeIcon className="mx-auto h-16 w-16 text-slate-400 mb-4" />
                <p className="text-xl text-gray-600">No bookings found. Start your adventure today!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-10 text-center border-2 border-slate-100"
        >
          <TicketIcon className="mx-auto h-16 w-16 text-blue-500 mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Bookings</h2>
          <p className="text-gray-600 mb-6">
            Please log in to view and manage your bookings.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Bookings;