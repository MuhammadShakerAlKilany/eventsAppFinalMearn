import { Router } from "express";
import userRouter from "./user.router"
import eventRouter from "./event.router"
import guard from "../middleware/Guard/guard";
import adminRouter from "./admin.router"
import { guardAdmin } from "../middleware/Guard/guardAdmin";
 const router = Router()
 router.get("/", (req, res) => {
    res.send("API work")
})

router.use("/user",userRouter)
router.use("/event",eventRouter)
router.use("/admin",adminRouter)

export default router


