import { Router } from "express";
import { getAll ,getAdmin,deleteAdmin, edit, addAdmin ,loginAdmin} from "../controller/admin.controller";
import { idSchema, loginSchema } from "../joi/user.joi";
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator";
import {  guardOwner } from "../middleware/Guard/guardOwner";
import { adminSchema, adminSchemaUpdate } from "../joi/admin.joi";
import guard from "../middleware/Guard/guard";
import { guardAdmin } from "../middleware/Guard/guardAdmin";
const router = Router()
router.post("/login",joiValidatorBody(loginSchema),loginAdmin)
router.get("/",guard,guardAdmin,getAll)
router.post("/",joiValidatorBody(adminSchema),guard,guardAdmin,guardOwner,addAdmin)
router.route("/:_id").all(joiValidatorParams(idSchema),guard,guardAdmin).get(getAdmin).delete(guardOwner, deleteAdmin).patch(joiValidatorBody(adminSchemaUpdate),guardOwner, edit)

export default router