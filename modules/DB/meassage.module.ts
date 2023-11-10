import { Schema, model } from "mongoose";
import { User } from "../../interfaces/user.interface";
import { messageEventRoom } from "../../interfaces/message.interface";

const messageSchema = new Schema<messageEventRoom>({
    messageStore:[ new Schema({
        name: String,
        message: String,

    },{
        timestamps: {
            createdAt: true
        }
    })]
}, {
    timestamps: {
        updatedAt: true,
        createdAt: true
    }
})

export default model("message", messageSchema)