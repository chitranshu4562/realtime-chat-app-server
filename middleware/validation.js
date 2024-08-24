import {body} from "express-validator";
import {EMAIL_REGEX} from "../constants.js";

export const userValidation = () => {
    return [
        body('name')
            .trim()
            .isLength({ min: 5 }).withMessage('Name must have at least five characters'),
        body('email')
            .trim()
            .matches(EMAIL_REGEX).withMessage('Please enter a valid email'),
        body('password')
            .trim()
            .isLength({ min: 6 }).withMessage('Password must have at least six characters')
    ]
};
