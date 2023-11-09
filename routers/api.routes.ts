import { Router } from "express";
import userRouter from "./user.routes"
import eventRouter from "./event.routes"
import adminRouter from "./admin.routes"
import hostRouter from "./host.routes"
import placeRouter from "./place.routes"
import guard from "../middleware/Guard/guard";
import { joiValidatorParams } from "../middleware/joiValidator";
import { idSchema } from "../joi/user.joi";
import { eventPhoto } from "../controller/event.controller";
import { placeIdSchema } from "../joi/place.joi";
import { placePhoto } from "../controller/place.controller";
 const router = Router()
 router.get("/", (req, res) => {
    res.send("API work")
})

router.use("/user", userRouter)
router.get("/event/photo/:_id",joiValidatorParams(idSchema),eventPhoto)
router.get("/place/photo/:placeId",joiValidatorParams(placeIdSchema),placePhoto)
router.use("/event",guard,eventRouter)
router.use("/admin",adminRouter)
router.use("/host",guard,hostRouter)
router.use("/place", guard, placeRouter)

export default router


