import Joi from "joi";
import { EventApp } from "../interfaces/event.interface";

const eventSchema = Joi.object<EventApp>({
    category: Joi.string().min(5).max(200).required(),
    dateTime: Joi.date().required(),
    title: Joi.string().min(5).max(200).required(),
    description:Joi.string().min(5).max(200).required(),

})