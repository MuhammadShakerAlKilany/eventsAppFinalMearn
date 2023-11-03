import { ObjectId } from "mongoose";
import EventDao from "../dao/event.dao";
import { EventCreat } from "../interfaces/event.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import { EventEmitter } from "events"
import { scheduleJob } from "node-schedule"
import UserDao from "../dao/user.dao";
export const eventEmitter = new EventEmitter()
const eventDao = new EventDao()
const userDao = new UserDao()
export const eventCreat = tryCatchErr<EventCreat>(async (req, res) => {
    const event = req.body
    event.posterPath = req.file?.path!
    const newEvent = await eventDao.createEvent(event)
    const date = new Date(newEvent.dateTime)
    date.setHours(date.getHours() - 1)
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

export const allEvent = tryCatchErr(async (req,res)=>{
 const events =  await eventDao.getAllEvent()
 return res.json({message:"all events",data:events})
})
export const findEvent = tryCatchErr<never,{_id:ObjectId}>(async (req,res)=>{
    const _id = req.params._id
 const event =  await eventDao.findEvent(_id)
 if(!event)return res.json({message:"not find events",data:{_id}})
 return res.json({message:"find events",data:event})
})
export const subscribe = tryCatchErr<never,{eventId:ObjectId,userId:ObjectId}>(async (req,res)=>{
   const eventId = req.params.eventId;
   const userId = req.params.userId;
 const user =  await userDao.findById(userId)
 if(!user)return res.status(404).json({message:"not found user",data:{userId}})
 const event =  await eventDao.eventSubscribe(eventId,userId)
if(!event)return res.status(404).json({message:"not found event",data:{eventId}})
return res.json({message:"subscribe success"})

})