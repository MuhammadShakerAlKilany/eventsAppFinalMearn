import { ObjectId } from "mongoose";

export interface Place {
    _id:ObjectId,
    category: string,
    address: string,
    admins: ObjectId[],
    description: string,
    placPhoto:string
}