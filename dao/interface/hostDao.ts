import { ObjectId } from "mongoose";
import { Host } from "../../interfaces/host.interface";


export interface HostDaoIntr {
    createHost(host: Host): Promise<Host>,
    addAdmin(hostId: ObjectId, userId: ObjectId,adminId:ObjectId): Promise<Host | null>,
    removAdmin(hostId: ObjectId, userId: ObjectId,adminId:ObjectId): Promise<Host | null>,
    edit(hostId: ObjectId, hostName: String,adminId:ObjectId): Promise<Host | null>,
    findAdminHosts( adminId:ObjectId): Promise<Host[]>,
    findHost(hostId: ObjectId)
}