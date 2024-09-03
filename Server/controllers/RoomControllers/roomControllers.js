import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import Room from "../../models/Room.js";
import moment from "moment"
import Game from '../../models/Game.js';
import { gameRichTextSample } from './gameRichTextSample.js';



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

        console.log(room.toJSON()._id)

        let slideId;

        if (room.toJSON()._id) {
            const game = await Game.create({
                roomId: room.toJSON()._id,
                slides: [{
                    order: 1,
                    activeContentType: 'richText',
                    richTextContent: gameRichTextSample,
                }]
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

            if (room._id) {
                // Find the game associated with the room
                const game = await Game.findOne({ roomId: room._id }).lean().exec();
                if (game && game.slides.length > 0) {
                    firstSlideId = game.slides[0]._id;
                }
            }

            return {
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