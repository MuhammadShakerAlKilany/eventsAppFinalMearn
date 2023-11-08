import { ObjectId } from "mongoose";
import PlaceDao from "../dao/place.dao";
import UserDao from "../dao/user.dao";
import { Place } from "../interfaces/place.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import placeModule from "../modules/DB/place.module";
const placeDao = new PlaceDao()
export const addPlace = tryCatchErr<Place>(async (req, res) => {
    const adminId = req["user"]._id;
    // req.files?.map((file)=>{
    //     return file
    // })
    
    const userFind = await new UserDao().findById(adminId);
    if (!userFind) return res.status(404).json({ message: "you logout" });
    const placeNum = await placeModule.find({ admins: adminId }).count()
    if (placeNum >= 1 && !userFind.isVIP) return res.json({ message: "chang your plan to add more place" })
    if (placeNum >= 5 && userFind.isVIP) return res.json({ message: "you cant add more then 5 place" })
    const place = req.body
    place.admins = [adminId]
    const placeCreated = await placeDao.createPlace(place)
    return res.status(201).json({ message: "place created", data: placeCreated })
})
export const addAdmin = tryCatchErr<never, { placeId: ObjectId, userId: ObjectId }>(async (req, res) => {
    const placeId = req.params.placeId;
    const userId = req.params.userId;
    const adminId = req["user"]._id
    const userFind = await new UserDao().findById(userId)
    if (!userFind) return res.status(404).json({ message: "not found user" })
    if (userFind.isBan) return res.status(404).json({ message: "user is Ban" })
    const placeNum = await placeModule.find({ admins: userId }).count()
    if (placeNum >= 1 && !userFind.isVIP) return res.json({ message: "chang user plan to add more place" })
    if (placeNum >= 5 && userFind.isVIP) return res.json({ message: "user cant add more then 5 place" })
    const place = await placeDao.addAdmin(placeId, userId, adminId)
    if (!place) return res.status(404).json({ message: "not found place", data: { _id: placeId } })
    return res.json({ message: "admin added", data: place })
})
export const removAdmin = tryCatchErr<never, { placeId: ObjectId, userId: ObjectId }>(async (req, res) => {
    const placeId = req.params.placeId;
    const userId = req.params.userId;
    const adminId = req["user"]._id;
    const userFind = await new UserDao().findById(userId);
    if (!userFind) return res.status(404).json({ message: "not found user" });
    const place = await placeDao.removAdmin(placeId, userId, adminId);
    if (!place) return res.status(404).json({ message: "not found place", data: { _id: placeId } });
    return res.json({ message: "admin remove", data: place });
})
export const editPlace = tryCatchErr<Place, { placeId: ObjectId }>(async (req, res) => {
    const placeId = req.params.placeId;
    const place = req.body;
    const adminId = req["user"]._id;
    const placeCreated = await placeDao.edit(placeId, place, adminId)
    if (!placeCreated) return res.status(404).json({ message: "not found host", data: { _id: placeId } });
    return res.json({ message: "host edited", data: placeCreated });
})
export const getUserPlace = tryCatchErr(async (req, res) => {
    const adminId = req["user"]._id
    const places = await placeModule.find({ admins: adminId })
    return res.json({ message: "places", data: places })
})
export const getAllPlace = tryCatchErr(async (req, res) => {
    const places = await placeModule.find()
    return res.json({ message: "places", data: places })
})
export const getPlaceByID = tryCatchErr<never, { placeId: ObjectId }>(async (req, res) => {
  const placeId =  req.params.placeId;
  const place = await placeModule.findById(placeId);
  return res.json({message:"place",data:place})
})
