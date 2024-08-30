import {pushMessageToConversation} from "../controllers/conversationController.js";
import webSocketConnection from "../socket.js";

export const onReceiveMessages = (messageData) => {
    pushMessageToConversation(messageData)
        .then(result => {
            webSocketConnection.getIO().emit('conversation', result);
        })
        .catch(error => {
            console.error(error);
        })
}
