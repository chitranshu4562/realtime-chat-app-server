import express from "express";
import upload from "../middleware/multer.js";
import {fetchUserProfile, getUsers, uploadUserAvatar} from "../controllers/usersController.js";
import currentUser from "../middleware/currentUser.js";

const userRoutes = express.Router();

// POST /users/upload-avatar
userRoutes.post('/upload-avatar', currentUser, upload.single('avatar'), uploadUserAvatar);

// GET /users/fetch-user-profile
userRoutes.get('/fetch-user-profile', currentUser, fetchUserProfile);

// GET /users/get-users
userRoutes.get('/get-users', currentUser, getUsers);



export default userRoutes;
