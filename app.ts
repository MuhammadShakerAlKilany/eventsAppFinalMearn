import express from "express"
import mongoose from "mongoose"
import { monitorTrans } from "./middleware/monitorTrans"
import errorHandler from "./middleware/errorHandler"
import helmet from "helmet";
import "dotenv/config"
import apiRouter from "./routers/api.routes"
import { Server } from 'socket.io';
import { connection } from "./socket/connection";
import { guardSocket } from "./middleware/Guard/guardSocket";
import cors from "cors"
import { technicalSupportRoom } from "./socket/technicalSupportRoom";
import { guardSocketTechnicalSupport } from "./middleware/Guard/guardSocketTechnicalSupport";
mongoose.connect(process.env.DB_URL!).then(() => {
    console.log("connected with DB")
    const app = express()
    const port = process.env.PORT || 3000
    app.use(cors())
    // app.use(helmet());
    app.use(monitorTrans)
    app.use(express.json())
    app.use("/api/v1", apiRouter)
    app.use(errorHandler)
    app.all("*", (req, res) => {
        res.status(404).json({ message: "Not found" })
    })
    const server = app.listen(port, () => {
        console.log(`server work in port:${port}`)
    })
    //socket.io
    const io = new Server(server,{
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
          }
    })
    // io.engine.use(helmet());
    io.use(guardSocket)
    io.on("connection", connection);
    io.of("/technical_support").use(guardSocketTechnicalSupport)
    io.of("/technical_support").on("connection",technicalSupportRoom)

}).catch((err) => {
    console.log("connected db error",err)
})

