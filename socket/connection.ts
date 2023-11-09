
import { Socket } from "socket.io";
import { test } from "./test"
import { scheduleJob } from "node-schedule";
import { eventSock } from "./events";
import { eventEmitter } from "../controller/event.controller";
import eventModule from "../modules/DB/event.module";
export const connection = (socket: Socket) => {
    const date = new Date()
    date.setSeconds(date.getSeconds() + 2)
    console.log(scheduleJob(date, async () => {
        socket.emit("test")
        console.log("test")
    }).name)
    console.log("connection")
    socket.on("hi", test)
    socket.on("event", eventSock)
    eventEmitter.on("new_event", (event) => {
        console.log(event)
        socket.broadcast.emit("new_event", event)

    })
    socket.on("send_message", (eventId, message) => {
        console.log(message)
        console.log("eventId", eventId)
        socket.broadcast.to(eventId).emit("new_message", message)
    })
    socket.on("join_room", async (eventId) => {
        try {

            const event = await eventModule.findById(eventId)
            if (event) {
                socket.join(eventId)

                console.log("join room", eventId)
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

}

