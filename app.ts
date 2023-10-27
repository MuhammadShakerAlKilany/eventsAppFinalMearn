import express from "express"
import clc from "cli-color"
import { monitorTrans } from "./middleware/monitorTrans"
const app = express()
const port = 3000 
app.use(monitorTrans)
app.get("api/v1",(req,res)=>{
    res.send("API work")
})

app.listen(port,()=>{
    console.log(`server work in port:${port}`)
})