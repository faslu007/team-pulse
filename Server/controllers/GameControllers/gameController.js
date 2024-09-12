import asyncHandler from 'express-async-handler';
import { Game } from '../../models/Game.js';
import { Team } from '../../models/Team.js';
import { gameRichTextBlankSample } from '../RoomControllers/gameRichTextSample.js';
import mongoose from 'mongoose';
import User from '../../models/User.js';

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
            // richTextContent: JSON.stringify(gameRichTextBlankSample),
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
            message: 'Slide deleted and slides reordered successfully.',
            slides: game.slides
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

        // Sort the slides array before retrieval (assuming slides is an array)
        const sortedSlides = game.slides.sort((a, b) => a.order - b.order);

        res.status(200).json({
            message: 'Slides retrieved successfully.',
            slides: sortedSlides
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
    const { mediaContentType, mediaContentUri, contentTypeExtension } = req.body;

    if (!roomId || !slideId || !mediaContentType || !mediaContentUri || !contentTypeExtension) {
        return res.status(400).json({
            message: 'Room ID, Slide ID, Media Content Type, and Media Content URI are required to add media content.'
        });
    }

    if (!['audio', 'video', 'image'].includes(mediaContentType)) {
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
        slide.contentTypeExtension = contentTypeExtension;

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
        slide.contentTypeExtension = undefined;

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


/**
 * Update the updateRichTextContentState of a slide in a game room
 * Route /game/:roomId/slide/:slideId/updateRichTextContentState
 * Access Private
 * Method PUT
 */
export const updateRichTextContentState = asyncHandler(async (req, res) => {
    const { roomId, slideId } = req.params;
    const { richTextContent } = req.body;

    if (!roomId || !slideId) {
        return res.status(400).json({
            message: 'Room ID and Slide ID are required to toggle the content type.'
        });
    }

    if (typeof richTextContent !== 'string') {
        return res.status(400).json({
            message: 'Valid Rich Text content state is required.'
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
        slide.richTextContent = richTextContent;

        // Save the updated game document
        await game.save();

        res.status(200).json({
            message: 'Slide rich text content updated successfully.',
            updatedSlide: slide
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating richText content.',
            error: error.message
        });
    }
});




/**
 * Update Slides Order
 * Route /game/updateGameSlidesOrder
 * Access Private
 * Method PUT
 */
export const updateGameSlidesOrder = asyncHandler(async (req, res) => {
    const { roomId } = req.body;
    const { newOrder } = req.body;

    if (!roomId || !Array.isArray(newOrder)) {
        return res.status(400).json({
            message: 'Room ID and new order array are required to update the slides order.'
        });
    }

    try {
        const game = await Game.findOne({ roomId });

        if (!game) {
            return res.status(404).json({
                message: 'No game found with the provided Room ID.'
            });
        }

        // Update the order of each slide based on the newOrder array
        newOrder.forEach((slide) => {
            const foundSlide = game.slides.id(slide.id);
            if (foundSlide) {
                foundSlide.order = slide.order;
            }
        });

        // Save the updated game document
        await game.save();

        res.status(200).json({
            message: 'Slides order updated successfully.',
            slides: game.slides,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error occurred while updating the slides order.',
            error: error.message
        });
    }
});

/**
 * Create a team in a game
 * Route /games/createTeam/:roomId
 * Access Private
 * Method POST
 */
export const createTeam = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { teamName } = req.body;

    if (!roomId) {
        return res.status(400).json({
            message: 'Room ID is required to create a team.'
        });
    }

    if (!teamName || teamName.trim().length === 0) {
        return res.status(400).json({
            message: 'Team name is required.'
        });
    }

    const game = await Game.findOne({ roomId });

    if (!game) {
        return res.status(404).json({
            message: 'Game not found.'
        });
    }

    const team = await Team.create({ teamName: teamName });

    game.teams.push(team._id);
    await game.save();

    const newTeam = team.toObject();

    res.status(201).json({
        message: 'Team created successfully.',
        team: {
            id: newTeam._id,
            _id: newTeam._id,
            teamName: newTeam.teamName
        }
    });
});

/**
 * Add Participant to a gameRoom
 * Route /games/:roomId/addParticipant
 * Access Private
 * Method POST
 */
export const addParticipant = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;

    if (!roomId || !userId) {
        return res.status(400).json({
            message: 'Room ID and User ID are required.'
        });
    }

    const game = await Game.findOne({ roomId });

    if (!game) {
        return res.status(404).json({
            message: 'Game not found.'
        });
    }

    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({
            message: 'User not found.'
        });
    }

    if (game.participants.includes(userId)) {
        return res.status(400).json({
            message: 'User is already a participant in this game.'
        });
    }

    game.participants.push({ user: userId, team: null });
    await game.save();

    res.status(200).json({
        message: 'Participant added to game successfully.',
        participant: {
            user: {
                id: userId,
                _id: userId,
                displayName: user.displayName,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            team: {

            }
        }
    });
});



/**
 * Get All Participants
 * Route /games/:roomId/getAllParticipants
 * Access Private
 * Method Get
 */
export const getAllParticipants = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        return res.status(400).json({
            message: 'Room ID is required.'
        });
    }

    try {
        const game = await Game.findOne({ roomId })
            .select('participants')
            .populate({
                path: 'participants',  // Populate the participants array
                populate: [
                    {
                        path: 'team',   // Populate the 'team' field inside participants
                        select: '_id teamName'
                    },
                    {
                        path: 'user',   // Populate the 'user' field inside participants
                        select: 'email firstName lastName displayName _id'
                    }

                ]
            });

        if (!game) {
            return res.status(404).json({
                message: 'Game not found.'
            });
        }

        const participants = game.participants.map(p => ({
            id: p._id,
            user: {
                id: p.user._id,
                email: p.user.email,
                firstName: p.user.firstName,
                lastName: p.user.lastName,
                displayName: p.user.displayName
            },
            team: p.team ? {
                id: p.team._id,
                _id: p.team._id,
                teamName: p.team.teamName
            } : null
        }));

        res.status(200).json({
            message: 'Participants and teams retrieved successfully.',
            participants,
        });
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({
            message: 'Error fetching participants.',
            error: error.message
        });
    }
});


/**
 * Update team of a participant
 * Route /games/:roomId/updateParticipantTeam
 * Access Private
 * Method POST
 */
export const updateParticipantTeam = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const { roomId } = req.params;
        const { participantId, newTeamId } = req.body;

        // Validate ObjectIds
        if (!mongoose.Types.ObjectId.isValid(roomId) || !mongoose.Types.ObjectId.isValid(participantId)) {
            return res.status(400).json({ message: 'Invalid room or participant ID' });
        }
        if (newTeamId && !mongoose.Types.ObjectId.isValid(newTeamId)) {
            return res.status(400).json({ message: 'Invalid team ID' });
        }

        session.startTransaction();

        // Find the game
        const game = await Game.findOne({ roomId }).session(session);
        if (!game) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Game not found' });
        }

        // Find the participant index
        const participantIndex = game.participants.findIndex(p => p.user?.toString() === participantId);
        if (participantIndex === -1) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Participant not found' });
        }

        // Update the team
        game.participants[participantIndex].team = newTeamId || null;

        // Save the game
        await game.save({ session });

        // Commit transaction
        await session.commitTransaction();

        // Fetch the updated game with populated fields (no lean, ensure population works)
        const updatedGame = await Game.findOne({ roomId })
            .populate({
                path: 'participants.user',
                select: 'email firstName lastName displayName _id'
            })
            .populate({
                path: 'participants.team',
                select: '_id teamName'
            }); // Removed .lean() to ensure proper Mongoose population

        // Map the updated participants
        const updatedParticipants = updatedGame.participants.map(p => ({
            id: p._id.toString(),
            user: {
                _id: p.user._id.toString(),
                id: p.user._id.toString(),
                email: p.user.email,
                firstName: p.user.firstName,
                lastName: p.user.lastName,
                displayName: `${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim()
            },
            team: p.team ? {
                _id: p.team._id.toString(),
                id: p.team._id.toString(),
                teamName: p.team.teamName
            } : null
        }));

        res.status(200).json({
            message: 'Participant team updated successfully',
            // participants: updatedParticipants
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Error updating participant team:', error);
        res.status(500).json({ message: 'Error updating participant team' });
    } finally {
        session.endSession();
    }
});




/**
 * Get teams list
 * Route /games/:roomId/getTeamsList
 * Access Private
 * Method GET
 */
export const getTeamsList = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    const game = await Game.findOne({ roomId })
        .select('teams')
        .populate({
            path: 'teams',
            select: '_id teamName'
        });


    if (!game) {
        return res.status(404).json({ message: 'Game not found' });
    }


    const teams = game.teams.map(team => ({
        id: team._id,
        _id: team.id,
        teamName: team.teamName,
    }));

    res.status(200).json({
        message: 'Teams list retrieved successfully',
        teams: teams
    });
});