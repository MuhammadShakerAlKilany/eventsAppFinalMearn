import { Schema, model } from "mongoose";
import { Event } from "../interfaces/event.interface";

const eventSchema = new Schema<Event>({
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
})

export default model("event", eventSchema)