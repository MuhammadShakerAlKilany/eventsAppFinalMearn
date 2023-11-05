import { Router } from "express"
import { allEvent, allEventUser, edit, eventCreat, findEvent ,findEventForUser,subscribe, unsubscribe  } from "../controller/event.controller"
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator"
import { eventEditSchema, eventSchema } from "../joi/event.joi"
import { upload } from "../middleware/multer/multer"
import tryCatchErr from "../middleware/tryCatchErr"
import { guardAdmin } from "../middleware/Guard/guardAdmin"
import { idSchema } from "../joi/user.joi"

const router = Router()
router.route("/").post(tryCatchErr(upload.single("poster")),joiValidatorBody(eventSchema),eventCreat).patch().delete()
router.get("/all",guardAdmin,allEvent)
router.get("/all_for_user",allEventUser)
router.get("/:_id",guardAdmin,joiValidatorParams(idSchema),findEvent)
router.get("/user_data/:_id",joiValidatorParams(idSchema),findEventForUser)
router.post("/edit/:_id",joiValidatorParams(idSchema),joiValidatorBody(eventEditSchema),tryCatchErr(upload.single("poster")),edit)
router.patch("/subscribe/:_id",joiValidatorParams(idSchema),subscribe)
router.patch("/unsubscribe/:_id",joiValidatorParams(idSchema),unsubscribe)
export default router