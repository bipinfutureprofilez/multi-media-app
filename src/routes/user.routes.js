import express from "express";
const router = express.Router();

import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

router.route('/register').post(
    upload.fields(
        [{
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }]
    ) ,
    registerUser
);

router.route('/login').post(loginUser);
router.route('/logout').post(authenticateUser, logoutUser);

export default router;