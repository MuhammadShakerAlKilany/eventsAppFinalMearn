import { User } from "../interfaces/user.interface";
import Joi from "joi";

export const loginSchema = Joi.object<User>({
    email: Joi.string().email().min(5).max(200).required(),
    password: Joi.string().min(8).max(100).required().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,100}$/),
}).required()

export const userSchema = loginSchema.keys({
    name: Joi.string().min(5).max(200).required(),
    phoneNumber: Joi.string().min(5).max(50),
    userName: Joi.string().min(5).max(50).required(),
    location: Joi.string().min(5).max(50)

}).required()
export const registerSchema = userSchema.append()
export const idSchema = Joi.object({
    _id: Joi.string().required()
})
export const tokenSchema = Joi.object({
    token: Joi.string().required()
})
export const userUpdateSchema = Joi.object({
    password: Joi.string().min(8).max(100).pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,100}$/),
    name: Joi.string().min(5).max(200),
    phoneNumber: Joi.string().min(5).max(50),
    userName: Joi.string().min(5).max(50),
    location: Joi.string().min(5).max(50)

}).required()
export const userUpdateWithAdminSchema = Joi.object<User>({
    password: Joi.string().min(8).max(100).pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,100}$/),
    name: Joi.string().min(5).max(200),
    phoneNumber: Joi.string().min(5).max(50),
    userName: Joi.string().min(5).max(50),
    location: Joi.string().min(5).max(50),
    isVerify: Joi.boolean(),
    isBan: Joi.boolean(),
    isVIP: Joi.boolean()

}).required()