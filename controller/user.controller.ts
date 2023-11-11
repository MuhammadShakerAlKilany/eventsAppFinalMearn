import jwt from "jsonwebtoken";
import UserDao from "../dao/user.dao";
import { RegisterUser, User, loginUser } from "../interfaces/user.interface";
import tryCatchErr from "../middleware/tryCatchErr";
import "dotenv/config";
import { compare } from "bcrypt";
import sendVerified from "../modules/email/sendVerified";
import { ObjectId } from "mongoose";
import userModule from "../modules/DB/user.module";
import fs from "fs/promises";
import path from "path";
import paypal from "paypal-rest-sdk";
const userDao = new UserDao();
export const register = tryCatchErr<RegisterUser>(async (req, res) => {
  const user = req.body as User;
  user.proPicPath = req.file?.path!;
  const newUser = await userDao.createUser(user);
  const { _id, name, email, phoneNumber } = newUser;
  const token = jwt.sign(
    { _id, name, email, phoneNumber },
    process.env.SECRET_KEY!,
    { expiresIn: "30m" }
  );
  await sendVerified(user.email, token);
  res.status(201).json({ message: "user created" });
});
export const login = tryCatchErr<loginUser>(async (req, res) => {
  const email = req.body.email;
  const user = await userDao.findUserByEmail(email);
  if (user) {
    if (user.isBan)
      return res.status(403).json({ message: "your account is banned" });
    if (!user.isVerify)
      return res.status(403).json({ message: "varify your email" });
    const password = req.body.password;
    const isCompare = await compare(password, user.password);
    // console.log(user.password)
    if (isCompare) {
      const {
        _id,
        name,
        email,
        phoneNumber,
        isBan,
        isVerify,
        location,
        proPicPath,
        subscribeWith,
        userName,
        isVIP
      } = user;
      const userData = {
        _id,
        name,
        email,
        phoneNumber,
        isBan,
        isVerify,
        location,
        proPicPath,
        subscribeWith,
        userName,
        isVIP
      };
      console.log(JSON.stringify(userData));
      const token = jwt.sign(userData, process.env.SECRET_KEY!, {
        expiresIn: "30 days",
      });
      return res
        .status(200)
        .json({ message: "you log in", token, data: userData });
    }
  }
  return res.status(404).json({ message: "email or password is wrong" });
});

export const allUser = tryCatchErr(async (req, res) => {
  const users = await userDao.getAllUser();
  return res.json({ message: "all users", data: users });
});
export const allUserBan = tryCatchErr(async (req, res) => {
  console.log("allUserBan");
  const users = await userDao.getAllUserIsBan();
  return res.json({ message: "all ban users", data: users });
});
export const banUser = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const id = req.params._id;
    const user = await userDao.banUser(id);
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.json({ message: `user ban:${user.isBan}` });
  }
);

// export const adminUser = tryCatchErr<never,{_id:ObjectId}>(async (req,res)=>{
//     const id =  req.params._id
//   const user =  await userDao.adminUser(id)
//   if(!user)return res.status(404).json({message:"user not found"})
//   return res.json({message:`user admin:${user.isAdmin}`})
// })
export const varifyUser = tryCatchErr<never, { token: string }>(
  async (req, res) => {
    const token = req.params.token;
    console.log(token);
    const tokenData = jwt.verify(token, process.env.SECRET_KEY!) as {
      _id: ObjectId;
    };
    const user = await userDao.varifyUser(tokenData._id);
    if (!user) return res.status(404).json({ message: "user not found" });
    return res.json({ message: `user varify` });
  }
);
export const edite = tryCatchErr<User>(async (req, res) => {
  console.log("user admin update");
  const _id = req["user"]?._id;
  const userData = req.body;
  if (req.file?.path) {
    userData.proPicPath = req.file?.path;
  }
  if (!_id) return res.status(404).json({ message: "not found user" });
  const user = await userDao.edit(_id, userData);
  if (!user) return res.status(404).json({ message: "not found user" });
  return res.json({ message: "update user", data: user });
});
export const editeUserWithAdmin = tryCatchErr<User, any>(async (req, res) => {
  const _id = req.params._id!;
  const userData = req.body;
  if (req.file?.path) {
    userData.proPicPath = req.file?.path;
  }
  if (!_id) return res.status(404).json({ message: "not found user" });
  const user = await userDao.edit(_id, userData);
  if (!user) return res.status(404).json({ message: "not found user" });
  return res.json({ message: "update user", data: user });
});
export const deleteUser = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const _id = req.params._id;
    const user = await userDao.delete(_id);
    if (!user) return res.status(404).json({ message: "not found user" });
    return res.json({ message: "delete user", data: user });
  }
);
export const addUser = tryCatchErr<User, any>(async (req, res) => {
  const user = req.body as User;
  user.proPicPath = req.file?.path!;
  user.isVerify = true;
  const newUser = await userDao.createUser(user);
  return res.status(201).json({ message: "user created", data: newUser });
});
export const getUserProPicPath = tryCatchErr<never, { _id: ObjectId }>(
  async (req, res) => {
    const _id = req.params._id;
    const user = await userModule.findById(_id);
    if (!user) return res.status(404).json({ message: "user not found" });
    // const proPicPath = await fs.readFile();
    return res.sendFile(path.join(__dirname, "..", user.proPicPath));
  }
);
export const changPlane = tryCatchErr<never, { _id: ObjectId }>((req, res) => {
  const _id = req.params._id;
  const token = jwt.sign({ _id }, process.env.SECRET_KEY!, {
    expiresIn: "1 days",
  });
  paypal.configure({
    mode: "sandbox", //sandbox or live
    client_id: process.env.PAY_CLIENT_ID!,
    client_secret: process.env.PAY_CLIENT_SECRET!,
  });
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url:
        process.env.URL! + "/api/v1" + "/user/vip_plane_success/" + token,
      cancel_url: process.env.URL! + "/api/v1" + "/user/vip_plane_clos",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "VIP plan",
              sku: "VIP plan",
              price: "10.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "10.00",
        },
        description: "5host \n 5place \nunlimted event.",
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      console.log("Create Payment Response");
      console.log(payment);
      const link = payment.links?.[1]?.href;
      if (!link) return res.json({ message: "fails" });
      return res.json({ message: "link to paypal", data: { link } });
    }
  });
});
export const successPlane = tryCatchErr<
  never,
  { token: string },
  { paymentId: string; PayerID: string }
>(async (req, res) => {
  const token = req.params.token;
  const paymentId = req.query.paymentId;
  const PayerID = req.query.PayerID;
  const tokenData = jwt.verify(token, process.env.SECRET_KEY!) as {
    _id: ObjectId;
  };
  await userDao.edit(tokenData._id, { isVIP: true } as User);

  var execute_payment_json = {
    payer_id: PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "10.00",
        },
      },
    ],
  };

  res.setHeader("Content-type", "text/html");
  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        return res.end("<h1>invalid client</h1>");
      } else {
        console.log("Get Payment Response");
        // console.log(JSON.stringify(payment));
        return  res.status(301).redirect(`${process.env.CLINT_URL}/login`)
    }}
  );
});
export const closPlane = tryCatchErr((req, res) => {
  res.setHeader("Content-type", "text/html");
  return res.end("<h1>falid</h1>");
});
