import express from 'express';
import path from 'path';
import multer from 'multer';
import { getRoomsList, getUpcomingEvents, registerRoom, updateRoom, validateRoomJoinRequest } from '../controllers/RoomControllers/roomControllers.js';
import { protect } from '../middlewares/authMiddleware.js';

// Import controllers


// Initialize the router
const router = express.Router();

// Set up multer for file uploads (in this case, no files are being uploaded)
const upload = multer();

// API routes
// API: /api/users
router.post('/createRoom', upload.none(), protect, registerRoom);
router.get('/getRoomsList', upload.none(), protect, getRoomsList);
router.put('/updateRoom/:id', upload.none(), protect, updateRoom);
router.get('/getUpcomingEvents/', upload.none(), protect, getUpcomingEvents);
router.get('/validateRoomJoinRequest/', upload.none(), protect, validateRoomJoinRequest);

// Export the router
export default router;
