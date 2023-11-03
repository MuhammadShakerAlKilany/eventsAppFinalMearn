import { ObjectId, Schema } from "mongoose";
import { EventCreat, EventApp } from "../interfaces/event.interface";
import eventModule from "../modules/DB/event.module";
import { EventDaoIntr } from "./interface/eventDao";

export default class EventDao implements EventDaoIntr {
    async findEventWithUser(_id: Schema.Types.ObjectId): Promise<EventApp|null> {
        return await eventModule.findById(_id).populate("user");
    }
    async getAllEvent(): Promise<EventApp[]> {
        return await eventModule.find({},{subscribers:false,admins:false}) ;
    }
    async findEvent(id: Schema.Types.ObjectId): Promise<EventApp | null> {
       return await eventModule.findById(id)
    }
    async createEvent(event: EventCreat): Promise<EventApp> {
        return await eventModule.create(event)
    }
    async eventSubscribe(eventId:ObjectId,userId:ObjectId):Promise<EventApp|null>{
        return await eventModule.findByIdAndUpdate(eventId,{$push:{subscribers:userId}})
    }
}