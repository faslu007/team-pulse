import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import { serialize } from 'cookie';
import User from "../../models/User.js";
import { generateToken } from "../../utils/jwtUtils.js";
import { capitalizeFirstLetter } from '../../utils/commonUtils.js';



/**
 * Register User 
 * Route /users/registerUser
 * Access Public
 * Method Post
 */
export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword, notificationSound } = req.body;

    const requiredFields = { firstName, lastName, email, password, confirmPassword };
    const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required field(s): ${missingFields.join(', ')}`
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            message: `Password and the Confirm password are not match.`
        });
    }

    if (password.length < 5) {
        return res.status(400).json({
            message: `Password should have minimum 5 characters.`
        });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: `Invalid email format.`
        });
    }

    //  Validate if user already registered by the payload email
    const isUserRegistered = await User.findOne({ email: email });
    if (isUserRegistered) {
        return res.status(400).json({
            message: `An account is already registered by the given email.`
        });
    }


    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const user = await User.create({
            firstName: capitalizeFirstLetter(firstName),
            lastName: capitalizeFirstLetter(lastName),
            password: hashedPassword,
            email,
            notificationSound: notificationSound || false
        });

        if (user._id) {
            const jwtToken = generateToken({ id: user._id });
            const serialized = serialize('token', jwtToken, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                secure: false,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30,
                path: '/',
            });
            res.setHeader('Set-Cookie', serialized);

            const response = await User.findById(user._id).select('-password');
            // Send response back to client
            return res.status(201).json(response);
        }
    } catch (error) {
        // Respond with error status and message
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});



/**
 * Login User 
 * Route /users/loginUser
 * Access Public
 * Method Post
 */
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const requiredFields = { email, password };
    const missingFields = Object.keys(requiredFields).filter(key => !requiredFields[key]);

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required field(s): ${missingFields.join(', ')}`
        });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(403).json({
                message: "Not registered."
            })
        }

        const hashedPassword = user.password;

        if (!(await bcrypt.compare(password, hashedPassword))) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }

        const response = user.toObject();
        delete response.password

        const jwtToken = generateToken({ id: user._id });
        const serialized = serialize('token', jwtToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
            path: '/',
        });
        res.setHeader('Set-Cookie', serialized);

        return res.status(200).json(response)
    } catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});



/**
 * Search Users by Email
 * Route POST /users/search
 * Access Private
 */
export const searchUsers = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email || email.length < 3) {
        return res.status(400).json({
            message: 'Email query must be at least 3 characters long.'
        });
    }

    try {
        // Escape special regex characters in the email
        const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Create a case-insensitive regex that matches the email anywhere in the string
        const emailRegex = new RegExp(escapedEmail, 'i');

        const users = await User.find({
            email: emailRegex,
            isActive: true
        })
            .select('_id customUserId firstName lastName email')
            .limit(10);  // Limit the results to 10 users

        res.status(200).json({
            message: 'Users fetched successfully.',
            users: users
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error searching for users.',
            error: error.message
        });
    }
});