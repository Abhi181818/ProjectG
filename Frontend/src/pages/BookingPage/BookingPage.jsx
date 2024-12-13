import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BookingPage = () => {
  const { activityName } = useParams(); // Get the activity name from the URL
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {



      const fetchVenues = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_KEY}/api/venues?activity=${activityName}`);
        const data = await response.json();
        setVenues(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setLoading(false);
      }
    };

    fetchVenues();
  }, [activityName]);

  return (
    <section className="py-12">
      <h2 className="text-3xl text-center font-bold text-slate-700 mb-6">
        Book {activityName.replace('-', ' ')} Now
      </h2>

      {loading ? (
        <div className="text-center text-xl">Loading...</div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.length > 0 ? (
            venues.map((venue, index) => (
              <div key={index} className="bg-slate-500 rounded-lg p-6 shadow-lg flex flex-col">
                <h3 className="text-xl font-semibold text-white">{venue.name}</h3>
                <p className="mt-2 text-white flex-grow">{venue.description}</p>
                <p className="mt-2 text-white">Location: {venue.address}</p>
                <div className="mt-4">
                  <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-transform w-full">
                    Book Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-xl text-white">No venues available for this activity.</div>
          )}
        </div>
      )}
    </section>
  );
};

export default BookingPage;
