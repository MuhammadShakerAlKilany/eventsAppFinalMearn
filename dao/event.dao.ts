import { ObjectId, Schema } from "mongoose";
import { EventCreat, EventApp } from "../interfaces/event.interface";
import eventModule from "../modules/DB/event.module";
import { EventDaoIntr } from "./interface/eventDao";
import HostDao from "./host.dao";
import userModule from "../modules/DB/user.module";
export default class EventDao implements EventDaoIntr {
    async delete(_id: Schema.Types.ObjectId): Promise<EventApp|null> {
        const event = await eventModule.findByIdAndDelete({ _id });
        if (event) {
            await userModule.updateMany({}, { $pull: { subscribeWith: _id } });
        }
        return event
    }
    async getEventSubscribeWith(userId: Schema.Types.ObjectId): Promise<EventApp[]> {
        return await eventModule.find({ subscribers: userId });
    }
    async edit(eventId: Schema.Types.ObjectId, event: EventApp): Promise<EventApp | null> {
        return await eventModule.findByIdAndUpdate(eventId, event, { new: true });
    }
    async getAllEventByHostId(hostId: Schema.Types.ObjectId): Promise<EventApp[]> {
        return await eventModule.find({ host: hostId });
    }
    async userEventAmin(userId: Schema.Types.ObjectId): Promise<EventApp[]> {
        const events = [] as EventApp[];
        const hosts = await new HostDao().findAdminHosts(userId)
        hosts.forEach(async (host) => {
            const eventsFonund = await this.getAllEventByHostId(host._id)
            events.push(...eventsFonund)
        })
        return events;
    }
    async findEventWithUser(_id: Schema.Types.ObjectId): Promise<EventApp | null> {
        return await eventModule.findById(_id).populate("place").populate("host").populate("subscribers", "-password");
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
        await userModule.findByIdAndUpdate(userId, { $addToSet: { subscribeWith: eventId } })
        return await eventModule.findOneAndUpdate({ _id: eventId, dateTime: { $gte: (new Date()) } }, { $addToSet: { subscribers: userId } })
    }
    async eventUnSubscribe(eventId: ObjectId, userId: ObjectId): Promise<EventApp | null> {
        await userModule.findByIdAndUpdate(userId, { $pull: { subscribeWith: eventId } })
        return await eventModule.findOneAndUpdate({ _id: eventId, dateTime: { $gte: (new Date()) } }, { $pull: { subscribers: userId } })
    }

}