import { Router } from "express"
import { allEvent, allEventUser, eventCreat, findEvent ,subscribe, unsubscribe  } from "../controller/event.controller"
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator"
import { eventSchema } from "../joi/event.joi"
import { upload } from "../middleware/multer/multer"
import tryCatchErr from "../middleware/tryCatchErr"
import { guardAdmin } from "../middleware/Guard/guardAdmin"
import { idSchema } from "../joi/user.joi"

const router = Router()
router.route("/").post(tryCatchErr(upload.single("poster")),joiValidatorBody(eventSchema),eventCreat).patch().delete()
router.get("/all",guardAdmin,allEvent)
router.get("/all_for_user",allEventUser)
router.get("/:_id",joiValidatorParams(idSchema),findEvent)
router.patch("/subscribe/:_id",joiValidatorParams(idSchema),subscribe)
router.patch("/unsubscribe/:_id",joiValidatorParams(idSchema),unsubscribe)
export default router