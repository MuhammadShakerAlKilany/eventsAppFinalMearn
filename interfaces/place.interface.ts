import { ObjectId } from "mongoose";

export interface Place {
    category: string,
    address: string,
    admins: ObjectId[],
    description: string,
}