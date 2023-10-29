import { ObjectId } from "mongoose";
import { EventApp, EventCreat } from "../../interfaces/event.interface";

export interface EventDaoIntr{
    createEvent(event:EventCreat):Promise<EventApp>,
    findEvent(id:ObjectId):Promise<EventApp|null>,
}