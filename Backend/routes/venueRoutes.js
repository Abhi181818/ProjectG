import express from 'express';
const router = express.Router();
import venueController from '../controllers/venueController.js';
import { requireSignIn } from '../middlewares/authMiddleware.js';
router.get('/', venueController.getVenues); 
router.post('/', requireSignIn, venueController.createVenue); 
router.get('/:id', venueController.getVenueById); 
router.get('/location/:location', venueController.getVenueByLocation); 
router.get('/category/:category', venueController.getVenueByCategory); 

export default router;