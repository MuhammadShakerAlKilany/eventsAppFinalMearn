import { ObjectId } from "mongoose";
import PlaceDao from "../dao/place.dao";
import UserDao from "../dao/user.dao";
import { Place } from "../interfaces/place.interface";
import tryCatchErr from "../middleware/tryCatchErr";
const placeDao = new PlaceDao()
export const addPlace = tryCatchErr<Place>(async (req, res) => {
    const adminId = req["user"]._id;
    const userFind = new UserDao().findById(adminId);
    if (!userFind) return res.status(404).json({ message: "not found user" });
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