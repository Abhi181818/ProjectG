import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  DollarSign, 
  BadgeIndianRupee
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { db, storage, auth } from '../../firebase';

const ADMIN_EMAIL = 'abhishek.ay050103@gmail.com'; 

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('venues');
  const [venues, setVenues] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newVenue, setNewVenue] = useState({
    name: '',
    address: '',
    slug: '',
    imageUrl: '',
    phoneNumber: '',
    email: '',
    venueLocationUrl: ''
  });
  const [newActivity, setNewActivity] = useState({
    city: '',
    description: '',
    imageUrl: '',
    price: '',
    reviews: [],
    slug: '',
    title: '',
    venueId: ''
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Authentication effect
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email === ADMIN_EMAIL) {
        setUser(currentUser);
        fetchVenues();
        fetchActivities();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setAuthError('Access denied. Invalid credentials.');
        return;
      }
    } catch (error) {
      setAuthError('Login failed. Please check your credentials.');
      console.error("Login error:", error);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchVenues = async () => {
    try {
      const venueQuery = query(collection(db, 'venues'));
      const venueSnapshot = await getDocs(venueQuery);
      const venueList = venueSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVenues(venueList);
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const fetchActivities = async () => {
    try {
      const activityQuery = query(collection(db, 'activities'));
      const activitySnapshot = await getDocs(activityQuery);
      const activityList = activitySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActivities(activityList);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const handleImageUpload = async (file, collectionName) => {
    if (!file) return null;
    try {
      const storageRef = ref(storage, `${collectionName}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  const handleAddVenue = async (e) => {
    e.preventDefault();
    try {
      const imageFile = e.target.elements.venueImage.files[0];
      const venueData = {
        ...newVenue,
        imageUrl: imageFile ? await handleImageUpload(imageFile, 'venues') : ''
      };

      await addDoc(collection(db, 'venues'), venueData);
      
      setNewVenue({
        name: '', address: '', slug: '', imageUrl: '', 
        phoneNumber: '', email: '', venueLocationUrl: ''
      });
      setIsAddModalOpen(false);
      fetchVenues();
    } catch (error) {
      console.error("Error adding venue:", error);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const imageFile = e.target.elements.activityImage.files[0];
      const activityData = {
        ...newActivity,
        imageUrl: imageFile ? await handleImageUpload(imageFile, 'activities') : ''
      };

      await addDoc(collection(db, 'activities'), activityData);
      
      // Reset state and close modal
      setNewActivity({
        city: '', description: '', imageUrl: '', 
        price: '', reviews: [], slug: '', 
        title: '', venueId: ''
      });
      setIsAddModalOpen(false);
      fetchActivities();
    } catch (error) {
      console.error("Error adding activity:", error);
    }
  };

  // Delete handlers
  const handleDeleteVenue = async (venueId) => {
    try {
      await deleteDoc(doc(db, 'venues', venueId));
      fetchVenues();
    } catch (error) {
      console.error("Error deleting venue:", error);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await deleteDoc(doc(db, 'activities', activityId));
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  // If not authenticated, show login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required 
            />
            {authError && (
              <p className="text-red-500 text-center">{authError}</p>
            )}
            <button 
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Existing dashboard render (with slight modification to add logout)
  return (
    <div className="min-h-screen mt-16 bg-gray-100 p-8">
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-center"
      >
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          className="bg-red-500 text-white px-4 py-2 rounded-full"
        >
          Logout
        </motion.button>
      </motion.header>

      <div className="flex justify-center mb-8">
        <motion.div 
          className="flex bg-white rounded-full shadow-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {['venues', 'activities'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-6 py-2 capitalize rounded-full transition-colors duration-300
                ${activeTab === tab 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Add Button */}
      <div className="flex justify-center mb-8">
        <motion.button
          onClick={() => setIsAddModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 shadow-lg hover:bg-green-600 transition-colors"
        >
          <Plus /> 
          <span>Add New {activeTab === 'venues' ? 'Venue' : 'Activity'}</span>
        </motion.button>
      </div>

      {/* Content Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {activeTab === 'venues' 
            ? venues.map((venue) => (
                <motion.div
                  key={venue.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  {venue.imageUrl && (
                    <img 
                      src={venue.imageUrl} 
                      alt={venue.name} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{venue.name}</h3>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <MapPin className="mr-2 text-gray-500" size={18} />
                      {venue.address}
                    </p>
                    <div className="flex justify-between">
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                      >
                        <Edit />
                      </motion.button>
                      <motion.button 
                        onClick={() => handleDeleteVenue(venue.id)}
                        whileTap={{ scale: 0.95 }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                      >
                        <Trash2 />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            : activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  {activity.imageUrl && (
                    <img 
                      src={activity.imageUrl} 
                      alt={activity.title} 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="flex items-center">
                        <MapPin className="mr-2 text-gray-500" size={18} />
                        {activity.city}
                      </p>
                      <p className="flex items-center">
                        <BadgeIndianRupee className="mr-2 text-gray-500" size={18} />
                        {activity.price}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                      >
                        <Edit />
                      </motion.button>
                      <motion.button 
                        onClick={() => handleDeleteActivity(activity.id)}
                        whileTap={{ scale: 0.95 }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                      >
                        <Trash2 />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
          }
        </motion.div>
      </AnimatePresence>

      {/* Add Modal */}
      {isAddModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-xl p-8 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">
              Add New {activeTab === 'venues' ? 'Venue' : 'Activity'}
            </h2>
            <form 
              onSubmit={activeTab === 'venues' ? handleAddVenue : handleAddActivity}
              className="space-y-4"
            >
              {activeTab === 'venues' ? (
                <>
                  <input 
                    type="text" 
                    placeholder="Venue Name" 
                    className="w-full p-3 border rounded-lg"
                    value={newVenue.name}
                    onChange={(e) => setNewVenue({...newVenue, name: e.target.value})}
                    required 
                  />
                  <input 
                    type="text" 
                    placeholder="Address" 
                    className="w-full p-3 border rounded-lg"
                    value={newVenue.address}
                    onChange={(e) => setNewVenue({...newVenue, address: e.target.value})}
                    required 
                  />
                  <input 
                    type="file" 
                    name="venueImage" 
                    accept="image/*"
                    className="w-full p-3 border rounded-lg"
                  />
                </>
              ) : (
                <>
                  <input 
                    type="text" 
                    placeholder="Activity Title" 
                    className="w-full p-3 border rounded-lg"
                    value={newActivity.title}
                    onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                    required 
                  />
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={newActivity.venueId}
                    onChange={(e) => setNewActivity({...newActivity, venueId: e.target.value})}
                    required
                  >
                    <option value="">Select Venue</option>
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name}
                      </option>
                    ))}
                  </select>
                  <input 
                    type="file" 
                    name="activityImage" 
                    accept="image/*"
                    className="w-full p-3 border rounded-lg"
                  />
                    {/* city to auto populated by selected venue should be not editable */}
                    <input 
                        type="text" 
                        placeholder="City" 
                        className="w-full p-3 border rounded-lg"
                        value={newActivity.city}
                        onChange={(e) => setNewActivity({...newActivity, city: e.target.value})}
                        required
                    />
                   
                    <input 
                        type="text" 
                        placeholder="Price" 
                        className="w-full p-3 border rounded-lg"
                        value={newActivity.price}
                        onChange={(e) => setNewActivity({...newActivity, price: e.target.value})}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Description" 
                        className="w-full p-3 border rounded-lg"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                        required
                    />

                </>
              )}
              <div className="flex justify-between">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-full"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded-full"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;