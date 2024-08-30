import express from "express";
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.NODE_ENV === 'production' ? process.env.PORT_PROD : process.env.PORT_LOCAL_AND_DEVELOPMENT;
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import { responseMiddleware } from "./middlewares/responseMiddleware.js"
import errorHandler from "./middlewares/errorHandler.js";
import userRoutes from './Routes/userRoutes.js';
import roomRoutes from "./Routes/roomRoutes.js"


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

// error handler middleware - return structured error message - this should be always placed beneath the routes to work
app.use(errorHandler);


app.listen(port, () => console.log(`Server started on ${port}`));




