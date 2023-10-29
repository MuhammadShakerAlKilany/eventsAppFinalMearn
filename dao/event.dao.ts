import { EventCreat, EventApp } from "../interfaces/event.interface";
import eventModule from "../modules/event.module";
import { EventDaoIntr } from "./interface/eventDao";

export default class EventDao implements EventDaoIntr {
    async createEvent(event: EventCreat): Promise<EventApp> {
        return await eventModule.create(event)
    }
}