import { RegisterUser, User } from "../../interfaces/user.interface";

export interface UserDaoIntr{
    createUser(user:RegisterUser):Promise<User>,
    findUserByEmail(email:string):Promise<User|null>,
    
}