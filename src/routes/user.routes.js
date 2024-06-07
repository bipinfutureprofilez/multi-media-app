import express from "express";
const router = express.Router();

import { registerUser, loginUser, logoutUser, refreshTokenAccess, changeCurrentPassword, changeAvatarImage, changeCoverImage } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

router.route('/register').post(
    upload.fields(
        [{
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }]
    ) ,
    registerUser
);

router.route('/login').post(loginUser);
router.route('/logout').post(authenticateUser, logoutUser);
router.route('/refreshToken').post(refreshTokenAccess);
router.route('/changePassword').post(authenticateUser, changeCurrentPassword)
router.route('/changeAvatar').post(
    authenticateUser,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    changeAvatarImage
)
router.route('/changeCoverImage').post(
    authenticateUser,
    upload.fields([
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    changeCoverImage
)

export default router;