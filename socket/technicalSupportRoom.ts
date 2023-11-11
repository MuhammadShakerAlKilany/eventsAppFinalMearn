import { Socket } from "socket.io"
import userModule from "../modules/DB/user.module"
import technicalSupportMeassageModule from "../modules/DB/technicalSupportMeassage.module"

export const technicalSupportRoom =async (socket: Socket)=>{
    try{
    socket.on("send_message",async (meassage,userId)=>{
     const _id=   (socket as any)["user"]._id
     const userName=   (socket as any)["user"].userName;
     let room:string
     if(userName){
        room = _id
        socket.to(_id).emit("new_message",meassage)
        
    }else{
        room = userId
        socket.to(userId).emit("new_message",meassage)
        socket.broadcast.emit("notification_new_message", _id)
     }
     if(room){

      const meassageStore =  await technicalSupportMeassageModule.findById(room)
      if(meassageStore){

          meassageStore.messageStore.unshift({message:room,name:userName})
          
      }
     }
    })
    socket.on("join_room",(userId)=>{
        const _id=   (socket as any)["user"]._id
        const userName=   (socket as any)["user"].userName;
        if(userName){
           socket.join(_id)
        }else{
           socket.join(userId)
        }
    })
    socket.on("leave_room",(userId)=>{
        const _id=   (socket as any)["user"]._id
        const userName=   (socket as any)["user"].userName;
        if(userName){
           socket.leave(_id)
        }else{
           socket.leave(userId)
        }
    })
    console.log("technicalSupportRoom")
}catch(err){
    console.log(err)
}
   
}