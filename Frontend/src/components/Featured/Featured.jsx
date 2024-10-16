import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const activities = [
  {
    id: 1,
    title: 'Laser Tag',
    description: 'Join an exciting battle in our laser tag arena as ass as a sa !',
    imageUrl: 'https://via.placeholder.com/300x200',
    city:"B"
  },
  {
    id: 2,
    title: 'Bowling',
    description: 'Have a fun time with friends at our bowling alley!',
    imageUrl: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Arcade Games',
    description: 'Play a variety of classic and modern arcade games!',
    imageUrl: 'https://via.placeholder.com/300x200',
  },{
    id: 4,
    title: 'Arcade Games',
    description: 'Play a variety of classic and modern arcade games!',
    imageUrl: 'https://via.placeholder.com/300x200',
  },{
    id: 5,
    title: 'Arcade Games',
    description: 'Play a variety of classic and modern arcade games!',
    imageUrl: 'https://via.placeholder.com/300x200',
  },
];

const FeaturedActivities = () => {
  return (
    <section className="py-12 relative overflow-hidden ">
      <h2 className="text-3xl text-white font-bold text-center bg-slate-700 p-3 mb-6">Featured Activities</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map(activity => (
          <div key={activity.id} className="bg-slate-500 rounded-lg shadow-lg overflow-hidden
          hover:scale-110 transition-transform">
            <img src={activity.imageUrl} alt={activity.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold">{activity.title}</h3>
              <p className="mt-2  text-white">{activity.description}</p>
              <button className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600  transition-transform"
              >
                Book Now
                <ArrowRightIcon className="h-6 w-6 inline-block ml-2" />

              </button>
            </div>
          </div>
        ))}

<div className="bg-slate-500 rounded-lg shadow-lg overflow-hidden hover:scale-110 transition-transform relative">
          <img src="https://i0.wp.com/actionsporter.com/wp-content/uploads/2023/10/virtual-reality-experience-games-arcades-23.png?resize=1024%2C587&ssl=1" alt="Browse All Activities" className="w-full  h-full object-cover" />
          <div className="absolute inset-0 flex flex-col justify-center items-center p-6 text-center">
            <h3 className="text-xl text-white font-semibold">Browse All Activities</h3>
            <p className="mt-2 text-white">Check out all the activities we have to offer!</p>
            <Link className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
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
