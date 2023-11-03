import { User } from "../interfaces/user.interface";
import Joi from "joi";

export const userSchema = Joi.object<User>({
    email:Joi.string().email().min(5).max(200).required(),
    name:Joi.string().min(5).max(200).required(),
    password:Joi.string().min(8).max(100).required().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,100}$/),
    phoneNumber:Joi.string().min(5).max(50).required(),
}).required()
export const loginSchema =userSchema.keys({
    name:Joi.forbidden(),
    phoneNumber:Joi.forbidden(),
}).required()
export const registerSchema = userSchema.append()