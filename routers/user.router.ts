import { Router } from "express";
import { joiValidatorBody } from "../middleware/joiValidator";
import { loginSchema, registerSchema } from "../joi/user.joi";
import { login, register } from "../controller/user.controller";

 const router = Router()

router.post("register",joiValidatorBody(registerSchema),register)
router.post("login",joiValidatorBody(loginSchema),login)

export default router