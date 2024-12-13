import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/userContext';
import { db, storage } from '../../firebase'; // Ensure you have your Firestore and Storage setup
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
import { FaPlus, FaTimes } from 'react-icons/fa';

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
        avatar: '', // Added avatar field
    });
    const [interests, setInterests] = useState([]);
    const [avatarFile, setAvatarFile] = useState(null); // File state for the avatar

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
                avatar: state.user.avatar || '', // Load avatar
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
        <div className="bg-white w-full flex flex-col md:flex-row gap-5 px-3 md:px-16 lg:px-28 text-[#161931] mt-12">
            <main className="w-1/2 bg-gray-100 min-h-screen py-1 md:w-2/3 lg:w-3/4">
                <div className="p-2 md:p-4">
                    <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
                        <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
                        <div className="grid max-w-2xl mx-auto mt-8">
                            <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                                <img
                                    className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300"
                                    src={userDetails.avatar || 'https://via.placeholder.com/150'}
                                    alt="Avatar"
                                />
                                <div className="flex flex-col space-y-5 sm:ml-8">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="mb-4"
                                    />
                                    {/* <button
                                        className="py-3.5 px-7 text-base font-medium text-indigo-100 focus:outline-none bg-[#202142] rounded-lg border border-indigo-200 hover:bg-indigo-900 focus:z-10 focus:ring-4 focus:ring-indigo-200"
                                    >
                                        Change picture
                                    </button> */}
                                </div>
                            </div>

                            <div className="items-center mt-8 sm:mt-14 text-[#202142]">
                                <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                                    <div className="w-full">
                                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-indigo-900">Your  name</label>
                                        <input
                                            type="text"
                                            id="first_name"
                                            name="name"
                                            className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                            placeholder="Your first name"
                                            value={userDetails.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-2 sm:mb-6">
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-indigo-900">Your email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                        placeholder="your.email@mail.com"
                                        value={userDetails.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {/* Country */}

                                <div className="mb-2 sm:mb-6">
                                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-indigo-900">Your phone number</label>
                                    <input

                                        type="text"
                                        id="phone"
                                        name="phone"
                                        className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                        placeholder="Your phone number"
                                        value={userDetails.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={saveChanges}
                                        className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="w-1/2 p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg font-bold mt-5">Interests</h3>
                <div className="flex flex-wrap mt-4">
                    {interestsList.map((interest) => (
                        <div key={interest} className={`flex items-center m-2 rounded-full border p-2 cursor-pointer transition-all duration-300 ${interests.includes(interest) ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 border-gray-300'}`} onClick={() => handleInterestChange(interest)}>
                            {interests.includes(interest) ? (
                                <>
                                    <span className="mr-2">{interest}</span>
                                    <FaTimes className="text-white" />
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">{interest}</span>
                                    <FaPlus className="text-indigo-600" />
                                </>
                            )}
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={saveChanges}
                    className="mt-4 bg-indigo-600 text-white p-2 rounded transition-all duration-300 hover:bg-indigo-700"
                >
                    Save Interests
                </button>
            </div>
        </div>
    );
}

export default Profile;
