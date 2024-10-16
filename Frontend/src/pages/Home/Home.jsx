import React, { useState, useEffect } from 'react';
import FeaturedActivities from '../../components/Featured/Featured';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Typewriter from 'typewriter-effect';
import { Link } from 'react-router-dom';
import CityPopup from '../../components/CityPopup/CityPopup'; // Import the new CityPopup component

const Home = () => {
  const images = [
    "https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg",
    "https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg", 
    "https://mdbootstrap.com/img/Photos/Slides/img%20(130).jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const storedCity = localStorage.getItem('selectedCity'); // Check for a stored city
    if (!storedCity) {
      setShowPopup(true); // Show the popup only if no city is stored
    }
  }, []);

  return (
    <div>
      <div className="relative overflow-hidden bg-white">
        <div className="pt-16">
          <div className="relative mx-auto max-w-7xl px-4 sm:relative sm:px-6 lg:px-8">
            <div className="sm:max-w-lg">
              <div className="h-32">
                <Typewriter
                  options={{
                    strings: ['Tired of standing in queue?'],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    wrapperClassName: 'text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl',
                  }}
                />
              </div>
              <div className="h-32 mt-4">
                <Typewriter
                  options={{
                    strings: ["This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care if you live or die"],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                    wrapperClassName: 'text-xl text-gray-500',
                  }}
                />
              </div>
            </div>
            <div className="relative">
              {/* Carousel */}
              <div className="overflow-hidden relative">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Carousel"
                      className="h-96 w-full object-cover flex-shrink-0 rounded-md" />
                  ))}
                </div>
                <button
                  onClick={prevImage}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
                >
                  &lt;
                </button>
                <button
                  onClick={nextImage}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg z-10"
                >
                  &gt;
                </button>
              </div>
              <div className="flex justify-center mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
              <Link to="/book" className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group">
                <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
                <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                  <ArrowRightIcon className="w-5 h-5 text-green-400" />
                </span>
                <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                  <ArrowRightIcon className="w-5 h-5 text-green-400" />
                </span>
                <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">Book Your Slot</span>
              </Link>
            </div>
          </div>
        </div>
        <FeaturedActivities />
      </div>
      
      {showPopup && <CityPopup onClose={() => setShowPopup(false)} />} 
    </div>
  );
};

export default Home;
