import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/userContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Helmet } from 'react-helmet';
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-5 mt-5">
      <Helmet>
        <title>Ziplay : My Bookings</title>
        <meta name="description" content="description" />
        <meta name="keywords" content="react, seo, optimization" />
      </Helmet>
      {state.user ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-4">My Bookings</h2>
          <div className="mb-4">
            <p className="text-gray-600">Name: {state.user.name}</p>
            <p className="text-gray-600">Email: {state.user.email}</p>
            <p className="text-gray-600">Country: {state.user.country}</p>
            <p className="text-gray-600">State: {state.user.state}</p>
            <p className="text-gray-600">City: {state.user.city}</p>
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading bookings...</p>
          ) : bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-300 p-4 rounded-lg shadow-sm bg-gray-50"
                >
                  <h3 className="font-bold text-lg">Booking ID: {booking.id}</h3>
                  <p className="text-gray-600">
                    Total Amount: ₹{booking.totalAmount}
                  </p>
                  <p className="text-gray-600">
                    Payment Status: {booking.paymentStatus}
                  </p>
                  <p className="text-gray-600">
                    Payment ID: {booking.paymentId || 'N/A'}
                  </p>
                  <p className="text-gray-600">
                    Booked On: {new Date(booking.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <h4 className="font-semibold">Activities:</h4>
                    <ul className="list-disc ml-6">
                      {booking.activities.map((activity, index) => (
                        <li key={index}>
                          {activity.title} - ₹{activity.price} x {activity.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
                    Download Ticket
                  </button>

                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No bookings found. Make your first booking today!
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-4">Bookings</h2>
          <p className="text-gray-600 text-center">
            Please login to view your bookings.
          </p>
        </div>
      )}
    </div>
  );
};

export default Bookings;
