import express from "express";
import {userValidation} from "../middleware/validation.js";
import {userLogin, userSignUp} from "../controllers/authenticationController.js";

const authenticationRoutes = express.Router();

// POST /authentication/signup-user
authenticationRoutes.post('/signup-user', [userValidation], userSignUp);

// POST /authentication/login
authenticationRoutes.post('/login', userLogin);

export default authenticationRoutes;
