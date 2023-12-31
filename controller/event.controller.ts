import { ObjectId, Schema } from "mongoose";
import EventDao from "../dao/event.dao";
import { EventApp, EventCreat } from "../interfaces/event.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import { EventEmitter } from "events";
import { scheduleJob } from "node-schedule";
import UserDao from "../dao/user.dao";
import HostDao from "../dao/host.dao";
import PlaceDao from "../dao/place.dao";
import { Response } from "express-serve-static-core";
import { date } from "joi";
import path from "path";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import { stor } from "../modules/firebasestorage";
import AdminDao from "../dao/admin.dao";
import eventModule from "../modules/DB/event.module";
export const newEventNoti = new EventEmitter();
const eventDao = new EventDao();
const userDao = new UserDao();
const hostDao = new HostDao();
const placeDao = new PlaceDao();

export const eventCreat = tryCatchErr<EventCreat>(async (req, res) => {
  const event = req.body;
  const userId = req["user"]._id;
  const userFind = await userDao.findById(userId);
  if (!userFind) return res.status(404).json({ message: "you logout" });
  const host = await hostDao.findHost(event?.host);
  if (!host) return res.status(404).json({ message: "not found host" });
  const eventNum = await eventModule.find({host:event?.host}).count()
  if (eventNum >= 3 && !userFind.isVIP)
    return res
      .status(400)
      .json({ message: "chang your plan to add more event" });
  
  if (event.place) {
    const place = await placeDao.findById(event?.place);
    if (!place) return res.status(404).json({ message: "not found place" });
  }
  if (req.file) {
    const filename = "" + req.file.size + req.file.originalname + new Date();
    const storRef = ref(stor, filename);
    const snapSot = await uploadBytesResumable(storRef, req.file.buffer, {
      contentType: req.file.mimetype,
    });
    const dowURL = await getDownloadURL(snapSot.ref);
    event.posterPath = dowURL;
  }
  event.createdBy = userId;
  const newEvent = await eventDao.createEvent(event);
  newEventNoti.emit("new_event", newEvent,userId);
  // const date = new Date(newEvent.dateTime)
  // date.setHours(date.getHours() - 1)
  // scheduleJob(date, async () => {
  //     const event = await eventDao.findEvent(newEvent._id)
  //     if (event) {
  //         event.subscribers.forEach((userId) => {
  //             eventEmitter.emit(`event-${userId}`, event.title)
  //         })
  //     }
  // })
  res.status(201).json({ message: "event created", data: newEvent });
});
export const allEvent = tryCatchErr(async (req, res) => {
  const events = await eventDao.getAllEvent();
  return res.json({ message: "all events", data: events });
});
export const allEventUser = tryCatchErr(async (req, res) => {
  const events = await eventDao.getAllEvent();
  return res.json({ message: "all events", data: events });
});
export const findEvent = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const _id = req.params._id;
    const event = await eventDao.findEventWithUser(_id);
    if (!event) return res.json({ message: "not find events", data: { _id } });
    return res.json({ message: "find events", data: event });
  }
);
export const findEventForUser = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const _id = req.params._id;
    const userId = req["user"]._id;
    if (!(await isAdmin(_id, userId, res))) return;
    const event = await eventDao.findEventWithUser(_id);
    if (!event) return res.json({ message: "not find event", data: { _id } });
    return res.json({ message: "find event", data: event });
  }
);
export const subscribe = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const eventId = req.params._id;
    console.log(eventId);
    const userId = req["user"]._id;
    const user = await userDao.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "not found user", data: { userId } });
    const event = await eventDao.eventSubscribe(eventId, userId);
    if (!event)
      return res
        .status(404)
        .json({ message: "not found event", data: { eventId } });
    return res.json({ message: "subscribe success" });
  }
);
export const unsubscribe = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const eventId = req.params._id;
    const userId = req["user"]._id;
    const user = await userDao.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ message: "not found user", data: { userId } });
    const event = await eventDao.eventUnSubscribe(eventId, userId);
    if (!event)
      return res
        .status(404)
        .json({ message: "not found event", data: { eventId } });
    return res.json({ message: "unSubscribe success" });
  }
);
export const userEventAmin = tryCatchErr(async (req, res) => {
  const userId = req["user"]._id;
  const events = await eventDao.userEventAmin(userId);
  return res.json({ message: "all events", data: events });
});
export const edit = tryCatchErr<EventApp, { _id: ObjectId }>(
  async (req, res) => {
    const userId = req["user"]._id;
    const eventId = req.params._id;
    if (!(await isAdmin(eventId, userId, res))) return;
    const eventData = req.body;
    if (req.file) {
      const filename = "" + req.file.size + req.file.originalname + new Date();
      const storRef = ref(stor, filename);
      const snapSot = await uploadBytesResumable(storRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });
      const dowURL = await getDownloadURL(snapSot.ref);
      eventData.posterPath = dowURL;
    }
    const event = await eventDao.edit(eventId, eventData);
    return res.json({ message: "even edit", data: event });
  }
);
export const getEventSubscribeWith = tryCatchErr(async (req, res) => {
  const userId = req["user"]._id;
  const events = await eventDao.getEventSubscribeWith(userId);
  return res.json({ message: "event subscribe with", data: events });
});
export const deleteEvent = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const _id = req.params._id;
    const userId = req["user"]._id;
    const event = await eventDao.findEvent(_id);
    if (!event) return res.status(404).json({ message: "not found event" });
    const admin = await new AdminDao().getAdmin(userId);
    if (!(admin || event.createdBy.toString() === userId))
      return res.status(403).json({ message: "You can not delete this event" });
    await eventDao.delete(_id);
    return res.status(200).json({ message: "delete event", data: event });
  }
);
export const eventPhoto = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const _id = req.params._id;
    const event = await eventDao.findEvent(_id);
    if (!event) return res.status(404).json({ message: "not found event" });
    return res.sendFile(path.join(__dirname, "..", event.posterPath));
  }
);

async function isAdmin(eventId: ObjectId, userId: ObjectId, res: Response) {
  const eventFind = await eventDao.findEvent(eventId);
  if (!eventFind) {
    res.status(404).json({ message: "not found event" });
    return false;
  }
  const isAdmin = (await hostDao.findHost(eventFind.host))?.admins.includes(
    userId
  );

  if (!isAdmin) {
    res.status(403).json({ message: "you not admin for event" });
    return false;
  }
  return true;
}
export const editWithAdmin = tryCatchErr<EventApp, { _id: ObjectId }>(
  async (req, res) => {
    const eventId = req.params._id;
    const eventData = req.body;
    if (req.file) {
      const filename = "" + req.file.size + req.file.originalname + new Date();
      const storRef = ref(stor, filename);
      const snapSot = await uploadBytesResumable(storRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });
      const dowURL = await getDownloadURL(snapSot.ref);
      eventData.posterPath = dowURL;
    }
    const event = await eventDao.edit(eventId, eventData);
    return res.json({ message: "event edited", data: event });
  }
);

export const deleteWithAdmin = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const _id = req.params._id;
    const event = await eventDao.delete(_id);
    if (!event) return res.status(404).json({ message: "not found event" });
    return res.json({ message: "delete event", data: event });
  }
);
