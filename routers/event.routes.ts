import { Router } from "express"
import { allEvent, allEventUser, deleteEvent, edit, eventCreat, eventPhoto, findEvent ,findEventForUser,getEventSubscribeWith,subscribe, unsubscribe  } from "../controller/event.controller"
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator"
import { eventEditSchema, eventSchema } from "../joi/event.joi"
import { upload } from "../middleware/multer/multer"
import tryCatchErr from "../middleware/tryCatchErr"
import { guardAdmin } from "../middleware/Guard/guardAdmin"
import { idSchema } from "../joi/user.joi"

const router = Router()
router.route("/").post(tryCatchErr(upload.single("poster")),joiValidatorBody(eventSchema),eventCreat).patch().delete()
router.get("/all",allEvent)
router.get("/all_subscribe",getEventSubscribeWith)
router.get("/all_for_user",allEventUser)
router.get("/photo/:_id",joiValidatorParams(idSchema),eventPhoto)
router.get("/user_data/:_id",joiValidatorParams(idSchema),findEventForUser)
router.post("/edit/:_id",joiValidatorParams(idSchema),joiValidatorBody(eventEditSchema),tryCatchErr(upload.single("poster")),edit)
router.patch("/subscribe/:_id",joiValidatorParams(idSchema),subscribe)
router.patch("/unsubscribe/:_id",joiValidatorParams(idSchema),unsubscribe)
router.route("/:_id").delete(guardAdmin,joiValidatorParams(idSchema),deleteEvent)
router.route("/:_id").get(joiValidatorParams(idSchema),findEvent)
export default router