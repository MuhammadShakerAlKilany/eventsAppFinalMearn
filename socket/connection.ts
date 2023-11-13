
import { Socket } from "socket.io";
import { scheduleJob } from "node-schedule";
import { eventSock } from "./events";
import { newEventNoti } from "../controller/event.controller";
import eventModule from "../modules/DB/event.module";
import messageModule from "../modules/DB/meassage.module";
import userModule from "../modules/DB/user.module";
import { technicalSupportRoom } from "./technicalSupportRoom";
export const connection = (socket: Socket) => {
    try {
        const date = new Date()
        date.setSeconds(date.getSeconds() + 2)
        // console.log(scheduleJob(date, async () => {
            //     socket.emit("test")
            //     console.log("test")
            // }).name)
            console.log("connection")
            // socket.on("hi", test)
            socket.on("event", eventSock)
            socket.on("get_events_rooms", async (userId) => {
                try {
                    const user = await userModule.findById(userId).populate("subscribeWith", "title")
            console.log(user)
            socket.emit("events_rooms", user?.subscribeWith)
        } catch (error) {
            console.log(error)
        }
    })
    const newEvent = (event:any) => {
        console.log("new_event")
        socket.broadcast.emit("new_event", event)
    }
    newEventNoti.on("new_event", newEvent)
    socket.on("send_message", async (eventId, message, selfMessage) => {
        const userName = (socket as any)["user"].userName
        console.log("eventId", eventId)
        let meassageStor = await messageModule.findById(eventId)
        if (!meassageStor) {
            meassageStor = await messageModule.create({ _id: eventId, messageStore: [] })
        }
        meassageStor.messageStore.unshift({
            message: message, name: userName,
        })
        const meassageStorSave = await meassageStor.save()
        console.log(meassageStorSave.messageStore[0])
        if (selfMessage) {
            selfMessage(meassageStorSave.messageStore[0])
        }
        socket.broadcast.to(eventId).emit("new_message", meassageStorSave.messageStore[0])
        socket.broadcast.emit("notification_new_message", eventId)

    })
    socket.on("join_room", async (eventId, getMeassages) => {
        try {
            console.log((socket as any)["user"].userName)
            const event = await eventModule.findById(eventId)
            let meassageStor = await messageModule.findById(eventId)
            if (event) {
                socket.join(eventId)
                console.log("join room", eventId)
                if(getMeassages){

                    getMeassages(meassageStor?.messageStore)
                }
                // socket.on()
            }
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("leave_room", async (eventId) => {
        try {
            socket.leave(eventId)
            console.log("leave room", eventId)
            // socket.on()
        } catch (err) {
            console.log(err)
        }
    })
    socket.on("edit_message", async (eventId, messageId, newMessage) => {
        let meassageStor = await messageModule.findById(eventId);
        console.log(eventId, messageId, newMessage)

        const messI = meassageStor?.messageStore.findIndex((message) => {
            return message._id == messageId
        })
        console.log(messI)
        if (messI != undefined &&  meassageStor?.messageStore[messI]) {
            console.log(meassageStor.messageStore[messI])
            meassageStor.messageStore[messI].message = newMessage
            await meassageStor?.save()
            socket.broadcast.to(eventId).emit("new_message",meassageStor.messageStore[messI])
            socket.broadcast.emit("notification_new_message", eventId)
        }
    })
    socket.on("disconnect",()=>{
        socket.disconnect(true)
        newEventNoti.off("new_event",newEvent)
        console.log("disconnect")
    })
} catch (error) {
     console.log("socket Err",error)   
}


    
}