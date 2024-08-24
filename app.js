import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";
import morgan from "morgan";
import authenticationRoutes from "./routes/authenticationRoutes.js";

// load .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware for display app logs in development environment
app.use(morgan('dev'));

// Middleware for parsing json bodies
app.use(bodyParser.json());

// Use the authentication routes
app.use('/authentication', authenticationRoutes);

// Use the user routes
app.use('/users', userRoutes);

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
        app.listen(PORT, () => {
            console.log(`App is running at port ${PORT}`)
        })
    })
    .catch(error => {
        console.log(error);
    });
