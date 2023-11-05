import { Router } from "express";
import userRouter from "./user.routes"
import eventRouter from "./event.routes"
import adminRouter from "./admin.routes"
import hostRouter from "./host.routes"
import placeRouter from "./place.routes"
import guard from "../middleware/Guard/guard";
 const router = Router()
 router.get("/", (req, res) => {
    res.send("API work")
})

router.use("/user",userRouter)
router.use("/event",guard,eventRouter)
router.use("/admin",adminRouter)
router.use("/host",guard,hostRouter)
router.use("/place",guard,placeRouter)
export default router


