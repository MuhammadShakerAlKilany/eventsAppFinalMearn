import { Router } from "express";
import {
  joiValidatorBody,
  joiValidatorParams,
} from "../middleware/joiValidator";
import { placeAdminSchema, placeIdSchema, placeSchema } from "../joi/place.joi";
import {
  addAdmin,
  addPlace,
  deletePlace,
  edit,
  editPlace,
  getAllPlace,
  getPlaceByID,
  getUserPlace,
  placePhoto,
  removAdmin,
} from "../controller/place.controller";
import { upload } from "../middleware/multer/multer";
import tryCatchErr from "../middleware/tryCatchErr";
import { guardAdmin } from "../middleware/Guard/guardAdmin";
import { idSchema } from "../joi/user.joi";
const router = Router();
router.post(
  "/",
  tryCatchErr(upload.single("placPhoto")),
  joiValidatorBody(placeSchema),
  addPlace
);
router.get("/all", getAllPlace);
router.patch(
  "/add_admin/:placeId/:userId",
  joiValidatorParams(placeAdminSchema),
  addAdmin
);
router.patch(
  "/remov_admin/:placeId/:userId",
  joiValidatorParams(placeAdminSchema),
  removAdmin
);
router.get("/all_user_place", getUserPlace);
router.patch("/:placeId", joiValidatorParams(placeIdSchema), editPlace);
router.get("/:placeId", joiValidatorParams(placeIdSchema), getPlaceByID);
router
  .route("/with_admin/:_id")
  .all(joiValidatorParams(idSchema))
  .patch(edit)
  .delete(deletePlace);
export default router;
