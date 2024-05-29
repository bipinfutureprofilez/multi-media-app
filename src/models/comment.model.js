import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, "Comment is required!"],
        trim: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    commentBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const Comment = mongoose.model("Comment", commentSchema)