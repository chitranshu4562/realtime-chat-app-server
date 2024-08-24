import {validationResult} from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import {generateAuthToken} from "../util/auth.js";

export const userSignUp = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.status = 400;
            throw errors.array();
        }
        const { name, email, password } = req.body;

        const user = new User({
            name: name,
            email: email,
            password: password
        })
        const createdUser = await user.save();
        const authToken = generateAuthToken(createdUser.email, createdUser._id);
        res.status(201).json({
            message: 'User is created successfully',
            authToken,
            expirationTime: process.env.EXPIRATION_TIME,
            user: {
                name: createdUser.name,
                id: createdUser._id
            }
        })
    } catch (error) {
        next(error);
    }
}

export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Password is incorrect');
        }
        const authToken = generateAuthToken(user.email, user._id);
        res.status(200).json({
            message: 'User is logged in successfully',
            authToken,
            expirationTime: process.env.EXPIRATION_TIME,
            user: {
                name: user.name,
                id: user._id
            }
        })

    } catch (error) {
        next(error);
    }
}
