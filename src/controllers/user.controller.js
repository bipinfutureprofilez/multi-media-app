import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler( async (req, res) => {
    // Get fields value from req.body
    // check the fields and throw an error if any field is empty
    // check the email exited in db already or not
    const {username, fullName, email, password} = req.body;

    if (!username || !fullName || !email || !password) {
        throw new ApiError(400, "All fields are required!");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(400, "Email or Username already exist!");
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
        avatar: avatar.url,
        coverImage: coverImage.url,
    })

    if (!user) {
        throw new ApiError(500, "Something went wrong while register the user!");
    }

    const response = await User.findById(user._id).select("-password -refreshToken");

    if (!response) {
        throw new ApiError(500, "Something went wrong while register the user!");
    }

    res.status(201).json(
        new ApiResponse(201, response, "User created successfully!")
    );

})

const loginUser = asyncHandler( async (req, res) => {

    const {email, password} = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Invalid credential!");
    }
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "Invalid credential!");
    }

    const checkPassword = user.comparePassword(password);

    if (!checkPassword) {
        throw new ApiError(400, "Invalid credential!");
    }

    res.status(200).json(
        new ApiResponse(200, user, "Login successfully")
    );
})

export { registerUser, loginUser }