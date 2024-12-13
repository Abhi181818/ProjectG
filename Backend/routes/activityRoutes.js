import express from 'express';
const router = express.Router();

import activityController from '../controllers/activityController.js';
router.get('/', activityController.getActivities); 
router.post('/', activityController.createActivity); 
router.get('/:id', activityController.getActivityById); 
router.get('/name/:name', activityController.getActivityByName);
router.get('/location/:location', activityController.getActivityByLocation); 
router.get('/category/:category', activityController.getActivityByCategory); 
router.get('/venue/:venueId', activityController.getActivityByVenueId);


export default router;