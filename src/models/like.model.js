import mongoose, {Schema} from "mongoose";


const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    likeBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }    
},{timestamps: true})


export const Like = mongoose.model("Like", likeSchema)