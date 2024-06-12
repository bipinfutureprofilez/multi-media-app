import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// import router
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import error from "./middlewares/error.js";
import { notFound } from "./middlewares/notFound.js";

// route declare
app.use('/api', userRouter);
app.use('/api/video', videoRouter);
app.use(error);
app.use(notFound)

export { app }