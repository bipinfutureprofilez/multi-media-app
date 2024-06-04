import { ApiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


const authenticateUser = async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(400, "Unauthorized request!")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decodedToken?.id;

        const user = await User.findById(userId).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(400, "Invalid access token!");
        }
        req.user = user;
        
        next()

    } catch (error) {
        throw new ApiError(400, `${error?.message}`);
    }
}

export { authenticateUser }