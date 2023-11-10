import { ObjectId } from "mongoose";

export interface messageEventRoom {
    _id:ObjectId,
    messageStore:{
        [x: string]: any;
        name:string,
        message:string
    }[],
}