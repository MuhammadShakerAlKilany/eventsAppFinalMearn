import { ObjectId } from "mongoose";
import { Host } from "../../interfaces/host.interface";


export interface HostDaoIntr {
    createHost(host: Host): Promise<Host | null>,
    addAdmin(hostId: ObjectId, userId: ObjectId): Promise<Host | null>,
    removAdmin(hostId: ObjectId, userId: ObjectId): Promise<Host | null>,
    edet(hostId: ObjectId, place: Host): Promise<Host | null>,
}