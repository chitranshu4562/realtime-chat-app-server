import jwt from "jsonwebtoken";

export const generateAuthToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.SUPER_SECRET_KEY, {expiresIn: '24h'});
}

export const decodeAndVerifyToken = (token) => {
    return jwt.verify(token, process.env.SUPER_SECRET_KEY);
}
