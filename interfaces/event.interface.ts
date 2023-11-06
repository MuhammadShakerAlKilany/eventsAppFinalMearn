import { ObjectId } from "mongoose";

export interface EventApp{
    _id:ObjectId
    category:string,
    title:string,
    dateTime:Date,
    description:string,
    subscribers:ObjectId[],
    host:ObjectId,
    place:ObjectId,
    ticketCount:number,
    posterPath:string
}
export type EventCreat=Omit<EventApp,"subscribers"|"_id">