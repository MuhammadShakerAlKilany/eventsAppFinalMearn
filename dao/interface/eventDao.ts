import { ObjectId } from "mongoose";
import { EventApp, EventCreat } from "../../interfaces/event.interface";

export interface EventDaoIntr{
    createEvent(event:EventCreat):Promise<EventApp>,
    findEvent(id:ObjectId):Promise<EventApp|null>,
    getAllEvent():Promise<EventApp[]>,
    eventSubscribe(eventId:ObjectId,userId:ObjectId):Promise<EventApp|null>,
    findEventWithUser(id:ObjectId):Promise<EventApp|null>,
    eventUnSubscribe(eventId: ObjectId, userId: ObjectId): Promise<EventApp | null>
    userEventAmin(userId:ObjectId):Promise<EventApp[]>,
    getAllEventByHostId(hostId:ObjectId):Promise<EventApp[]>,
    edit(eventId:ObjectId,event:EventApp): Promise<EventApp | null>,
    getEventSubscribeWith(userId:ObjectId):Promise<EventApp[]>,
    delete(_id:ObjectId):Promise<EventApp|null>,
}