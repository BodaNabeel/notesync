import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("user connected with id: ", socket.id)
    setInterval(() => {
        io.emit("message", "Hello you're now connected");
    }, 2000);
});

httpServer.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
