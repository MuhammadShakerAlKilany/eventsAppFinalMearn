import express from "express"
import mongoose from "mongoose"
import { monitorTrans } from "./middleware/monitorTrans"
import errorHandler from "./middleware/errorHandler"
import helmet from "helmet";
import "dotenv/config"
import apiRouter from "./routers/api.router"
import { Server } from 'socket.io';
import {  connection } from "./socket/connection";
import {guardSocket } from "./middleware/guardSocket";
mongoose.connect(process.env.DB_URL!).then(() => {
    console.log("connected with DB")
    const app = express()
    const port = process.env.PORT || 3000
    app.use(helmet());
    app.use(monitorTrans)
    app.use(express.json())
    app.use("/api/v1", apiRouter)
    app.use("/socet", () => {

    })
    app.use(errorHandler)

    app.all("*", (req, res) => {
        res.json({ message: "Not found" })
    })
    const server = app.listen(port, () => {
        console.log(`server work in port:${port}`)
    })
    //socket.io
    const io = new Server(server)
    io.engine.use(helmet());
    io.use(guardSocket)
    io.on("connection", connection);

}).catch((err) => {
    console.log(err)
})

