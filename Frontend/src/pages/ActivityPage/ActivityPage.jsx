import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import { ShoppingCartIcon, CalendarIcon, ClockIcon, UsersIcon } from '@heroicons/react/24/solid';

const ActivityPage = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Booking state
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState(1);

    const fetchActivity = async () => {
        setLoading(true);
        setError(null);
        try {
            const activityRef = doc(db, 'activities', id);
            const docSnap = await getDoc(activityRef);

            if (docSnap.exists()) {
                setActivity(docSnap.data());
            } else {
                setError('Activity not found');
            }
        } catch (error) {
            setError('Failed to load activity. Please try again.');
            console.error('Error fetching activity:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, [id]);

    const handleAddToCart = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        // Basic validation
        if (!selectedDate) {
            toast.error('Please select a date');
            return;
        }

        if (!selectedTime) {
            toast.error('Please select a time');
            return;
        }

        if (user) {
            try {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const cart = userData.cart || [];

                    // Prepare booking details
                    const bookingDetails = {
                        activityId: id,
                        title: activity.title,
                        date: selectedDate,
                        time: selectedTime,
                        numberOfPeople: numberOfPeople,
                        count: numberOfPeople
                    };

                    // Check if exact same booking already exists
                    const existingBookingIndex = cart.findIndex(
                        item =>
                            item.activityId === id &&
                            item.date === selectedDate &&
                            item.time === selectedTime
                    );

                    if (existingBookingIndex > -1) {
                        // Update existing booking
                        const updatedCart = [...cart];
                        updatedCart[existingBookingIndex].count += numberOfPeople;
                        await updateDoc(userRef, { cart: updatedCart });
                        toast.success(`Added ${numberOfPeople} more to existing booking`);
                    } else {
                        // Add new booking
                        await updateDoc(userRef, {
                            cart: arrayUnion(bookingDetails)
                        });
                        toast.success(`Added ${numberOfPeople} people to Lobby`);
                    }

                    setNumberOfPeople(1);
                    setSelectedDate('');
                    setSelectedTime('');
                }
            } catch (error) {
                console.error('Error adding activity to cart:', error.message);
                toast.error('Failed to add activity to Lobby');
            }
        } else {
            toast.error('Please log in to add activities to Lobby');
        }
    };

    // Generate time slots
    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
        '05:00 PM', '06:00 PM'
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Ziplay : {activity?.title || 'Activity Details'}</title>
                <meta name="description" content="Explore and book exciting activities" />
            </Helmet>

            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-96 bg-slate-700 text-white">
                        <svg className="animate-spin h-10 w-10 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Loading activity...</span>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-12 bg-red-50">
                        {error}
                    </div>
                ) : activity ? (
                    <div className="grid md:grid-cols-2 gap-8 p-8">
                        {/* Image and Booking Section */}
                        <div className="space-y-6">
                            {activity.imageUrl && (
                                <div className="rounded-2xl overflow-hidden shadow-lg transform transition hover:scale-105">
                                    <img
                                        src={activity.imageUrl}
                                        alt={activity.title}
                                        className="w-full h-72 object-cover"
                                    />
                                </div>
                            )}

                            <div className="bg-slate-700 text-white rounded-2xl p-6 space-y-4">
                                <div className="flex items-center space-x-4">
                                    <CalendarIcon className="h-6 w-6" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full p-2 bg-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex items-center space-x-4">
                                    <ClockIcon className="h-6 w-6" />
                                    <select
                                        value={selectedTime}
                                        onChange={(e) => setSelectedTime(e.target.value)}
                                        className="w-full p-2 bg-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="" className="text-gray-400">Choose a time</option>
                                        {timeSlots.map(slot => (
                                            <option key={slot} value={slot} className="text-white">
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <UsersIcon className="h-6 w-6" />
                                    <div className="flex items-center bg-slate-600 rounded-lg overflow-hidden">
                                        <button
                                            type="button"
                                            onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                                            className="px-3 py-2 bg-slate-500 text-white hover:bg-slate-400"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={numberOfPeople}
                                            readOnly
                                            className="w-16 text-center bg-slate-600 text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                                            className="px-3 py-2 bg-slate-500 text-white hover:bg-slate-400"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition flex items-center justify-center space-x-2"
                                >
                                    <ShoppingCartIcon className="h-6 w-6" />
                                    <span>Add to Lobby</span>
                                </button>
                            </div>
                        </div>

                        {/* Activity Details Section */}
                        <div className="space-y-6">
                            <div className="bg-slate-100 rounded-2xl p-6 shadow-md">
                                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                                    {activity.title}
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    {activity.description}
                                </p>
                                <div className="flex items-center text-slate-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span className="font-medium">{activity.city}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-slate-50 text-slate-700">
                        No activity available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityPage;