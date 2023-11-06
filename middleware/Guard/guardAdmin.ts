import AdminDao from "../../dao/admin.dao";
import { Admin } from "../../interfaces/admin.interface";
import tryCatchErr from "../tryCatchErr";

export const guardAdmin = tryCatchErr<any>(async (req,res,next)=>{
 const user = req["user"] as Admin
 const _id= user._id
 const admin = await new AdminDao().getAdmin(_id)
   if(admin){
    next()
   }else{
    res.status(403).json({message:"you not admin"})
   }
})