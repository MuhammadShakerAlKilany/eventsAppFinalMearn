import { Router } from "express";
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator";
import { idSchema, loginSchema, registerSchema, tokenSchema, userUpdateSchema, userUpdateWithAdminSchema } from "../joi/user.joi";
import { login, register ,banUser ,varifyUser ,allUser,allUserBan, edite, editeUserWithAdmin, deleteUser, addUser, getUserProPicPath, changPlane, successPlane, closPlane, userSelfData, userData} from "../controller/user.controller";
import { guardAdmin } from "../middleware/Guard/guardAdmin";
import { upload } from "../middleware/multer/multer";
import tryCatchErr from "../middleware/tryCatchErr";
import guard from "../middleware/Guard/guard";

 const router = Router()

router.post("/register",tryCatchErr(upload.single("proPic")),joiValidatorBody(registerSchema),register)
router.post("/login",joiValidatorBody(loginSchema),login)
// router.patch("/admin_user/:_id",guard,guardAdmin,joiValidatorParams(idSchema),adminUser)
router.get("/all",guard,guardAdmin,allUser)
router.get("/all_ban",guard,guardAdmin,allUserBan)
router.post("/add_user",guard,guardAdmin,tryCatchErr(upload.single("proPic")),joiValidatorBody(registerSchema),addUser)
router.get("/ProPicPath/:_id",joiValidatorParams(idSchema),getUserProPicPath)
router.get("/verifie/:token",joiValidatorParams(tokenSchema),varifyUser)
router.patch("/ban/:_id",guard,guardAdmin,joiValidatorParams(idSchema),banUser)
router.route("/").all(guard).patch(upload.single("proPic"),joiValidatorBody(userUpdateSchema),edite).get(userSelfData)
router.get("/vip_plane/:_id",joiValidatorParams(idSchema),guard,changPlane)
router.get("/vip_plane_success/:token",joiValidatorParams(tokenSchema),successPlane)
router.get("/vip_plane_clos",joiValidatorParams(tokenSchema),closPlane)
router.route("/:_id").all(joiValidatorParams(idSchema),guard,guardAdmin).patch(tryCatchErr(upload.single("proPic")),joiValidatorBody(userUpdateWithAdminSchema),editeUserWithAdmin).delete(deleteUser).get(userData)
export default router