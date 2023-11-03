import tryCatchErr from "../tryCatchErr";

export const guardHost = tryCatchErr<any>(async (req,res,next)=>{
   if(req.user.type == "host"){
    next()
   }else{
    res.status(403).json({message:"you not host"})
   }
})