import {Server} from "socket.io";

let io;

const webSocketConnection = {
    init: (server) => {
        io = new Server(server, {
            cors: {
                origin: '*', // Replace with your client URL
                methods: ['GET', 'POST'],
            }
        })
        return io;
    },
    getIO: () => {
        if (!io) {
            throw new Error('Websocket connection is not initialized yet.')
        }
        return io;
    }
};

export default webSocketConnection;
