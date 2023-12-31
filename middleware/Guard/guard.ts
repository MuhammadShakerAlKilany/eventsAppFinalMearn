import { Request, RequestHandler } from "express";
import tryCatchErr from "../tryCatchErr";

import jwt from "jsonwebtoken";
import "dotenv/config";
const guard = tryCatchErr<any>(async (req, res, next) => {
  // let token = req.cookies?.token;
  // if (!token) {
    // req.cookies.token = req.headers.authorization
   const token = req.headers.authorization
  // }
  if (!token) {
    return res.status(401).json({message:"token is required"})
  }
  try {
    const tokenData = jwt.verify(token, process.env.SECRET_KEY!) as Object
    if (!tokenData) return res.status(401).json({ message: "you are logOut" });
    req["user"] = {...tokenData}
  } catch (error) {
    console.log(error)
    res
      .clearCookie("token")
      .status(401)
      .json({ message: "err in jwt verify you are logOut" });
    return;
  }
  next();
});

export default guard;
