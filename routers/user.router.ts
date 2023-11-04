import { Router } from "express";
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator";
import { idSchema, loginSchema, registerSchema, tokenSchema } from "../joi/user.joi";
import { login, register ,banUser ,varifyUser ,allUser,allUserBan} from "../controller/user.controller";
import { guardAdmin } from "../middleware/Guard/guardAdmin";
import { upload } from "../middleware/multer/multer";
import tryCatchErr from "../middleware/tryCatchErr";
import guard from "../middleware/Guard/guard";

 const router = Router()

router.post("/register",tryCatchErr(upload.single("proPic")),joiValidatorBody(registerSchema),register)
router.post("/login",joiValidatorBody(loginSchema),login)
router.get("/verifie/:token",joiValidatorParams(tokenSchema),varifyUser)
router.patch("/ban/:_id",guard,guardAdmin,joiValidatorParams(idSchema),banUser)
// router.patch("/admin_user/:_id",guard,guardAdmin,joiValidatorParams(idSchema),adminUser)
router.get("/all",guard,guardAdmin,allUser)
router.get("/all_ban",guard,guardAdmin,allUserBan)


export default router