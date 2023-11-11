import { newEventNoti } from "../controller/event.controller"

export const eventSock =(id:string) => {
    console.log(id)
    newEventNoti.on(`event-${id}`,(title)=>{
        
    })
}