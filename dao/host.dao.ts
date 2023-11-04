import { ObjectId, Schema } from "mongoose";
import { Host } from "../interfaces/host.interface";
import { HostDaoIntr } from "./interface/hostDao";
import hostModule from "../modules/DB/host.module";

export default class HostDao implements HostDaoIntr {
    async createHost(host: Host): Promise<Host | null> {
        return await hostModule.create(host);
    }
    async addAdmin(hostId: ObjectId, userId: Schema.Types.ObjectId): Promise<Host | null> {
        return await hostModule.findByIdAndUpdate(hostId, { $push: { admins: userId } });
    }
    async removAdmin(hostId: ObjectId, userId: Schema.Types.ObjectId): Promise<Host | null> {
        return await hostModule.findByIdAndUpdate(hostId,{$pull:{admins:userId}});
    }
    async edet(hostId: Schema.Types.ObjectId, place: Host): Promise<Host | null> {
        return await hostModule.findByIdAndUpdate(hostId,place);
    }

}