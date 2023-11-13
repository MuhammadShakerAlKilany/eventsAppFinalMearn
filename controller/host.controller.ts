import { ObjectId, Types } from "mongoose";
import HostDao from "../dao/host.dao";
import UserDao from "../dao/user.dao";
import { Host } from "../interfaces/host.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import hostModule from "../modules/DB/host.module";
import eventModule from "../modules/DB/event.module";
import userModule from "../modules/DB/user.module";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const hostDao = new HostDao();
export const addHost = tryCatchErr<Host>(async (req, res) => {
  const userId = req["user"]._id;
  const userFind = await new UserDao().findById(userId);
  if (!userFind) return res.status(404).json({ message: "you logout" });
  const host = req.body;
  host.admins = [userId];
  const hostNum = await hostModule.find({ admins: userId }).count();
  if (hostNum > 0 && !userFind.isVIP)
    return res.json({ message: "chang your plan to add more host" });
  if (hostNum >= 5 && userFind.isVIP)
    return res.json({ message: "you cant add more then 5 host" });
  const hostCreated = await hostDao.createHost({ ...host, createdBy: userId });
  return res.status(201).json({ message: "host created", data: hostCreated });
});
export const getSpecificHost = tryCatchErr<never>(async (req, res) => {
  const { hostId } = req.params;
  console.log(hostId);

  const [spicificHost] = await hostModule.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(hostId),
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "host",
        as: "events",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "admins",
        foreignField: "_id",
        as: "admins",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: "$owner",
    },
  ]);

  console.log("data from aggregation", spicificHost);
  res.status(200).json({ message: "sucsess", data: spicificHost });
});

export const addAdmin = tryCatchErr<
  {email:string},
  { hostId: ObjectId; userId: ObjectId }
>(async (req, res) => {
  const hostId = req.params.hostId;
  const userId = req.params.userId;
  const adminId = req["user"]._id;
  const userFind = await new UserDao().findById(userId);
  if (!userFind) return res.status(404).json({ message: "not found user" });
  if (userFind.isBan) return res.status(404).json({ message: "user is Ban" });
  const hostNum = await hostModule.find({ admins: userId }).count();
  if (hostNum > 0 && !userFind.isVIP)
    return res.json({ message: "chang user plan to add more host" });
  if (hostNum >= 5 && userFind.isVIP)
    return res.json({ message: "user cant add more then 5 host" });
  const host = await hostDao.addAdmin(hostId, userId, adminId);
  if (!host)
    return res
      .status(404)
      .json({ message: "not found host", data: { _id: hostId } });
  return res.json({ message: "admin added", data: host });
});
export const removAdmin = tryCatchErr<
  never,
  { hostId: ObjectId; userId: ObjectId }
>(async (req, res) => {
  const hostId = req.params.hostId;
  const userId = req.params.userId;
  const adminId = req["user"]._id;
  const userFind = await new UserDao().findById(userId);
  if (!userFind) return res.status(404).json({ message: "not found user" });
  const host = await hostDao.removAdmin(hostId, userId, adminId);
  if (!host)
    return res
      .status(404)
      .json({ message: "not found host", data: { _id: hostId } });
  return res.json({ message: "admin remove", data: host });
});
export const editHost = tryCatchErr<Host, { hostId: ObjectId }>(
  async (req, res) => {
    const hostId = req.params.hostId;
    const hostName = req.body.name;
    const adminId = req["user"]._id;
    const host = await hostDao.edit(hostId, hostName, adminId);
    if (!host)
      return res
        .status(404)
        .json({ message: "not found host", data: { _id: hostId } });
    return res.json({ message: "host edited", data: host });
  }
);
export const getUserHost = tryCatchErr(async (req, res) => {
  const adminId = req["user"]._id;
  const hosts = await hostModule.find({ admins: adminId });
  return res.json({ message: "hosts", data: hosts });
});
export const getAll = tryCatchErr(async (req, res) => {
 const hosts = await hostModule.find()
 res.json({message:"hosts",data:hosts})
});
export const deleteHost = tryCatchErr<never,{_id:ObjectId}>(async (req, res) => {
 const _id = req.params._id
  const host = await hostModule.findByIdAndDelete(_id)
  if (!host) return res.status(404).json({ message: "not found host" });
  const allEventDelete =  await eventModule.find({host:host.id})
 await eventModule.deleteMany({host:host.id})
 allEventDelete.forEach(async (event)=>{

   await userModule.updateMany({},{$pull:{subscribeWith:event._id}})
 })
 res.json({message:"host deleted",data:host})
});
export const edit = tryCatchErr<Host,{_id:ObjectId}>(async (req, res) => {
 const hostData =  req.body
 const _id =  req.params._id
 const host = await hostModule.findByIdAndUpdate(_id,hostData,{new:true});
 if (!host) return res.status(404).json({ message: "not found host" });
 res.json({message:"hosts",data:host})
});