import jwt from "jsonwebtoken"

export const generateToken = (user) => {
    return jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: '360d',
        // expiresIn: 15, // seconds
        // expiresIn: 2 * 60 * 60,
    })
};