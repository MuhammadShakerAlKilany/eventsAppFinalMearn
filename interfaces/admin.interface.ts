import { ObjectId } from "mongoose";

export interface Admin {
    _id: ObjectId,
    isOwner?: boolean,
    email: string,
    password: string,
    name: string,
}