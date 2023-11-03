import { ObjectId } from "mongoose";
import { EventApp, EventCreat } from "../../interfaces/event.interface";

export interface EventDaoIntr{
    createEvent(event:EventCreat):Promise<EventApp>,
    findEvent(id:ObjectId):Promise<EventApp|null>,
    getAllEvent():Promise<EventApp[]>,
    eventSubscribe(eventId:ObjectId,userId:ObjectId):Promise<EventApp|null>,
    findEventWithUser(id:ObjectId):Promise<EventApp|null>,
    
    
}