import { ObjectId } from "mongoose";

export interface Host {
  _id: ObjectId;
  admins: ObjectId[];
  name: string;
  description: string;
  createdBy: ObjectId;
}
