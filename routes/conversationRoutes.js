import express from "express";
import currentUser from "../middleware/currentUser.js";
import {createConversation, getConversation} from "../controllers/conversationController.js";
const conversationRoutes = express.Router();

// POST /conversation/create-conversation
conversationRoutes.post('/create-conversation', currentUser, createConversation);

// GET /conversation/get-conversation
conversationRoutes.get('/get-conversation', currentUser, getConversation);

export default conversationRoutes;
