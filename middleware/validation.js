import {body} from "express-validator";
import {EMAIL_REGEX} from "../constants.js";

export const userValidation = [
    body('name')
        .trim()
        .isLength({ min: 5 }).withMessage('Name must have at least five characters'),
    body('email')
        .trim()
        .matches(EMAIL_REGEX).withMessage('Please enter a valid email'),
    body('password')
        .trim()
        .isLength({ min: 6 }).withMessage('Password must have at least six characters')
];

export const createGroupValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Group name must be present'),
    body('participants')
        .isArray().withMessage('Participants must be in an array')
        .custom((value) => value.length > 0).withMessage('There must be at least one participant'),
]
