import Joi from "joi";
import { EventApp } from "../interfaces/event.interface";

export const eventSchema = Joi.object<EventApp>({
    category: Joi.string().min(5).max(200).required(),
    dateTime: Joi.date().required(),
    title: Joi.string().min(5).max(200).required(),
    description:Joi.string().min(5).max(200).required(),
    host:Joi.string().length(24).required(),
    ticketCount:Joi.number().required(),
    place:Joi.string().length(24).required()
    

})
export const subscribeSchema= Joi.object({
    eventId:Joi.string().required(),
    userId:Joi.string().required()
})