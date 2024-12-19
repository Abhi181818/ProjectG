import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FeaturedActivities from '../../components/Featured/Featured';
import { ArrowRightIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import Typewriter from 'typewriter-effect';
import { Link } from 'react-router-dom';
import CityPopup from '../../components/CityPopup/CityPopup';
import { Helmet } from 'react-helmet';

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
    const storedCity = localStorage.getItem('selectedCity');
    if (!storedCity) {
      setShowPopup(true);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen relative"
    >
      <Helmet>
        <title>Ziplay : Home</title>
        <meta name="description" content="description" />
        <meta name="keywords" content="react, seo, optimization" />
      </Helmet>

      <div className="relative overflow-hidden">
        <div className="pt-16">
          <div className="relative mx-auto max-w-7xl px-4 sm:relative sm:px-6 lg:px-8">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="sm:max-w-lg"
            >
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
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative"
            >
              {/* Carousel */}
              <div className="overflow-hidden relative shadow-2xl rounded-2xl h-96">
                <AnimatePresence initial={false}>
                  {images.map((image, index) => (
                    currentIndex === index && (
                      <motion.img
                        key={index}
                        src={image}
                        alt="Carousel"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 h-full w-full object-cover flex-shrink-0 rounded-2xl"
                      />
                    )
                  ))}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevImage}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-3 shadow-lg z-10"
                >
                  &lt;
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextImage}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 backdrop-blur-sm rounded-full p-3 shadow-lg z-10"
                >
                  &gt;
                </motion.button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className={`h-3 w-3 rounded-full transition-colors duration-300 ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mt-8 flex justify-center"
              >
                <Link
                  to="/book"
                  className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded-3xl hover:pl-10 hover:pr-6 bg-gray-50 group"
                >
                  <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
                  <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                    <ArrowRightIcon className="w-5 h-5 text-green-400" />
                  </span>
                  <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                    <ArrowRightIcon className="w-5 h-5 text-green-400" />
                  </span>
                  <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
                    Book Your Slot
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <FeaturedActivities />
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <CityPopup onClose={() => setShowPopup(false)} />
        </div>
      )}
    </motion.div>
  );
};

export default Home;
