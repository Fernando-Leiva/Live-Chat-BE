const express = require('express');
const app = express();
const http = require('http');
const { Server} = require('socket.io')
const cors = require("cors")

app.use(cors())
let userConecteCount = 0

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})


io.on('connection', (socket) => {
    userConecteCount = userConecteCount + 1
    socket.data.id = userConecteCount
    console.log('a user connected',socket.id); 
    socket.on('conectado', (data)=>{
       /*  console.log('Usuario conectado',data)
        console.log("Mensaje del cliente", data.msg) */
        console.log(socket.data.id)
        socket.broadcast.emit("mensage_recibido",{...data,user:`Usuario ${socket.data.id}`})
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});



server.listen(3030, () => {
  console.log('listening on *:3030');
});