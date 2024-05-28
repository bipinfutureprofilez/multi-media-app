import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        trim: true,
        unique: true,
        index: true
    },
    fullName: {
        type: String,
        required: [true, 'FullName is required!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        match: [/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, 'Email is not valid!'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true
    },
    avatar: {
        type: String,
        required: [true, 'Avatar image is required!']
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required!']
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
})

export const User = mongoose.model('User', userSchema)