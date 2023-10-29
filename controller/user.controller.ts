import jwt from "jsonwebtoken";
import  UserDao  from "../dao/user.dao";
import { RegisterUser, loginUser } from "../interfaces/user.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import "dotenv/config"
import {compare} from "bcrypt"
const userDao = new UserDao()
export const register = tryCatchErr<RegisterUser>(async (req, res) => {
    const user = req.body
    const newUser = await userDao.createUser(user)
    const {_id,name,email,phoneNumber}=newUser
    
 const token = jwt.sign({_id,name,email,phoneNumber},process.env.SECRET_KEY!,{expiresIn:"1m"})
 res.status(201).json({message:"user created",token})

})
export const login = tryCatchErr<loginUser>(async (req, res) => {
   const email =  req.body.email
   const user  = await userDao.findUserByEmail(email)
   if(user){
    const password = req.body.password
    const  isCompare = await compare(password,user.password)
    if(isCompare){
        const {_id,name,email,phoneNumber}=user
        const token = jwt.sign({_id,name,email,phoneNumber},process.env.SECRET_KEY!,{expiresIn:"1m"})
        return res.status(200).json({message:"you log in",token})
    
    }
    
   }
})