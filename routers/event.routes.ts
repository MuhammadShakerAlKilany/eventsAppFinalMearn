import { Router } from "express";
import {
  allEvent,
  allEventUser,
  deleteEvent,
  deleteWithAdmin,
  edit,
  editWithAdmin,
  eventCreat,
  eventPhoto,
  findEvent,
  findEventForUser,
  getEventSubscribeWith,
  subscribe,
  unsubscribe,
} from "../controller/event.controller";
import {
  joiValidatorBody,
  joiValidatorParams,
} from "../middleware/joiValidator";
import { eventEditSchema, eventSchema } from "../joi/event.joi";
import { upload } from "../middleware/multer/multer";
import tryCatchErr from "../middleware/tryCatchErr";
import { guardAdmin } from "../middleware/Guard/guardAdmin";
import { idSchema } from "../joi/user.joi";

const router = Router();
router
  .route("/")
  .post(
    tryCatchErr(upload.single("poster")),
    joiValidatorBody(eventSchema),
    eventCreat
  )
  .patch()
  .delete();
router.get("/all", allEvent);
router.get("/all_subscribe", getEventSubscribeWith);
router.get("/all_for_user", allEventUser);
router.post(
  "/edit_with_admin/:_id",
  guardAdmin,
  joiValidatorParams(idSchema),
  joiValidatorBody(eventEditSchema),
  tryCatchErr(upload.single("poster")),
  editWithAdmin
);
router.delete(
  "/delete_with_admin/:_id",
  guardAdmin,
  joiValidatorParams(idSchema),
  deleteWithAdmin
);
router.get("/user_data/:_id", joiValidatorParams(idSchema), findEventForUser);
router.post(
  "/edit/:_id",
  joiValidatorParams(idSchema),
  joiValidatorBody(eventEditSchema),
  tryCatchErr(upload.single("poster")),
  edit
);
router.patch("/subscribe/:_id", joiValidatorParams(idSchema), subscribe);
router.patch("/unsubscribe/:_id", joiValidatorParams(idSchema), unsubscribe);
router.route("/:_id").delete(joiValidatorParams(idSchema), deleteEvent);
router.route("/:_id").get(joiValidatorParams(idSchema), findEvent);
router.route("/:_id").delete(joiValidatorParams(idSchema), deleteEvent);
export default router;
