import { Schema, model } from "mongoose";
import { Host } from "../interfaces/host.interface";

const hostSchema = new Schema<Host>({
    admins: {
        type: [Schema.ObjectId],
        required: true
    },
    name: {
        type: String,
        required: true
    }
})
export default model("host", hostSchema)