import { Schema } from "mongoose";
import { Place } from "../interfaces/place.interface";
import Joi from "joi";

export const placeSchema = Joi.object<Place>({
    address: Joi.string().min(5).max(200).required(),
    category: Joi.string().min(5).max(200),
    description: Joi.string().min(5).max(2000).required(),
    googleMapUrl:Joi.string().min(5).max(2000).required()

})
export const placeAdminSchema = Joi.object({
    placeId: Joi.string().length(24).required(),
    userId: Joi.string().length(24).required(),
})
export const placeIdSchema = Joi.object({
    placeId: Joi.string().length(24).required(),
})