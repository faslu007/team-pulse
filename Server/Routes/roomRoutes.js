import express from 'express';
import path from 'path';
import multer from 'multer';
import { getRoomsList, registerRoom } from '../controllers/RoomControllers/roomControllers.js';
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

// Export the router
export default router;
