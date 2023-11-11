import { Schema, model } from "mongoose";
import { EventApp } from "../../interfaces/event.interface";
import userModule from "./user.module";
import { string } from "joi";

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
        required: true,
        ref:"user"
    },
    host: {
        type: Schema.ObjectId,
        required: true,
        ref:"host"
    },
    posterPath: {
        type: String,
    },
    ticketCount: {
        type: Number,
        required: true
    },
    place:{
        type: Schema.ObjectId,
        ref:"place"
    },
    location:{
        type: String,
    }
}, {
    timestamps: {
        updatedAt: true,
        createdAt: true
    }
})

export default model("event", eventSchema)