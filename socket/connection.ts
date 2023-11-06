
import { Socket } from "socket.io";
import {test} from "./test"
import { scheduleJob } from "node-schedule";
import { eventSock } from "./events";
import { eventEmitter } from "../controller/event.controller";
export const connection = (socket:Socket) => {
     const date = new Date()
    date.setSeconds( date.getSeconds()+2)
   console.log( scheduleJob(date, async () => {
        socket.emit("test")
        console.log("test")
    }).name)
    console.log("connection")
    socket.on("hi",test)
    socket.on("event",eventSock)
    eventEmitter.on("new_event",(event)=>{
        console.log(event)
    })
    
}

