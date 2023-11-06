import { Schema, model } from "mongoose"
import { Admin } from "../../interfaces/admin.interface"

const adminSchema = new Schema<Admin>({
    email: {
        type: String,
        required: true,
        unique:true
    },
    isOwner: {
        type: Boolean
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},
    {
        timestamps: {
            updatedAt: true,
            createdAt: true
        }
    })

export default model("Admin", adminSchema)