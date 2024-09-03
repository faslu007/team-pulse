import asyncHandler from 'express-async-handler';
import Game from '../../models/Game.js';
import { gameRichTextBlankSample } from '../RoomControllers/gameRichTextSample.js';

/**
 * Create a slide in game room 
 * Route /game/createSlide
 * Access Private
 * Method Post
 */
export const createGameSlide = asyncHandler(async (req, res) => {
    const { roomId } = req.body;

    if (!roomId) {
        return res.status(400).json({
            message: 'Room / Game ID is required to add a new slide.'
        });
    }

    try {
        // Find the game by roomId and get the current highest slide order
        const game = await Game.findOne({ roomId });

        if (!game) {
            return res.status(404).json({
                message: 'Game not found.'
            });
        }

        // Determine the highest current order
        const highestOrder = game.slides.reduce((max, slide) => {
            return slide.order > max ? slide.order : max;
        }, 0);

        // Create a new slide with the order + 1
        const newSlide = {
            order: highestOrder + 1,
            richTextContent: gameRichTextBlankSample,
            activeContentType: 'richText'
        };

        // Push the new slide to the slides array
        game.slides.push(newSlide);

        // Save the updated game document
        await game.save();

        const savedSlide = game.slides[game.slides.length - 1];

        res.status(200).json({
            message: 'New slide added successfully.',
            slideId: savedSlide._id,
            newSlide: savedSlide,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding new slide.',
            error: error.message
        });
    }
});



/**
 * Get a specific slide in a game room
 * Route /game/getGameSlide
 * Access Private
 * Method GET
 */
export const getGameSlide = asyncHandler(async (req, res) => {
    const { roomId, slideId } = req.query;

    if (!roomId || !slideId) {
        return res.status(400).json({
            message: 'Room ID and Slide ID are required to retrieve the slide.'
        });
    }

    try {
        // Find the game by roomId
        const game = await Game.findOne({ roomId });

        if (!game) {
            return res.status(404).json({
                message: 'Game not found.'
            });
        }

        // Find the specific slide by slideId
        const slide = game.slides.id(slideId);

        if (!slide) {
            return res.status(404).json({
                message: 'Slide not found.'
            });
        }

        res.status(200).json({
            message: 'Slide retrieved successfully.',
            slide
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error occurred while retrieving the slide.',
            error: error.message
        });
    }
});



/**
 * Delete a slide in game room 
 * Route /games/:roomId/slide/:slideId
 * Access Private
 * Method DELETE
 */
export const deleteGameSlide = asyncHandler(async (req, res) => {
    const { roomId, slideId } = req.params;

    if (!roomId || !slideId) {
        return res.status(400).json({
            message: 'Room ID and Slide ID are required to delete a slide.'
        });
    }

    try {
        // Find the game by roomId
        const game = await Game.findOne({ roomId });

        if (!game) {
            return res.status(404).json({
                message: 'Game not found.'
            });
        }

        // Find the index and order of the slide to be deleted
        const slideIndex = game.slides.findIndex(slide => slide._id.toString() === slideId);

        if (slideIndex === -1) {
            return res.status(404).json({
                message: 'Slide not found.'
            });
        }

        const slideOrder = game.slides[slideIndex].order;

        // Remove the slide from the array
        game.slides.splice(slideIndex, 1);

        // Reorder the remaining slides
        game.slides.forEach(slide => {
            if (slide.order > slideOrder) {
                slide.order -= 1;
            }
        });

        // Save the updated game document
        await game.save();

        res.status(200).json({
            message: 'Slide deleted and slides reordered successfully.'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting slide.',
            error: error.message
        });
    }
});


/**
 * Toggle the active content type of a slide in a game room
 * Route /game/:roomId/slide/:slideId/toggleContentType
 * Access Private
 * Method PUT
 */
export const toggleSlideContentType = asyncHandler(async (req, res) => {
    const { roomId, slideId } = req.params;
    const { activeContentType } = req.body;

    if (!roomId || !slideId) {
        return res.status(400).json({
            message: 'Room ID and Slide ID are required to toggle the content type.'
        });
    }

    if (!['richText', 'mediaContent'].includes(activeContentType)) {
        return res.status(400).json({
            message: 'Active content type should be either Rich Text or Media Content'
        });
    }

    try {
        // Find the game by roomId
        const game = await Game.findOne({ roomId });

        if (!game) {
            return res.status(404).json({
                message: 'Game not found.'
            });
        }

        // Find the slide by slideId
        const slide = game.slides.id(slideId);

        if (!slide) {
            return res.status(404).json({
                message: 'Slide not found.'
            });
        }

        // Toggle the activeContentType
        slide.activeContentType = activeContentType;

        // Save the updated game document
        await game.save();

        res.status(200).json({
            message: 'Slide content type toggled successfully.',
            updatedSlide: slide
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error toggling slide content type.',
            error: error.message
        });
    }
});


/**
 * Get Slides
 * Route /game/getGameSlides
 * Access Private
 * Method GET
 */
export const getGameSlides = asyncHandler(async (req, res) => {
    const { roomId } = req.query;

    if (!roomId) {
        return res.status(400).json({
            message: 'Room ID is required to get the slides.'
        });
    }

    try {
        const game = await Game.findOne({ roomId }).select('slides');

        if (!game) {
            return res.status(404).json({
                message: 'No game found with the provided Room ID.'
            });
        }

        res.status(200).json({
            message: 'Slides retrieved successfully.',
            slides: game.slides
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error occurred while retrieving the slides.',
            error: error.message
        });
    }
});



/**
 * Add media content to a slide in a game room 
 * Route /game/:roomId/slide/:slideId/addMediaContent
 * Access Private
 * Method PUT
 */
export const addMediaContentToSlide = asyncHandler(async (req, res) => {
    const { roomId, slideId } = req.params;
    const { mediaContentType, mediaContentUri } = req.body;

    if (!roomId || !slideId || !mediaContentType || !mediaContentUri) {
        return res.status(400).json({
            message: 'Room ID, Slide ID, Media Content Type, and Media Content URI are required to add media content.'
        });
    }

    if (!['audio', 'video', 'image', 'richText'].includes(mediaContentType)) {
        return res.status(400).json({
            message: 'Invalid media content type. Must be one of audio, video, image, or richText.'
        });
    }

    try {
        const game = await Game.findOne({ roomId });

        if (!game) {
            return res.status(404).json({
                message: 'Game not found.'
            });
        }

        const slide = game.slides.id(slideId);

        if (!slide) {
            return res.status(404).json({
                message: 'Slide not found.'
            });
        }

        slide.activeContentType = 'mediaContent';
        slide.mediaContentType = mediaContentType;
        slide.mediaContentUri = mediaContentUri;

        await game.save();

        res.status(200).json({
            message: 'Media content added successfully to the slide.',
            updatedSlide: slide
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error adding media content to the slide.',
            error: error.message
        });
    }
});


/**
 * Delete media content from a slide in a game room 
 * Route /game/:roomId/slide/:slideId/deleteMediaContent
 * Access Private
 * Method PUT
 */
export const deleteMediaContentFromSlide = asyncHandler(async (req, res) => {
    const { roomId, slideId } = req.params;

    if (!roomId || !slideId) {
        return res.status(400).json({
            message: 'Room ID and Slide ID are required to delete media content.'
        });
    }

    try {
        const game = await Game.findOne({ roomId });

        if (!game) {
            return res.status(404).json({
                message: 'Game not found.'
            });
        }

        const slide = game.slides.id(slideId);

        if (!slide) {
            return res.status(404).json({
                message: 'Slide not found.'
            });
        }

        slide.mediaContentType = undefined;
        slide.mediaContentUri = undefined;

        // Optionally, set the activeContentType back to 'richText' or handle as needed
        // slide.activeContentType = 'richText';

        await game.save();

        res.status(200).json({
            message: 'Media content deleted successfully from the slide.',
            updatedSlide: slide
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting media content from the slide.',
            error: error.message
        });
    }
});