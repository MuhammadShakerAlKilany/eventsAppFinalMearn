import { ObjectId } from "mongoose";
import { RegisterUser, User } from "../../interfaces/user.interface";

export interface UserDaoIntr {
    createUser(user: RegisterUser): Promise<User>,
    findUserByEmail(email: string): Promise<User | null>,
    getAllUser(): Promise<User[]>,
    getUser(_id: ObjectId): Promise<User | null>,
    getAllUserIsBan(): Promise<User[]>,
    banUser(_id: ObjectId): Promise<User | null>,
    varifyUser(_id: ObjectId): Promise<User | null>,
    adminUser(_id: ObjectId): Promise<User | null>,
    findById(_id: ObjectId): Promise<User | null>,
}