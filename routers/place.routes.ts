import { Router } from "express"
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator"
import { placeAdminSchema, placeIdSchema, placeSchema } from "../joi/place.joi"
import { addAdmin, addPlace, editPlace, removAdmin } from "../controller/place.controller"

const router = Router()
router.post("/",joiValidatorBody(placeSchema),addPlace)
router.patch("/add_admin/:placeId/:userId",joiValidatorParams(placeAdminSchema),addAdmin)
router.patch("/remov_admin/:placeId/:userId",joiValidatorParams(placeAdminSchema),removAdmin)
router.patch("/:placeId",joiValidatorParams(placeIdSchema),editPlace)
export default router