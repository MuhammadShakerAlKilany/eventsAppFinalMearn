import { ObjectId, Schema } from "mongoose";
import { Host } from "../interfaces/host.interface";
import { HostDaoIntr } from "./interface/hostDao";
import hostModule from "../modules/DB/host.module";
export default class HostDao implements HostDaoIntr {
    async findHost(hostId: Schema.Types.ObjectId) {
        return await hostModule.findById(hostId);
    }
    async findAdminHosts( adminId: Schema.Types.ObjectId): Promise<Host[]> {
       return await hostModule.find({admins:adminId});
    }
    async createHost(host: Host): Promise<Host> {
        return await hostModule.create(host);
    }
    async addAdmin(hostId: ObjectId, userId: ObjectId,adminId:ObjectId): Promise<Host | null> {
        return await hostModule.findOneAndUpdate({_id:hostId,admins:adminId}, { $addToSet: { admins: userId } },{new:true});
    }
    async removAdmin(hostId: ObjectId, userId: ObjectId,adminId:ObjectId): Promise<Host | null> {
        return await hostModule.findOneAndUpdate({_id:hostId,admins:adminId},{$pull:{admins:userId}},{new:true});
    }
    async edit(hostId: ObjectId, hostName: String,adminId:ObjectId): Promise<Host | null> {
        return await hostModule.findOneAndUpdate({_id:hostId,admins:adminId},{$set:{name:hostName}},{new:true});
    }
}