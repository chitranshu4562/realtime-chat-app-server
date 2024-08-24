import jwt from "jsonwebtoken";

export const generateAuthToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.SUPER_SECRET_KEY, {expiresIn: process.env.EXPIRATION_TIME});
}
