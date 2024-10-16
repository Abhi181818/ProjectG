import Venue from "../models/venueModel.js";

const createVenue = async (req, res) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
const getVenueByLocation = async (req, res) => {
  try {
    const locationQuery = req.params.location;
    const venues = await Venue.find({ 
      address: { $regex: locationQuery, $options: 'i' } // Case-insensitive search
    });
    
    if (venues.length === 0) {
      return res.status(404).json({ message: 'No venues found for this location' });
    }
    
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getVenueByCategory = async (req, res) => {
  try {
    const venues = await Venue.find({ category: req.params.category });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
export default { getVenues,createVenue,getVenueById,getVenueByLocation,getVenueByCategory };