import express from "express";
const router = express.Router();
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

import { createVideo } from "../controllers/video.controller.js";

router.route('/').post(
    authenticateUser, 
    upload.fields([
        {
            name: "videos",
            maxCount: 1
        }
    ]),
    createVideo
);

export default router;