import { Schema } from "mongoose";
import { RegisterUser, User } from "../interfaces/user.interface";
import userModule from "../modules/DB/user.module";
import { UserDaoIntr } from "./interface/userDao";
import { genSalt, hash } from "bcrypt";
import eventModule from "../modules/DB/event.module";
import hostModule from "../modules/DB/host.module";
import placeModule from "../modules/DB/place.module";

export default class UserDao implements UserDaoIntr {
    async delete(_id: Schema.Types.ObjectId): Promise<User | null> {
      await  eventModule.updateMany({},{$pull:{subscribers:_id}})
      await hostModule.updateMany({},{$pull:{admins:_id}})
      await hostModule.deleteMany({admins:{$size:0}})
      await placeModule.updateMany({},{$pull:{admins:_id}})
      await placeModule.deleteMany({admins:{$size:0}})
       return await userModule.findByIdAndDelete(_id);
    }
    async edit(_id: Schema.Types.ObjectId, user: User): Promise<User | null> {
        return await userModule.findByIdAndUpdate(_id,user,{new:true});
    }
    async findById(_id: Schema.Types.ObjectId): Promise<User | null> {
        return await userModule.findById(_id);
    }
    async getAllUser(): Promise<User[]> {
        return await userModule.find({}, { password: false });
    }
    async getUser(_id: Schema.Types.ObjectId): Promise<User | null> {
        return await userModule.findById(_id);
    }
    async getAllUserIsBan(): Promise<User[]> {
        return await userModule.find({ isBan: true });
    }
    async banUser(_id: Schema.Types.ObjectId): Promise<User | null> {
        const user = await userModule.findById(_id);
        if (!user) return null
        user.isBan = !user.isBan
        return await user.save();
    }
    async varifyUser(_id: Schema.Types.ObjectId): Promise<User | null> {
        return await userModule.findByIdAndUpdate(_id, { $set: { isVerify: true } }, { new: true });
    }
    // async adminUser(_id: Schema.Types.ObjectId): Promise<User | null> {
    //     const user = await userModule.findById(_id);
    //     if(!user)return null
    //     user.isAdmin = !user.isAdmin

    //      return await user.save()
    // }
    async createUser(user: RegisterUser): Promise<User> {
        const password = user.password
        const salt = await genSalt(10)
        user.password = await hash(password, salt)
        return await userModule.create(user)
    }
    async findUserByEmail(email: string): Promise<User | null> {
        return await userModule.findOne({ email }).populate("subscribeWith","title")
    }

}