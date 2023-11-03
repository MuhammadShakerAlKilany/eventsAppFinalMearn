import { Schema, model } from "mongoose";
import { Place } from "../../interfaces/place.interface";

const placeSchema = new Schema<Place>({
    address: {
        type: String,
        required: true
    },
    admins: {
        type: [Schema.ObjectId],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }

},{
    timestamps:{
        updatedAt:true,
        createdAt:true
    }
})
export default model("place", placeSchema)