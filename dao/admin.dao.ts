import { ObjectId, Schema } from "mongoose";
import { Admin } from "../interfaces/admin.interface";
import { AdminDaoIntr } from "./interface/adminDao";
import adminModule from "../modules/DB/admin.module";
import { genSalt, hash } from "bcrypt";

export default class AdminDao implements AdminDaoIntr {
    async deleteAdmin(_id: Schema.Types.ObjectId): Promise<Admin | null> {
        return await adminModule.findOneAndDelete({_id,isOwner:{$ne:true}}) ;
    }
    async edit(_id: ObjectId, admin: Admin): Promise<Admin | null> {
        if(admin.password){
            const password = admin.password
            const salt = await genSalt(10)
            admin.password = await hash(password, salt) 
        }
        return await adminModule.findByIdAndUpdate(_id,admin,{new:true});
    }
    async createAdmin(admin: Admin): Promise<Admin> {
        const password = admin.password
        const salt = await genSalt(10)
        admin.password = await hash(password, salt) 
        return await adminModule.create(admin);
    }
    async findAdminByEmail(email: string): Promise<Admin | null> {
        return await adminModule.findOne({ email });
    }
    async getAllAdmin(): Promise<Admin[]> {
        return await adminModule.find({}, { password: false });
    }
    async getAdmin(_id: ObjectId): Promise<Admin | null> {
        return await adminModule.findById(_id,{password:false});
    }


}