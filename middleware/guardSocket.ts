import { Socket } from "socket.io"
import { ExtendedError } from "socket.io/dist/namespace"

export const guardSocket = (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    try {

        const token = socket.handshake.headers.authorization
        if (!token)throw ("token is required")
        next()
    } catch (err) {
        const error = err as ExtendedError
        console.log(error)
        next(error)
    }
}
