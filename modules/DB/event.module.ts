import { Schema, model } from "mongoose";
import { EventApp } from "../../interfaces/event.interface";

const eventSchema = new Schema<EventApp>({
    category: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    subscribers: {
        type: [Schema.ObjectId],
        required: true
    }
},{
    timestamps:{
        updatedAt:true,
        createdAt:true
    }
})

export default model("event", eventSchema)