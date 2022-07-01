const http = require("http");
const express = require("express");
const path = require("path");
const { Server: SocketIO } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new SocketIO(server, { cors: true });

app.use(express.static('./public'));

io.on("connection", function(socket){
    socket.on("sender-join", function(data){
        socket.join(data.uid);
    });

    socket.on("receiver-join", function(data){
        socket.join(data.uid);
        socket.in(data.sender_uid).emit("init", data.uid);
    });

    socket.on("file-meta", function(data){
        socket.in(data.uid).emit("fs-meta", data.metadata);
    });

    socket.on("fs-start", function(data){
        socket.in(data.uid).emit("fs-share", {});
    })

    socket.on("file-raw", function(data){
        socket.in(data.uid).emit("fs-share", data.buffer);
    })
});


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server started at PORT:${PORT}`));