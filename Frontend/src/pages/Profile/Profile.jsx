import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/userContext';
import { db, storage } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
import { FaPlus, FaTimes, FaUpload, FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Profile = () => {
    const { state } = useUser();
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        phone: '',
        country: '',
        state: '',
        city: '',
        profession: '',
        bio: '',
        avatar: '',
    });
    const [interests, setInterests] = useState([]);
    const [avatarFile, setAvatarFile] = useState(null);

    const interestsList = [
        'Classic Arcade Games',
        'Fighting Games',
        'Puzzle Games',
        'Racing Games',
        'Platformers',
        'Adventure Games',
        'Shooting Games',
    ];

    useEffect(() => {
        if (state.user) {
            setUserDetails({
                name: state.user.name || '',
                email: state.user.email || '',
                phone: state.user.phone || '',
                country: state.user.country || '',
                state: state.user.state || '',
                city: state.user.city || '',
                bio: state.user.bio || '',
                avatar: state.user.avatar || '',
            });
            setInterests(state.user.interests || []);
        }
    }, [state.user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleInterestChange = (interest) => {
        setInterests((prev) =>
            prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
        );
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const uploadAvatar = async (userId) => {
        if (!avatarFile) return;
        const avatarRef = ref(storage, `avatars/${userId}/${avatarFile.name}`);
        await uploadBytes(avatarRef, avatarFile);
        const avatarURL = await getDownloadURL(avatarRef);
        return avatarURL;
    };

    const saveChanges = async () => {
        try {
            const userId = state.user.uid;
            let avatarURL = userDetails.avatar;

            if (avatarFile) {
                avatarURL = await uploadAvatar(userId);
            }

            await updateDoc(doc(db, 'users', userId), { ...userDetails, interests, avatar: avatarURL });
            toast.success('Details edited successfully!', {
                duration: 3000,
            });
        } catch (error) {
            toast.error('Failed to update details: ' + error.message, {
                duration: 3000,
            });
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-3 gap-8 p-8">
                    {/* Profile Image Section */}
                    <motion.div 
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex flex-col items-center justify-center space-y-6 bg-indigo-50 p-6 rounded-2xl"
                    >
                        <div className="relative">
                            <img
                                className="w-48 h-48 rounded-full object-cover border-4 border-indigo-200 shadow-lg"
                                src={userDetails.avatar || 'https://via.placeholder.com/150'}
                                alt="Avatar"
                            />
                            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-3 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors">
                                <FaUpload />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        <p className="text-xl font-semibold text-indigo-800">{userDetails.name || 'User Name'}</p>
                    </motion.div>

                    {/* Personal Details Section */}
                    <motion.div 
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 space-y-6"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-indigo-700 font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 transition-all"
                                    placeholder="Your full name"
                                    value={userDetails.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-indigo-700 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 transition-all"
                                    placeholder="your.email@example.com"
                                    value={userDetails.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-indigo-700 font-medium mb-2">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 transition-all"
                                placeholder="Your phone number"
                                value={userDetails.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Interests Section */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-indigo-50 p-8 rounded-b-2xl"
                >
                    <h3 className="text-2xl font-bold text-indigo-800 mb-6">Your Interests</h3>
                    <div className="flex flex-wrap gap-4">
                        {interestsList.map((interest) => (
                            <motion.div 
                                key={interest}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${
                                    interests.includes(interest) 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'bg-white text-indigo-600 border border-indigo-200'
                                }`}
                                onClick={() => handleInterestChange(interest)}
                            >
                                {interests.includes(interest) ? (
                                    <>
                                        <span className="mr-2">{interest}</span>
                                        <FaTimes />
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">{interest}</span>
                                        <FaPlus />
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveChanges}
                        className="mt-6 flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <FaSave /> Save Changes
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Profile;