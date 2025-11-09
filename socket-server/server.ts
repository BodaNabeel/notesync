import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("user connected with id: ", socket.id)
    setInterval(() => {
        io.emit("message", "Hello you're now connected");
    }, 2000);

    socket.on("msg_update", (msg) => {
        console.log("Message: ", msg)
        io.emit("new_msg", msg)
    })
    socket.on("disconnect", () => {
        console.log("user with id: ", socket.id, " had disconnected")
    })
});


httpServer.listen(4000, () => {
    console.log("Server running on http://localhost:4000");
});
