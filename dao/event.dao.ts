import { Schema } from "mongoose";
import { EventCreat, EventApp } from "../interfaces/event.interface";
import eventModule from "../modules/DB/event.module";
import { EventDaoIntr } from "./interface/eventDao";

export default class EventDao implements EventDaoIntr {
    async findEvent(id: Schema.Types.ObjectId): Promise<EventApp | null> {
       return await eventModule.findById(id)
    }
    async createEvent(event: EventCreat): Promise<EventApp> {
        return await eventModule.create(event)
    }
}