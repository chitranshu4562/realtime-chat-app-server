import express from "express";
import currentUser from "../middleware/currentUser.js";
import {createGroup, getGroups} from "../controllers/groupController.js";
import {createGroupValidation} from "../middleware/validation.js";

const groupRoutes = express.Router();

// POST /group/create-group
groupRoutes.post('/create-group', [currentUser, createGroupValidation], createGroup);

// GET /group/get-groups
groupRoutes.get('/get-groups', currentUser, getGroups);

export default groupRoutes;
