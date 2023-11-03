import { ObjectId } from "mongoose";

export interface Host{
    admins:ObjectId[],
    name:string

}