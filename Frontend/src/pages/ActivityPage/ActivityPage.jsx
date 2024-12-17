import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet';
import {
    ShoppingCartIcon,
    CalendarIcon,
    ClockIcon,
    UsersIcon,
    StarIcon,
    // LocationMarkerIcon,
} from '@heroicons/react/24/solid';
import { 
    IndianRupeeIcon, 
    MapPinIcon, 
    TagIcon, 
    InfoIcon 
} from 'lucide-react';

const ActivityPage = () => {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Booking state
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [reviewers, setReviewers] = useState({});

    const fetchActivity = async () => {
        setLoading(true);
        setError(null);
        try {
            const activityRef = doc(db, 'activities', id);
            const docSnap = await getDoc(activityRef);

            if (docSnap.exists()) {
                const activityData = docSnap.data();
                setActivity(activityData);
                if (activityData.reviews?.length > 0) {
                    fetchReviewerNames(activityData.reviews);
                }
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

    const fetchReviewerNames = async (reviews) => {
        const names = {};
        for (const review of reviews) {
            try {
                const userDoc = await getDoc(doc(db, "users", review.userId));
                if (userDoc.exists()) {
                    names[review.userId] = userDoc.data().name;
                } else {
                    names[review.userId] = "Anonymous"; 
                }
            } catch (error) {
                console.error("Error fetching user details:", error.message);
                names[review.userId] = "Anonymous";
            }
        }
        setReviewers(names);
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
                        count: numberOfPeople,
                    };

                    // Check if exact same booking already exists
                    const existingBookingIndex = cart.findIndex(
                        (item) =>
                            item.activityId === id &&
                            item.date === selectedDate &&
                            item.time === selectedTime
                    );

                    if (existingBookingIndex > -1) {
                        // Update existing booking
                        const updatedCart = [...cart];
                        updatedCart[existingBookingIndex].count += numberOfPeople;
                        await updateDoc(userRef, { cart: updatedCart });
                        toast.success(
                            `Added ${numberOfPeople} more to existing booking`
                        );
                    } else {
                        // Add new booking
                        await updateDoc(userRef, {
                            cart: arrayUnion(bookingDetails),
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

    const timeSlots = useMemo(() => [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
        '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', 
        '05:00 PM', '06:00 PM'
    ], []);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <StarIcon 
                key={index} 
                className={`h-5 w-5 ${index < rating ? 'text-yellow-500' : 'text-gray-300'}`} 
            />
        ));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                <div className="text-center">
                    <div className="animate-pulse">
                        <svg 
                            className="mx-auto h-16 w-16 text-slate-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                            />
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                            />
                        </svg>
                    </div>
                    <p className="mt-4 text-xl text-slate-600 animate-pulse">Loading Activity...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
                <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
                    <svg 
                        className="mx-auto h-16 w-16 text-red-500 mb-4" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Oops!</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Ziplay : {activity?.title || 'Activity Details'}</title>
                <meta name="description" content="Explore and book exciting activities" />
            </Helmet>

            <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border-2 border-slate-100">
                {loading ? (
                    <div className="flex justify-center items-center h-96 bg-slate-700 text-white">
                        <svg
                            className="animate-spin h-10 w-10 mr-3"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span>Loading activity...</span>
                    </div>
                ): error ? (
                    <div className="text-center text-red-500 py-12 bg-red-50">
                    {error}
                </div>                ) : activity ? (
                    <div className="grid md:grid-cols-2 gap-10 p-10">
                        {/* Image and Booking Section */}
                        <div className="space-y-8">
                            {activity.imageUrl && (
                                <div className="rounded-3xl overflow-hidden shadow-xl group relative">
                                    <img
                                        src={activity.imageUrl}
                                        alt={activity.title}
                                        className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300"></div>
                                </div>
                            )}

                            <div className="bg-slate-800 text-white rounded-3xl p-8 space-y-6 shadow-2xl">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-4">
                                        <CalendarIcon className="h-7 w-7 text-blue-400" />
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full p-3 bg-slate-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 transition"
                                        />
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <ClockIcon className="h-7 w-7 text-green-400" />
                                        <select
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                            className="w-full p-3 bg-slate-700 text-white rounded-xl focus:ring-2 focus:ring-green-500 transition"
                                        >
                                            <option value="" className="text-gray-400">Choose a time</option>
                                            {timeSlots.map((slot) => (
                                                <option key={slot} value={slot} className="text-white">
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <UsersIcon className="h-7 w-7 text-purple-400" />
                                    <div className="flex items-center bg-slate-700 rounded-xl overflow-hidden w-full">
                                        <button
                                            type="button"
                                            onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                                            className="px-4 py-3 bg-slate-600 text-white hover:bg-slate-500 transition"
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={numberOfPeople}
                                            readOnly
                                            className="w-full text-center bg-slate-700 text-white p-3"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setNumberOfPeople(numberOfPeople + 1)}
                                            className="px-4 py-3 bg-slate-600 text-white hover:bg-slate-500 transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl 
                                    hover:from-blue-600 hover:to-blue-700 transition transform hover:-translate-y-1 
                                    shadow-xl flex items-center justify-center space-x-3"
                                >
                                    <ShoppingCartIcon className="h-7 w-7" />
                                    <span className="font-semibold text-lg">Add to Lobby</span>
                                </button>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className='space-y-8'>
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-slate-100">
                                <h2 className="text-3xl font-bold text-slate-900 flex items-center">
                                    <TagIcon className="h-8 w-8 mr-3 text-blue-500" />
                                    {activity.title}
                                </h2>
                                <p className="text-gray-600 mt-4 flex items-start">
                                    <InfoIcon className="h-6 w-6 mr-3 text-green-500 flex-shrink-0 mt-1" />
                                    {activity.description}
                                </p>

                                <div className="flex items-center mt-6 space-x-4">
                                    <div className="flex items-center space-x-2 text-yellow-500">
                                        <StarIcon className="h-7 w-7" />
                                        <span className="font-semibold text-lg">
                                            {activity.rating || 'No Rating'}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-gray-600">
                                        <MapPinIcon className="h-6 w-6 text-red-500" />
                                        <span className="font-medium">{activity.location || 'Location Not Specified'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-slate-100">
                                <h3 className="text-2xl font-semibold text-slate-900 flex items-center">
                                    <IndianRupeeIcon className="h-7 w-7 mr-3 text-green-500" />
                                    Pricing Details
                                </h3>
                                <div className="flex items-center mt-4 space-x-4">
                                    <span className="text-2xl font-bold text-slate-800">
                                        ₹{activity.price || 'N/A'}
                                    </span>
                                    <span className="text-gray-500">per person</span>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-slate-100">
                                <h3 className="text-2xl font-semibold text-slate-900 mb-6">
                                    User Reviews
                                </h3>
                                <div className="space-y-5">
                                    {activity?.reviews && activity.reviews.length > 0 ? (
                                        activity.reviews.map((review, index) => (
                                            <div
                                                key={index}
                                                className="bg-slate-50 p-5 rounded-2xl shadow-md hover:shadow-lg transition"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex text-yellow-500 space-x-1">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <span className="text-gray-600 font-medium">
                                                        {reviewers[review.userId] || "Anonymous"}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">{review.review}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center">
                                            No reviews yet. Be the first to share your experience!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ActivityPage;