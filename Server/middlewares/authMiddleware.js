
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { serialize } from 'cookie';
import User from '../models/User.js';



export const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.user.id).select('-password');
        if (!req.user) {
            throw "Invalid auth token."
        }

        next();
    } catch (error) {
        // Set cookie to expire immediately to remove it
        const serialized = serialize('token', '', {
            httpOnly: true,
            // secure: false, 
            sameSite: 'strict',
            maxAge: -1,
            path: '/',
        });

        // Remove the token from the header
        res.setHeader('Set-Cookie', serialized);
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
}); 