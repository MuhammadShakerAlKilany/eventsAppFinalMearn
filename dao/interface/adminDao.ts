import { ObjectId } from "mongoose";
import { Admin } from "../../interfaces/admin.interface";

export interface AdminDaoIntr{
    createAdmin(admin: Admin): Promise<Admin>,
    findAdminByEmail(email: string): Promise<Admin | null>,
    getAllAdmin(): Promise<Admin[]>,
    getAdmin(_id: ObjectId): Promise<Admin | null>,
    edit(_id:ObjectId,admin: Admin):Promise<Admin|null>,
    deleteAdmin(_id:ObjectId):Promise<Admin|null>,
}