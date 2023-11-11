import { Socket } from "socket.io"
import { ExtendedError } from "socket.io/dist/namespace"
import { verify } from "jsonwebtoken";
import "dotenv/config";
import userModule from "../../modules/DB/user.module";
import { User } from "../../interfaces/user.interface";
import adminModule from "../../modules/DB/admin.module";
export const guardSocketTechnicalSupport = async (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    try {

        const token = socket.handshake.headers.authorization
        if (!token) { throw "token is required" }

        (socket as any)["user"] = verify(token, process.env.SECRET_KEY!)
        const tokenData = (socket as any)["user"] as User
        const userVIP = await userModule.find({ _id: tokenData._id, isVIP: true })
        if (userVIP) {
            next()
        } else {
            const Admin = await adminModule.find({ _id: tokenData._id })
            if (Admin) {
                next()
            }
        }
    } catch (err) {
        const error = err as ExtendedError
        console.log(error)
        next(error)
    }
}