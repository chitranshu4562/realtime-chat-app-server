import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import Group from "../models/group.js";
import User from "../models/user.js";

export const createConversation = async (req, res, next) => {
    try {
        const {isGroup, chatEntityId} = req.body;
        const currentUser = req.currentUser;

        const chatEntity = JSON.parse(isGroup) ? await Group.findById(chatEntityId) : await User.findById(chatEntityId);
        if (!chatEntity) {
            throw new Error('Chat entity does not exist');
        }

        const participants = [];
        participants.push(currentUser._id.toString());
        if (JSON.parse(isGroup)) {
            for (const user of chatEntity.participants) {
                if (user.toString() !== currentUser._id.toString()) {
                    participants.push(user.toString());
                }
            }
        } else {
            participants.push(chatEntity._id.toString());
        }

        let conversation;
        if (JSON.parse(isGroup)) {
            conversation = await Conversation.findOne({
                isGroup: true,
                participants: {
                    $all: participants,
                    $size: participants.length
                }
            })
        } else {
            conversation = await Conversation.findOne({
                isGroup: false,
                participants: {
                    $all: participants,
                    $size: 2
                }
            })
        }

        if (!conversation) {
            conversation = await Conversation.create({
                isGroup: isGroup,
                participants: participants
            })
        }
        res.status(201).json({
            data: conversation
        })
    } catch (error) {
        next(error);
    }
}

export const pushMessageToConversation = async (messageData) => {
    try {
        const {message, senderId, conversationId} = messageData;
        if (!message) {
            throw new Error('Message body can not be empty');
        }
        if (!senderId) {
            throw new Error('Sender Id must be present');
        }
        if (!conversationId) {
            throw new Error('Conversation Id must be present');
        }

        const messageData = await Message.create({
            content: message,
            sender: senderId,
            conversation: conversationId
        });

        return messageData;
    } catch (error) {
        throw new Error(error);
    }
}

export const getConversation = async (req, res, next) => {
    try {
        const {conversationId} = req.query;
        if (!conversationId) {
            throw new Error('Conversation id must be present')
        }

        const isExist = await Conversation.exists({_id: conversationId})
        if (!isExist) {
            throw new Error('No conversation found')
        }
        const messages = await Message.find({
            conversation: conversationId
        })
        res.status(200).json({
            message: 'Chats retrieved successfully',
            chats: messages
        })
    } catch (error) {
        next(error);
    }
}
