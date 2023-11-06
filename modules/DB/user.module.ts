import { Schema, model } from "mongoose";
import { User } from "../../interfaces/user.interface";

const userSchema = new Schema<User>({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
    },
    // isAdmin: {
    //     type: Boolean,
    // },
    isVerify: {
        type: Boolean
    },
    isBan: {
        type: Boolean,

    },
    location: {
        type: String,
    },
    userName: {
        type: String,
        required: true
    },
    proPicPath: {
        type: String,
    },
    subscribeWith:{
        type:[Schema.ObjectId],
        ref:"event"
    }
}, {
    timestamps: {
        updatedAt: true,
        createdAt: true
    }
})

export default model("user", userSchema)