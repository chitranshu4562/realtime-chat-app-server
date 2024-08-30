import Conversation from "../models/conversation.js";
import Group from "../models/group.js";
import User from "../models/user.js";
import Message from "../models/message.js";

export const createConversation = async (req, res, next) => {
    try {
        const {isGroup, participants} = req.body;
        let conversation;
        if (isGroup) {
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
        const {message, conversationId} = messageData;
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found')
        }

        const createdMessage = await Message.create({
            content: message,
            conversation: conversation,
            sender: conversation.sender
        })

        conversation.messages.push(createdMessage._id);
        const result = await conversation.save();
        return {
            message: message,
            sender: result.sender,
            recipients: result.recipients,
            conversationId: result._id
        }
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
        const chats = await Conversation.findById(conversationId).populate('messages').select('_id sender');
        res.status(200).json({
            message: 'Chats retrieved successfully',
            chat: chats || []
        })
    } catch (error) {
        next(error);
    }
}
