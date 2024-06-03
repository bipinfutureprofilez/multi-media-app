import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler( async (req, res) => {
    // Get fields value from req.body
    // check the fields and throw an error if any field is empty
    // check the email exited in db already or not
    const {username, fullName, email, password} = req.body;

    if (!username || !fullName || !email || !password) {
        throw new ApiError(400, "All fields are required!");
    }

    const existedUser = await User.findOne({email});

    if (existedUser) {
        throw new ApiError(400, "Email already exist!");
    }

    const avatarPath = req.files?.avatar[0].path;
    const coverImagePath = req.files?.coverImage[0].path;

    if (!avatarPath) {
        throw new ApiError(400, "Avatar image is not uploaded!");
    }

    const avatar = await uploadOnCloudinary(avatarPath);
    const coverImage = await uploadOnCloudinary(coverImagePath);

    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar: avatar,
        coverImage: coverImage,
    })

    if (!user) {
        throw new ApiError(500, "Something went wrong while register the user!");
    }

    const response = await User.findById(user._id).select("-password");


})

export {registerUser}