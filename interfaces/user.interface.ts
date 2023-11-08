import { ObjectId } from "mongoose"

export interface User {
    _id:ObjectId
    email: string,
    password: string,
    phoneNumber?: string,
    name: string,
    isVerify:boolean,
    userName:string,
    location?:string,
    proPicPath:string,//profile picture path
    isBan:boolean
    subscribeWith:ObjectId[],
    isVIP:boolean

}
export type RegisterUser =  Pick<User,"email"|"name"|"password"|"phoneNumber">;
export type loginUser =  Pick<User,"email"|"password">