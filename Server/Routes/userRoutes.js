import express from 'express';
import path from 'path';
import multer from 'multer';

// Import controllers
import { loginUser, registerUser } from '../controllers/UserControllers/authController.js';

// Initialize the router
const router = express.Router();

// Set up multer for file uploads (in this case, no files are being uploaded)
const upload = multer();

// API routes
// API: /api/users
router.post('/loginUser', upload.none(), loginUser);
router.post('/registerUser', upload.none(), registerUser);

// Export the router
export default router;
