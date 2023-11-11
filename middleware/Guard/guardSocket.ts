import { Socket } from "socket.io"
import { ExtendedError } from "socket.io/dist/namespace"
import {verify} from "jsonwebtoken";
import "dotenv/config";
export const guardSocket = (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    try {

        const token = socket.handshake.headers.authorization
        if (!token){ throw "token is required"}

        (socket as any)["user"]= verify(token,process.env.SECRET_KEY!)
        next()
    } catch (err) {
        const error = err as ExtendedError
        console.log(error)
        next(error)
    }
}
