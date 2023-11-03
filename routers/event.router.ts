import { Router } from "express"
import { eventCreat , eventEmitter } from "../controller/event.controller"
import { joiValidatorBody } from "../middleware/joiValidator"
import { eventSchema } from "../joi/event.joi"
import guard from "../middleware/Guard/guard"
import { upload } from "../middleware/multer/multer"
import tryCatchErr from "../middleware/tryCatchErr"
import { guardAdmin } from "../middleware/Guard/guardAdmin"

const router = Router()
router.route("/").all(guard).post(tryCatchErr(upload.single("poster")),joiValidatorBody(eventSchema),eventCreat).patch().delete()
router.get("/all_ban",guard,guardAdmin,)
export default router