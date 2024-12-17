import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, GamepadIcon, StarIcon } from 'lucide-react';
import { auth, db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

const interestsList = [
  { name: 'Classic Arcade Games', icon: GamepadIcon },
  { name: 'Fighting Games', icon: StarIcon },
  { name: 'Puzzle Games', icon: StarIcon },
  { name: 'Racing Games', icon: GamepadIcon },
  { name: 'Platformers', icon: StarIcon },
  { name: 'Adventure Games', icon: GamepadIcon },
  { name: 'Shooting Games', icon: StarIcon },
];

const Interests = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const navigate = useNavigate();

  const handleInterestChange = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedInterests.length === 0) {
      toast.error('Please select at least one interest.', {
        duration: 3000,
      });
      return;
    }

    try {
      const userId = auth.currentUser.uid;

      await updateDoc(doc(db, 'users', userId), {
        interests: selectedInterests,
      });

      toast.success('Interests updated successfully!', {
        duration: 3000,
      });
      navigate('/');
    } catch (error) {
      toast.error('Failed to update interests: ' + error.message, {
        duration: 3000,
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 px-4 py-12"
    >
      <motion.div 
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-3"
          >
            <StarIcon className="w-8 h-8 text-indigo-600" />
            Select Your Interests
            <StarIcon className="w-8 h-8 text-indigo-600" />
          </motion.h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose the game genres that excite you the most!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {interestsList.map((interest) => {
              const Icon = interest.icon;
              const isSelected = selectedInterests.includes(interest.name);
              
              return (
                <motion.div 
                  key={interest.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <label 
                    htmlFor={interest.name} 
                    className={`
                      flex items-center cursor-pointer 
                      p-3 rounded-xl border transition-all duration-300
                      ${isSelected 
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-800' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      id={interest.name}
                      checked={isSelected}
                      onChange={() => handleInterestChange(interest.name)}
                      className="hidden"
                    />
                    <div className="flex items-center w-full">
                      <Icon className={`mr-3 w-6 h-6 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`} />
                      <span className="flex-1 font-medium">{interest.name}</span>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-5 h-5 text-indigo-600" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </label>
                </motion.div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="
              w-full mt-6 py-3 rounded-xl 
              bg-indigo-600 text-white font-bold 
              hover:bg-indigo-700 transition-colors
              flex items-center justify-center gap-2
            "
          >
            <StarIcon className="w-5 h-5" />
            Save Interests
            <StarIcon className="w-5 h-5" />
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Interests;