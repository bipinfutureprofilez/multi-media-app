import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const authenticateUser = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(401, "Unauthorized request!");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decodedToken?.id;

    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(401, "Invalid access token!");
    }
    req.user = user;
    console.log(req.user);
    next()
})

export { authenticateUser }