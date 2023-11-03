import { ObjectId } from "mongoose"

export interface User {
    _id:ObjectId
    email: string,
    password: string,
    phoneNumber?: string,
    name: string,
    isAdmin:boolean,
    isVerify:boolean,
    userName:string,
    location?:string,
    proPicPath:string,//profile picture path
    isBan:boolean

}
export type RegisterUser =  Pick<User,"email"|"name"|"password"|"phoneNumber">;
export type loginUser =  Pick<User,"email"|"password">