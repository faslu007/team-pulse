import asyncHandler from 'express-async-handler';
import { serialize } from 'cookie';
import Room from "../../models/Room.js";
import { capitalizeFirstLetter } from '../../utils/commonUtils.js';
import moment from "moment"



/**
 * Create a game room 
 * Route /rooms/createRoom
 * Access Private
 * Method Post
 */
export const registerRoom = asyncHandler(async (req, res) => {
    const { roomName, roomType, roomStatus, roomStartsAt, roomExpiresAt } = req.body;

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
            adminUsers: [req.user?.id]
        });

        if (room) {
            return res.status(201).json({
                room
            });
        } else {
            throw "An error occurred while creating room / game session."
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