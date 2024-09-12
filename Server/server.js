import express from "express";
const app = express();
import { createServer } from "http";
import { initializeSocket } from './socket/index.js';
import dotenv from 'dotenv';
dotenv.config();

import bodyParser from "body-parser";
import chalk from 'chalk';

const port = process.env.NODE_ENV === 'production' ? process.env.PORT_PROD : process.env.PORT_LOCAL_AND_DEVELOPMENT;
const socket_port = process.env.SOCKET_PORT_LOCAL_AND_DEVELOPMENT;

import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import { responseMiddleware } from "./middlewares/responseMiddleware.js"
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from './Routes/userRoutes.js';
import roomRoutes from "./Routes/roomRoutes.js";
import gameRoutes from "./Routes/gameRoutes.js";


// Db connection
connectDB();

// for parsing application/json
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Structure the json response for uniformity
app.use(responseMiddleware);


const allowedOrigins = [
    'http://localhost:5173',
];
// Cors config
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/games', gameRoutes);

// error handler middleware - return structured error message - this should be always placed beneath the routes to work
app.use(errorHandler);


// Create HTTP server and bind it with Socket.IO
const httpServer = createServer(app);
const io = initializeSocket(httpServer);

httpServer.listen(socket_port, () => console.log(chalk.cyan(`Socket instantiated on port ${socket_port}`)));
app.listen(port, () => console.log(chalk.green(`Server started on port ${port}`)));




