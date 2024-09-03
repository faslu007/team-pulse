import express from 'express';
import path from 'path';
import multer from 'multer';
import { addMediaContentToSlide, createGameSlide, deleteGameSlide, deleteMediaContentFromSlide, getGameSlide, getGameSlides, toggleSlideContentType } from '../controllers/GameControllers/gameController.js';
import { protect } from '../middlewares/authMiddleware.js';


// Initialize the router
const router = express.Router();

// Set up multer for file uploads (in this case, no files are being uploaded)
const upload = multer();

// API routes
// API: /api/games
router.post('/createSlide', upload.none(), protect, createGameSlide);
router.get('/getGameSlide', upload.none(), protect, getGameSlide);
router.delete('/:roomId/slide/:slideId', upload.none(), protect, deleteGameSlide);
router.put('/:roomId/slide/:slideId/toggleContentType', upload.none(), protect, toggleSlideContentType);
router.get('/getGameSlides', upload.none(), protect, getGameSlides);
router.put('/:roomId/slide/:slideId/addMediaContent', upload.none(), protect, addMediaContentToSlide);
router.put('/:roomId/slide/:slideId/deleteMediaContent', upload.none(), protect, deleteMediaContentFromSlide);



// Export the router
export default router;
