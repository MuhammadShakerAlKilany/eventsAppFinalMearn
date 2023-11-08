import { Router } from "express"
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator"
import { placeAdminSchema, placeIdSchema, placeSchema } from "../joi/place.joi"
import { addAdmin, addPlace, editPlace, getPlaceByID, getUserPlace, removAdmin } from "../controller/place.controller"
import { upload } from "../middleware/multer/multer"
import tryCatchErr from "../middleware/tryCatchErr"
const router = Router()
router.post("/",joiValidatorBody(placeSchema),addPlace)
router.patch("/add_admin/:placeId/:userId",joiValidatorParams(placeAdminSchema),addAdmin)
router.patch("/remov_admin/:placeId/:userId",joiValidatorParams(placeAdminSchema),removAdmin)
router.get("/all_user_place",getUserPlace)
router.patch("/:placeId",joiValidatorParams(placeIdSchema),editPlace)
router.get("/:placeId",joiValidatorParams(placeIdSchema),getPlaceByID)
export default router