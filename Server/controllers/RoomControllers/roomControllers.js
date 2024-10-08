import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import Room from "../../models/Room.js";
import moment from "moment"
import { Game } from '../../models/Game.js';
import User from '../../models/User.js';

/**
 * Create a game room 
 * Route /rooms/createRoom
 * Access Private
 * Method Post
 */
export const registerRoom = asyncHandler(async (req, res) => {
    const { roomName, roomType, roomStatus, roomStartsAt, roomExpiresAt, invitationMessage } = req.body;

    const requiredFields = { roomName, roomType, roomStatus, roomStartsAt, roomExpiresAt };
    const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required field(s): ${missingFields.join(', ')}`
        });
    }

    if (roomName.length < 3) {
        return res.status(400).json({
            message: `Room / Game name should be of 5 chars length.`
        });
    };

    // Validate and format date fields
    try {
        // Parse dates
        const startDate = moment.parseZone(roomStartsAt).toISOString();
        const endDate = moment.parseZone(roomExpiresAt).toISOString();

        // Optional: Validate if the start date is before the end date
        if (moment(startDate).isAfter(endDate)) {
            return res.status(400).json({
                message: 'Start date must be before end date.'
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Invalid date format or From date greater than to date.',
        });
    }

    try {
        const room = await Room.create({
            roomName,
            roomType,
            roomStartsAt,
            roomExpiresAt,
            roomStatus,
            updatedBy: req.user.id,
            createdBy: req.user.id,
            adminUsers: [req.user?.id],
            invitationMessage: invitationMessage ?? ""
        });


        let slideId;

        if (room.toJSON()._id) {
            const game = await Game.create({
                roomId: room.toJSON()._id,
                slides: [{
                    order: 1,
                    activeContentType: 'richText',
                    // richTextContent: JSON.stringify(gameRichTextSample),
                }],
                participants: [
                    {
                        user: req.user.id,
                        team: null
                    }
                ]
            });

            // Convert the game object to JSON
            const gameJson = game.toJSON();

            // Extract the slide ID of the newly created slide
            slideId = gameJson.slides[0]._id;
        }

        if (room) {
            return res.status(201).json({
                room,
                slideId  // Include the slideId in the response
            });
        } else {
            throw "An error occurred while creating room / game session.";
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'An error occurred while saving the room / game.',
        });
    }
})


/**
 * Update a room 
 * Route /rooms/updateRoom/:id
 * Access Private
 * Method PUT
 */
export const updateRoom = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({
            message: `Room / Game Id is required for update request.`
        });
    }

    const { roomName, roomType, roomStatus, roomStartsAt, roomExpiresAt, invitationMessage } = req.body;

    const requiredFields = { roomName, roomType, roomStatus, roomStartsAt, roomExpiresAt };
    const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required field(s): ${missingFields.join(', ')}`
        });
    }

    if (roomName.length < 3) {
        return res.status(400).json({
            message: `Room / Game name should be of 5 chars length.`
        });
    };

    // Validate and format date fields
    try {
        // Parse dates
        const startDate = moment.parseZone(roomStartsAt).toISOString();
        const endDate = moment.parseZone(roomExpiresAt).toISOString();

        // Optional: Validate if the start date is before the end date
        if (moment(startDate).isAfter(endDate)) {
            return res.status(400).json({
                message: 'Start date must be before end date.'
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'Invalid date format or From date greater than to date.',
        });
    }

    try {
        const room = await Room.findByIdAndUpdate(
            id,
            {
                roomName,
                roomType,
                roomStartsAt,
                roomExpiresAt,
                roomStatus,
                updatedBy: req.user.id,
                invitationMessage: invitationMessage ?? ""
            },
            { new: true } // This option returns the updated document
        );

        if (room) {
            return res.status(200).json({
                room
            });
        } else {
            throw new Error("An error occurred while updating the room / game session.");
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: 'An error occurred while saving the room / game.',
        });
    }
})



/**
 * List rooms 
 * Route /rooms/listRooms
 * Access Private
 * Method Get
 * Params (id, type, status, admin)
 */
export const getRoomsList = asyncHandler(async (req, res) => {
    // Validate incoming query parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        page = 1,
        pageSize = 20,
        roomStatus,
        adminUsers,
        createdBy
    } = req.query;

    const parsedPage = parseInt(page, 10);
    const parsedPageSize = parseInt(pageSize, 10);

    // Ensure page and pageSize are valid numbers
    if (isNaN(parsedPage) || isNaN(parsedPageSize) || parsedPage <= 0 || parsedPageSize <= 0) {
        return res.status(400).json({
            message: 'Invalid pagination parameters. Page and pageSize must be positive integers.',
        });
    }

    const skip = parsedPageSize * (parsedPage - 1);

    const query = {};
    if (roomStatus) query.roomStatus = roomStatus;
    if (adminUsers) query.adminUsers = adminUsers;
    if (createdBy) query.createdBy = createdBy;

    try {
        // Fetch the list of rooms
        const rooms = await Room.find(query)
            .sort({ updatedAt: -1 })
            .limit(parsedPageSize)
            .skip(skip)

            .lean({ virtuals: true })
            .exec();

        // Count the total number of rooms for pagination
        const totalCount = await Room.countDocuments(query);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalCount / parsedPageSize);

        // Fetch game slides for each room
        const roomsWithSlides = await Promise.all(rooms.map(async (room) => {
            let firstSlideId = null;

            // Find the game associated with the room
            const game = await Game.findOne({ roomId: room._id }).lean().exec();

            if (game && game.slides.length > 0) {
                // Sort slides by the 'order' property in ascending order
                const sortedSlides = game.slides.sort((a, b) => a.order - b.order);
                // Get the ID of the first slide after sorting
                firstSlideId = sortedSlides[0]._id;
            }

            return {
                id: room._id,
                ...room,
                firstSlideId
            };
        }));

        // Respond with the rooms list and pagination details
        return res.status(200).json({
            message: 'Ok',
            result: roomsWithSlides,
            page: parsedPage,
            totalPages,
            totalCount
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return res.status(500).json({
            message: 'Failed to fetch rooms. Please try again later.',
        });
    }
});


/**
 * @description Get Upcoming Events List
 * @method GET
 * @param {string} req.user.id from middleware
 */
export const getUpcomingEvents = asyncHandler(async (req, res) => {
    if (!req.user._id) {
        throw new Error('Valid user Id is required to get the events list.');
    }

    const now = new Date();

    const games = await Game.find({
        'participants.user': req.user._id
    }).populate({
        path: 'roomId',
        match: {
            roomStartsAt: { $gte: now },
            roomExpiresAt: { $gt: now }
        },
        select: '-__v',
        populate: {
            path: 'createdBy',
            model: User,
            select: 'firstName lastName displayName'
        }
    }).select('roomId');

    // Filter out games where roomId is null (due to populate match)
    const upcomingGames = games.filter(game => game.roomId !== null);

    if (!upcomingGames.length) {
        return res.status(404).json({
            message: 'No upcoming events found for this user.'
        });
    }

    // Extract room details, sort by start time, and add hostedBy
    const roomsList = upcomingGames
        .map(game => {
            const room = game.roomId.toObject();
            return {
                ...room,
                hostedBy: room.createdBy.displayName || `${room.createdBy.firstName} ${room.createdBy.lastName}`,
                createdBy: room.createdBy._id // Keep only the ID for createdBy
            };
        })
        .sort((a, b) => a.roomStartsAt - b.roomStartsAt);

    res.status(200).json({
        message: 'Upcoming events retrieved successfully.',
        events: roomsList
    });
});



/**
 * @description Valid room or event join request
 * @method GET
 * @param {String} req.params.roomId
 */
export const validateRoomJoinRequest = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const roomId = req.query.roomId;

    // Check if this is a valid room
    const room = await Room.findById(roomId);
    if (!room) {
        return res.status(404).json({
            message: 'Room not found.'
        });
    }

    // Check if the room is active
    const now = new Date();
    if (room.roomStartsAt > now || room.roomExpiresAt < now) {
        return res.status(403).json({
            message: 'This room is not currently active.'
        });
    }

    // Check if the user is a participant
    const game = await Game.findOne({
        roomId: roomId,
        'participants.user': userId
    });

    if (!game) {
        return res.status(403).json({
            message: 'You are not a participant in this room.'
        });
    }

    return res.status(200).json({
        message: 'You are a valid participant for this room.',
        roomDetails: {
            id: room._id,
            name: room.roomName,
            startsAt: room.roomStartsAt,
            expiresAt: room.roomExpiresAt
        }
    });
});