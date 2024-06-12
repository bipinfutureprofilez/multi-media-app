import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createVideo = asyncHandler( async (req, res) => {

    // const {} = req.body;
    const videoPath = req.files?.videos[0].path;
    // const thumbnailPath = req.files?.thumbnail[0].path;

    const video = await uploadOnCloudinary(videoPath);
    // const thumbnail = await uploadOnCloudinary(thumbnailPath);

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