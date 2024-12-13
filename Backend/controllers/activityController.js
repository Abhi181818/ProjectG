import Activity from '../models/activityModel.js';
import Venue from '../models/venueModel.js'; // Ensure you import the Venue model

const getActivities = async (req, res) => {
  try {
    // Populating the venueId to include full venue details with each activity
    const activities = await Activity.find().populate('venueId');
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createActivity = async (req, res) => {
  try {
    // Create a new activity from the request body
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getActivityById = async (req, res) => {
  try {
    // Fetch activity by ID
    const activity = await Activity.findById(req.params.id).populate('venueId');
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivityByLocation = async (req, res) => {
  try {
    const locationQuery = req.params.location.toLowerCase();
    
    // Populate venueId to get access to venue details
    const activities = await Activity.find().populate('venueId');

    // Filter activities based on the venue's address
    const filteredActivities = activities.filter(activity => 
      activity.venueId.address.toLowerCase().includes(locationQuery)
    );

    res.status(200).json(filteredActivities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivityByCategory = async (req, res) => {
  try {
    // Find activities based on the provided category
    const activities = await Activity.find({ category: req.params.category }).populate('venueId');
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivityByVenueId = async (req, res) => {
  try {
    // Find activities by venueId and populate venue details
    const activities = await Activity.find({ venueId: req.params.venueId }).populate('venueId');
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivityByName = async (req, res) => {
  try {
    const nameQuery = req.params.name.replace(/-/g, ' '); // Replace hyphens with spaces
    const activity = await Activity.findOne({ 
      title: { $regex: nameQuery, $options: 'i' } // Case-insensitive search
    }).populate('venueId');
    
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { 
  getActivities, 
  createActivity, 
  getActivityById, 
  getActivityByLocation, 
  getActivityByCategory, 
  getActivityByVenueId,
  getActivityByName
};
