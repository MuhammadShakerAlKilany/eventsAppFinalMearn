import Joi from "joi";
import { Admin } from "../interfaces/admin.interface";

export const adminSchema  = Joi.object<Admin>({
    email:Joi.string().email().min(5).max(200).required(),
    name:Joi.string().min(5).max(200).required(),
    password:Joi.string().min(8).max(100).required().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,100}$/),
}).required()
export const adminSchemaUpdate  = Joi.object<Admin>({
    email:Joi.string().email().min(5).max(200),
    name:Joi.string().min(5).max(200),
    password:Joi.string().min(8).max(100).pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,100}$/),
}).required()