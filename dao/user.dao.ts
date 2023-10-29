import { RegisterUser, User } from "../interfaces/user.interface";
import userModule from "../modules/user.module";
import { UserDaoIntr } from "./interface/userDao";
import { genSalt, hash } from "bcrypt";

export default class UserDao implements UserDaoIntr {
    async createUser(user: RegisterUser): Promise<User> {
        const password = user.password
        const salt = await genSalt(10)
        user.password = await hash(password, salt)
        return await userModule.create(user)
    }
    async findUserByEmail(email: string): Promise<User | null> {
        return await userModule.findOne({ email })
    }

}