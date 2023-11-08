import jwt from "jsonwebtoken";
import UserDao from "../dao/user.dao";
import { RegisterUser, User, loginUser } from "../interfaces/user.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import "dotenv/config"
import { compare } from "bcrypt"
import sendVerified from "../modules/email/sendVerified";
import { ObjectId } from "mongoose";
import userModule from "../modules/DB/user.module";
import fs from "fs/promises"
import path from "path"
const userDao = new UserDao()
export const register = tryCatchErr<RegisterUser>(async (req, res) => {
    const user = req.body as User
    user.proPicPath = req.file?.path!
    const newUser = await userDao.createUser(user)
    const { _id, name, email, phoneNumber } = newUser
    const token = jwt.sign({ _id, name, email, phoneNumber }, process.env.SECRET_KEY!, { expiresIn: "30m" })
    await sendVerified(user.email, token)
    res.status(201).json({ message: "user created" })

})
export const login = tryCatchErr<loginUser>(async (req, res) => {
    const email = req.body.email
    const user = await userDao.findUserByEmail(email)
    if (user) {
        if (user.isBan) return res.status(403).json({ message: "your account is banned" })
        if (!user.isVerify) return res.status(403).json({ message: "varify your email" })
        const password = req.body.password
        const isCompare = await compare(password, user.password)
        console.log(user.password)
        if (isCompare) {
            const { _id, name, email, phoneNumber, isBan, isVerify } = user
            const userData = {...user,password:undefined}
            const token = jwt.sign({ _id, name, email, phoneNumber, isBan, isVerify }, process.env.SECRET_KEY!, { expiresIn: "30 days" })
            return res.status(200).json({ message: "you log in", token, data: userData })
        }
    }
    return res.status(404).json({ message: "email or password is wrong" })
})

export const allUser = tryCatchErr(async (req, res) => {
    const users = await userDao.getAllUser()
    return res.json({ message: "all users", data: users })
})
export const allUserBan = tryCatchErr(async (req, res) => {
    console.log("allUserBan")
    const users = await userDao.getAllUserIsBan()
    return res.json({ message: "all ban users", data: users })
})
export const banUser = tryCatchErr<never, { _id: ObjectId }>(async (req, res) => {
    const id = req.params._id
    const user = await userDao.banUser(id)
    if (!user) return res.status(404).json({ message: "user not found" })
    return res.json({ message: `user ban:${user.isBan}` })
})

// export const adminUser = tryCatchErr<never,{_id:ObjectId}>(async (req,res)=>{
//     const id =  req.params._id
//   const user =  await userDao.adminUser(id)
//   if(!user)return res.status(404).json({message:"user not found"})
//   return res.json({message:`user admin:${user.isAdmin}`})
// })
export const varifyUser = tryCatchErr<never, { token: string }>(async (req, res) => {
    const token = req.params.token
    console.log(token)
    const tokenData = jwt.verify(token, process.env.SECRET_KEY!) as { _id: ObjectId }
    const user = await userDao.varifyUser(tokenData._id)
    if (!user) return res.status(404).json({ message: "user not found" })
    return res.json({ message: `user varify` })
})
export const edite = tryCatchErr<User>(async (req, res) => {
    console.log("user admin update")
    const _id = req["user"]?._id;
    const userData = req.body;
    if(req.file?.path){
        userData.proPicPath = req.file?.path
    }
    if(!_id)return res.status(404).json({message:"not found user"})
    const user = await userDao.edit(_id, userData);
    if(!user)return res.status(404).json({message:"not found user"})
    return res.json({message:"update user",data:user})
})
export const editeUserWithAdmin = tryCatchErr<User,any>(async (req, res) => {

    const _id = req.params._id!;
    const userData = req.body;
    if(req.file?.path){
        userData.proPicPath = req.file?.path
    }
    if(!_id)return res.status(404).json({message:"not found user"})
    const user = await userDao.edit(_id, userData);
    if(!user)return res.status(404).json({message:"not found user"})
    return res.json({message:"update user",data:user})
})
export const deleteUser = tryCatchErr<never,{_id:ObjectId}>(async (req, res) => {
    const _id = req.params._id;
   const user = await userDao.delete(_id)
   if(!user)return res.status(404).json({message:"not found user"})
    return res.json({message:"delete user",data:user})
})
export const addUser = tryCatchErr<User,any>(async (req, res) => {
    const user = req.body as User
    user.proPicPath = req.file?.path!
    user.isVerify= true
    const newUser = await userDao.createUser(user);
    return res.status(201).json({message:"user created",data:newUser})
})
export  const getUserProPicPath = tryCatchErr<never,{_id:ObjectId}>(async (req,res)=>{
    const _id = req.params._id
   const user = await userModule.findById(_id)
   if (!user) return res.status(404).json({ message: "user not found" });
    // const proPicPath = await fs.readFile();
    return res.sendFile(path.join(__dirname,"..",user.proPicPath))
})