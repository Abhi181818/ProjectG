import mongoose from 'mongoose';
const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x200', // Default image
  },
  amenities: {
    type: [String], // Array of amenities
  },
  website: {
    type: String,
  },
  openingHours: {
    type: String,
  },
});

export default mongoose.model('Venue', venueSchema)