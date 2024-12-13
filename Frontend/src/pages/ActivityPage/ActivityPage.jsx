import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
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
            // alert('Please select a date');
            toast.error('Please select a date');
            return;
        }

        if (!selectedTime) {
            // alert('Please select a time');
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
        <div className="container mx-auto px-4 py-8 mt-28">

            <h2 className="text-3xl text-center font-bold text-slate-700 mb-6">
                Activity Page
            </h2>

            {loading && (
                <div className="text-center text-xl text-white">Loading activity...</div>
            )}

            {error && (
                <div className="text-center text-xl text-red-500">{error}</div>
            )}

            {activity && !loading && !error ? (
                <div className="bg-white rounded-lg p-6 shadow-lg flex flex-wrap lg:flex-nowrap">
                    <div className="w-full lg:w-1/3 flex flex-col items-center">
                        {activity.imageUrl && (
                            <img
                                src={activity.imageUrl}
                                alt={activity.title}
                                className="rounded-lg mb-4 w-full lg:w-auto"
                            />
                        )}
                        <Helmet>
                            <title>Ziplay : { activity.title}</title>
                            <meta name="description" content="description" />
                            <meta name="keywords" content="react, seo, optimization" />
                        </Helmet>

                        {/* Booking Details Section */}
                        <div className="w-full space-y-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Time
                                </label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="">Choose a time</option>
                                    {timeSlots.map(slot => (
                                        <option key={slot} value={slot}>
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Number of People
                                </label>
                                <div className="flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                                        className="px-3 py-1 bg-gray-200 rounded-l"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={numberOfPeople}
                                        readOnly
                                        className="w-16 text-center border-y border-gray-200 py-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                                        className="px-3 py-1 bg-gray-200 rounded-r"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-transform w-full"
                                onClick={handleAddToCart}
                            >
                                Add to Lobby
                            </button>
                        </div>
                    </div>

                    <div className="w-full lg:w-2/3 pl-0 lg:pl-6 flex flex-col justify-center">
                        <h3 className="text-xl font-semibold text-dark mb-4">
                            {activity.title}
                        </h3>
                        <p className="text-dark mb-4">{activity.description}</p>
                        <p className="text-dark">Location: {activity.city}</p>
                    </div>
                </div>
            ) : (
                <div className="text-center text-xl text-dark">No activity available.</div>
            )}
        </div>
    );
};

export default ActivityPage;