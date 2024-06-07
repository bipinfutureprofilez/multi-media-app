import { ApiResponse } from "../utils/apiResponse.js";

const error = (err, req, res, next) => {
    return res
    .status(err.statusCode)
    .json(
        new ApiResponse(
            err.statusCode,
            {},
            `${err.message}`
        )
    )
}

export default error;