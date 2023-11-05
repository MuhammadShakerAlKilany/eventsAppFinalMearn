import { ObjectId } from "mongoose";
import HostDao from "../dao/host.dao";
import UserDao from "../dao/user.dao";
import { Host } from "../interfaces/host.interface";
import tryCatchErr from "../middleware/tryCatchErr";
const hostDao = new HostDao()
export const addHost = tryCatchErr<Host>(async (req, res) => {
    const userId = req["user"]._id
    const userFind = new UserDao().findById(userId);
    if (!userFind) return res.status(404).json({ message: "not found user" });
    const host = req.body
    host.admins = [userId]
    const hostCreated = await hostDao.createHost(host)
    return res.status(201).json({ message: "host created", data: hostCreated })
})
export const addAdmin = tryCatchErr<never, { hostId: ObjectId, userId: ObjectId }>(async (req, res) => {
    const hostId = req.params.hostId;
    const userId = req.params.userId;
    const adminId = req["user"]._id
    const userFind =await new UserDao().findById(userId)
    if (!userFind) return res.status(404).json({ message: "not found user" })
    const host = await hostDao.addAdmin(hostId, userId, adminId)
    if (!host) return res.status(404).json({ message: "not found host", data: { _id: hostId } })
    return res.json({ message: "admin added", data: host })
})
export const removAdmin = tryCatchErr<never, { hostId: ObjectId, userId: ObjectId }>(async (req, res) => {
    const hostId = req.params.hostId;
    const userId = req.params.userId;
    const adminId = req["user"]._id;
    const userFind = await new UserDao().findById(userId);
    if (!userFind) return res.status(404).json({ message: "not found user" });
    const host = await hostDao.removAdmin(hostId, userId, adminId);
    if (!host) return res.status(404).json({ message: "not found host", data: { _id: hostId } });
    return res.json({ message: "admin remove", data: host });
})
export const editHost = tryCatchErr<Host, { hostId: ObjectId }>(async (req, res) => {
    const hostId = req.params.hostId;
    const hostName = req.body.name;
    const adminId = req["user"]._id;
    const host = await hostDao.edit(hostId, hostName, adminId)
    if (!host) return res.status(404).json({ message: "not found host", data: { _id: hostId } });
    return res.json({ message: "host edited", data: host });
})