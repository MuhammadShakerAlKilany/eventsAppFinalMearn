import { Router } from "express"
import { allEvent, eventCreat, findEvent ,subscribe  } from "../controller/event.controller"
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator"
import { eventSchema, subscribeSchema } from "../joi/event.joi"
import guard from "../middleware/Guard/guard"
import { upload } from "../middleware/multer/multer"
import tryCatchErr from "../middleware/tryCatchErr"
import { guardAdmin } from "../middleware/Guard/guardAdmin"
import { idSchema } from "../joi/user.joi"

const router = Router()
router.route("/").all(guard).post(tryCatchErr(upload.single("poster")),joiValidatorBody(eventSchema),eventCreat).patch().delete()
router.get("/all",guard,allEvent)
router.get("/:_id",guard,joiValidatorParams(idSchema),findEvent)
router.get("/subscribe/:_id",joiValidatorParams(idSchema),subscribe)
export default router