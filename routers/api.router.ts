import { Router } from "express";
import userRouter from "./user.router"
 const router = Router()
 router.get("/", (req, res) => {
    res.send("API work")
})

router.use("/user",userRouter)

export default router


