import { Schema } from "mongoose";
import { Place } from "../interfaces/place.interface";
import Joi from "joi";

const placeSchema = Joi.object<Place>({
    address:Joi.string().min(5).max(200).required(),
    category:Joi.string().min(5).max(200).required(),
    description:Joi.string().min(5).max(200).required()

})