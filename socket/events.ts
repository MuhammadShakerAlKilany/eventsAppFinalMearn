import { eventEmitter } from "../controller/event.controller"

export const eventSock =(id:string) => {
    console.log(id)
    eventEmitter.on(`event-${id}`,(title)=>{
        
    })
}