import { ObjectId } from "mongoose";

export interface Event{
    category:string,
    title:string,
    dateTime:Date,
    description:string,
    subscribers:ObjectId[],
}