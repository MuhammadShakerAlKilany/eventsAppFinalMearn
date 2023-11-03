import { Router } from "express"
import { eventCreat } from "../controller/event.controller"
import { joiValidatorBody } from "../middleware/joiValidator"
import { eventSchema } from "../joi/event.joi"
import guard from "../middleware/Guard/guard"
import { guardHost } from "../middleware/Guard/guardHost"
import { upload } from "../middleware/multer/multer"
import tryCatchErr from "../middleware/tryCatchErr"

const router = Router()
router.route("/").all(guard,guardHost).post(tryCatchErr(upload.single("poster")),joiValidatorBody(eventSchema),eventCreat).patch().delete()
export default router