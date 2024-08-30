import webSocketConnection from "../socket.js";
import Message from "../models/message.js";

export const onReceiveMessages = (messageData) => {
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

    Message.create({
        content: message,
        sender: senderId,
        conversation: conversationId
    }).then(messageData => {
        webSocketConnection.getIO().emit('conversation', messageData);
    }).catch(error => {
        console.error(error)
    })
}
