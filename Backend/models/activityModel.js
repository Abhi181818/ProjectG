import mongoose from 'mongoose';
const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: 'https://via.placeholder.com/300x200', 
  },
  venueId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue', 
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;