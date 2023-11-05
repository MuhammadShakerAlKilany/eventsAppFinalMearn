import { ObjectId, Schema } from "mongoose";
import { EventCreat, EventApp } from "../interfaces/event.interface";
import eventModule from "../modules/DB/event.module";
import { EventDaoIntr } from "./interface/eventDao";
import HostDao from "./host.dao";
export default class EventDao implements EventDaoIntr {
    async getAllEventByHostId(hostId: Schema.Types.ObjectId): Promise<EventApp[]> {
        return await eventModule.find({ host: hostId });
    }
    async userEventAmin(userId: Schema.Types.ObjectId): Promise<EventApp[]> {
        const events = [] as EventApp[];
        const hosts = await new HostDao().findAdminHosts(userId)
        hosts.forEach(async(event) => {
        const eventsFonund = await  this.getAllEventByHostId(event._id)
        events.push(...eventsFonund)
        })
        return events;
    }
    async userEvent(userId: Schema.Types.ObjectId): Promise<EventApp[]> {
        return await eventModule.find({ subscribers: userId }, { subscribers: false, admins: false });
    }
    async findEventWithUser(_id: Schema.Types.ObjectId): Promise<EventApp | null> {
        return await eventModule.findById(_id).populate("user");
    }
    async getAllEvent(): Promise<EventApp[]> {
        return await eventModule.find({}, { subscribers: false, admins: false });
    }
    async findEvent(id: Schema.Types.ObjectId): Promise<EventApp | null> {
        return await eventModule.findById(id)
    }
    async createEvent(event: EventCreat): Promise<EventApp> {
        return await eventModule.create(event)
    }
    async eventSubscribe(eventId: ObjectId, userId: ObjectId): Promise<EventApp | null> {
        return await eventModule.findByIdAndUpdate(eventId, { $addToSet: { subscribers: userId } })
    }
    async eventUnSubscribe(eventId: ObjectId, userId: ObjectId): Promise<EventApp | null> {
        return await eventModule.findByIdAndUpdate(eventId, { $pull: { subscribers: userId } })
    }
}