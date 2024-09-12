import express from 'express';
import path from 'path';
import multer from 'multer';

// Import controllers
import { loginUser, registerUser, searchUsers } from '../controllers/UserControllers/authController.js';

// Import middleware
import { protect } from '../middlewares/authMiddleware.js';

// Initialize the router
const router = express.Router();

// Set up multer for file uploads (in this case, no files are being uploaded)
const upload = multer();

// API routes
// API: /api/users
router.post('/loginUser', upload.none(), loginUser);
router.post('/registerUser', upload.none(), registerUser);
router.post('/search', protect, searchUsers);

// Export the router
export default router;
