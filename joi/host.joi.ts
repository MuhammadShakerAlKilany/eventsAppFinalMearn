
import { Host } from "../interfaces/host.interface";
import Joi from "joi";

export const hostSchema = Joi.object<Host>({
    name:Joi.string().min(5).max(200).required()
})
export const hostAdminSchema = Joi.object({
    hostId:Joi.string().min(5).max(200).required(),
    userId:Joi.string().min(5).max(200).required()
})