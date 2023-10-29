
import { Host } from "../interfaces/host.interface";
import Joi from "joi";

const hostSchema = Joi.object<Host>({
    name:Joi.string().min(5).max(200).required()
})