import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createVideo = asyncHandler( async (req, res) => {

    // const {} = req.body;
    const videoPath = req.files?.video[0].path;
    // const thumbnailPath = req.files?.thumbnail[0].path;
    console.log('llllllllllllllllll: ', videoPath);

    const video = await uploadOnCloudinary(videoPath);
    // const thumbnail = await uploadOnCloudinary(thumbnailPath);

    if (!video) {
        throw new ApiError(500, "Something went wrong while file uploading!")
    }

    res
    .status(201)
    .json(
        new ApiResponse(
            201,
            { video },
            "Video uploaded successfully!"
        )
    )
})

export { createVideo }