import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import initialRoutes from "./routes/index.js";
import webSocketConnection from "./socket.js";
import {onReceiveMessages} from "./sockets/socketHandlers.js";

// load .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Enable CORS for all routes
app.use(cors());

// Middleware for display app logs in development environment
app.use(morgan('dev'));

// Middleware for parsing json bodies
app.use(bodyParser.json());

// Initialize all routes
initialRoutes(app);

// error handling middleware
app.use((err, req, res, next) => {
    // print error stack for better debugging
    console.error(err);
    res.status(err.status || 500);
    res.json({
        success: false,
        message: err.message ? err.message : err
    })
})

mongoose.connect('mongodb://localhost:27017/realtime-chat-app-db')
    .then((result) => {
        console.log('Database is connected')
        const appServer = app.listen(PORT, () => {
            console.log(`App is running at port ${PORT}`)
        });

        webSocketConnection.init(appServer).on('connection', (socket) => {
            console.log('Websocket connection is now established');

            // receive data from conversation channel
            socket.on('conversation', (arg) => {
                onReceiveMessages(arg);
            })
        })
    })
    .catch(error => {
        console.log(error);
    });
