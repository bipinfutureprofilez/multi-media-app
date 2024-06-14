import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

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

    const checkPassword = await user.comparePassword(password);

    if (!checkPassword) {
        throw new ApiError(400, "Incorrect password!");
    }

    const genAccessToken = await user.createToken();
    const genRefreshToken = await user.createRefreshToken();

    user.refreshToken = genRefreshToken;
    await user.save({validateBeforeSave: false});

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .cookie("accessToken", genAccessToken, options)
    .cookie("refreshToken", genRefreshToken, options)
    .json(
        new ApiResponse(200, loggedInUser, "Login successfully")
    );
})

const logoutUser = asyncHandler(async (req, res) => {
    const { userId } = req.user?._id;

    await User.findByIdAndUpdate(
        userId, 
        {
            $unset: {
                refreshToken: ""
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "Logout user successfully!")
    );

})

const refreshTokenAccess = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401,'Unauthorized user!')
    }

    const tokenDecoded = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(tokenDecoded?.id).select("-password");

    if (!user) {
        throw new ApiError(401, 'Bad request!')
    }

    if (user.refreshToken !== incomingRefreshToken){
        throw new ApiError(401, 'Invalid token!');
    }

    const newAccessToken = await user.createToken();

    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", incomingRefreshToken, options)
    .json(
        new ApiResponse(200, {}, 'Access token refreshed successfully')
    )

}) 

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(400, "Bad Request!")
    }

    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid password!")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            { user },
            "Password has changed successfully."
        )
    )

})

const changeAvatarImage = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const user = await User.findById(userId).select("-password")

    if (!user) {
        throw new ApiError(401, "Unauthorized user!");
    }

    const avatarPath = req.files?.avatar[0].path;

    if (!avatarPath) {
        throw new ApiError(400, "Avatar image is not uploaded!");
    }

    const avatar = await uploadOnCloudinary(avatarPath)
    
    user.avatar = avatar.url;
    await user.save({validateBeforeSave: false});

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            { avatar: user.avatar },
            "Avatar image updated!"
        )
    );

})

const changeCoverImage = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const user = await User.findById(userId).select("-password")

    if (!user) {
        throw new ApiError(401, "Unauthorized user!");
    }

    const coverPath = req.files?.coverImage[0].path;

    if (!coverPath) {
        throw new ApiError(400, "Cover image is not uploaded!");
    }

    const coverImage = await uploadOnCloudinary(coverPath)
    user.coverImage = coverImage.url;
    await user.save({ validateBeforeSave: false });

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { coverImage: user.coverImage },
                "Avatar image updated!"
            )
        );

})

const getCurrentUser = asyncHandler( async (req, res) => {
    res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "Ok")
    )
});

const getUserChannelProfile = asyncHandler( async (req, res) => {
    // const 
})



export { registerUser, loginUser, logoutUser, refreshTokenAccess, changeCurrentPassword, changeAvatarImage, changeCoverImage, getCurrentUser }