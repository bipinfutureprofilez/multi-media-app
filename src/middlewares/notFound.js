import { ApiResponse } from "../utils/apiResponse.js"

const notFound = (req, res) => {
    res
    .status(404)
    .json(
        new ApiResponse(404, {}, "Route does not exist!")
    )
}

export { notFound }