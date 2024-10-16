import Activity from '../models/activityModel.js';
const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find().populate('venueId');
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createActivity = async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getActivityByLocation = async (req, res) => {
  try {
    const locationQuery = req.params.location;
    const activities = await Activity.find({ 
      address: { $regex: locationQuery, $options: 'i' } // Case-insensitive search
    });
    
    if (activities.length === 0) {
      return res.status(404).json({ message: 'No activities found for this location' });
    }
    
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getActivityByCategory = async (req, res) => {
  try {
    const activities = await Activity.find({ category: req.params.category });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getActivityByVenueId = async (req, res) => {
  try {
    const activities = await Activity.find({ venueId: req.params.venueId });
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export default { getActivities,createActivity,getActivityById,getActivityByLocation,getActivityByCategory,getActivityByVenueId };
