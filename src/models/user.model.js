import mongoose, {Schema} from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        type: String,
        default: ''
    }
},
{
    timestamps: true
});

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.getSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.createToken = async function(){
    return await jwt.sign({ id: this._id, name: this.fullName }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY})
}

userSchema.methods.createRefreshToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}

export const User = mongoose.model('User', userSchema)