import mongoose from "mongoose";
import * as mangoose from "mongoose";

const UserSchema = new mangoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,

}, {
    timestampse: true,
})

export default mongoose.model('User', UserSchema)