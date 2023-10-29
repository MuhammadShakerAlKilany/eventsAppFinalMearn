import EventDao from "../dao/event.dao";
import { EventCreat } from "../interfaces/event.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import { EventEmitter } from "events"
import { scheduleJob } from "node-schedule"
const eventEmitter = new EventEmitter()
const eventDao = new EventDao()
export const eventCreat = tryCatchErr<EventCreat>(async (req, res) => {
    const event = req.body
    const newEvent = await eventDao.createEvent(event)
    const date = new Date(newEvent.dateTime)
    scheduleJob(date, async () => {
        const event = await eventDao.findEvent(newEvent._id)
        if (event) {
            event.subscribers.forEach((userId) => {
                eventEmitter.emit(`event-${userId}`, event.title)
            })
        }
    })
    res.status(201).json({ message: "event created", data: newEvent })
})