import express from "express";
import upload from "../middleware/multer.js";
import {uploadUserAvatar} from "../controllers/usersController.js";

const userRoutes = express.Router();

// POST /users/upload-avatar
userRoutes.post('/upload-avatar', upload.single('avatar'), uploadUserAvatar);



export default userRoutes;
