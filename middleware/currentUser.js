import {decodeAndVerifyToken} from "../util/auth.js";
import User from "../models/user.js";

export default async function currentUser(req, res, next) {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            throw new Error('No headers are present');
        }

        const authToken = authHeader.split(' ')[1];
        if (!authToken) {
            throw new Error('Auth token is not present');
        }

        const decodedToken = decodeAndVerifyToken(authToken);
        const currentUser = await User.findById(decodedToken.userId);
        if (!currentUser) {
            throw new Error('Logged in user not found')
        }
        req.currentUser = currentUser;
        next();
    } catch (error) {
        next(error)
    }
}
