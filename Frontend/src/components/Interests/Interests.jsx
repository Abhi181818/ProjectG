import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase'; // Import Firestore
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';

const interestsList = [
  'Classic Arcade Games',
  'Fighting Games',
  'Puzzle Games',
  'Racing Games',
  'Platformers',
  'Adventure Games',
  'Shooting Games',
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

      // Update the user document with selected interests
      await updateDoc(doc(db, 'users', userId), {
        interests: selectedInterests,
      });

      toast.success('Interests updated successfully!', {
        duration: 3000,
      });
      navigate('/'); // Redirect to home or desired page
    } catch (error) {
      toast.error('Failed to update interests: ' + error.message, {
        duration: 3000,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-4 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Select Your Interests
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-10">
          {interestsList.map((interest) => (
            <div key={interest} className="flex items-center">
              <input
                type="checkbox"
                id={interest}
                checked={selectedInterests.includes(interest)}
                onChange={() => handleInterestChange(interest)}
                className="mr-2"
              />
              <label htmlFor={interest} className="text-gray-900">{interest}</label>
            </div>
          ))}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save Interests
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Interests;
