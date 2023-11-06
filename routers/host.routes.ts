import {Router} from "express";
import { addAdmin, addHost, removAdmin } from "../controller/host.controller";
import { joiValidatorBody, joiValidatorParams } from "../middleware/joiValidator";
import { hostAdminSchema, hostSchema } from "../joi/host.joi";
const router = Router()
router.post("/",joiValidatorBody(hostSchema),addHost)
router.patch("/add_admin/:hostId/:userId",joiValidatorParams(hostAdminSchema),addAdmin)
router.patch("/remov_admin/:hostId/:userId",joiValidatorParams(hostAdminSchema),removAdmin)
export default router