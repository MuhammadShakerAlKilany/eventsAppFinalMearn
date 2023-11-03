import { User } from "../../interfaces/user.interface";
import tryCatchErr from "../tryCatchErr";

export const guardAdmin = tryCatchErr<any>(async (req,res,next)=>{
 const user = req["user"] as User
   if(user.isAdmin){
    next()
   }else{
    res.status(403).json({message:"you not admin"})
   }
})