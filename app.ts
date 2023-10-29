import express from "express"
import mongoose from "mongoose"
import { monitorTrans } from "./middleware/monitorTrans"
import errorHandler from "./middleware/errorHandler"
import helmet from "helmet";
import "dotenv/config"
mongoose.connect(process.env.DB_URL!).then(() => {
    console.log("connected with DB")
    const app = express()
    const port = 3000
    app.use(helmet());
    app.use(monitorTrans)
    app.get("/api/v1", (req, res) => {
        res.send("API work")
    })
    app.use(errorHandler)

    app.listen(port, () => {
        console.log(`server work in port:${port}`)
    })
}).catch((err) => {
    console.log(err)
})
