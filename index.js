const express = require('express');
const app = express();
const cors = require("cors")

const http = require('http');
const { Server} = require('socket.io')
const server = http.createServer(app);

const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const {addMessage,clearMessages,getMessages} = require('./src/utilities')



app.use(cors())


let activeConnectedUser = 0
let identificationUser = 1
let pivotSocket = null

const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
})

const options = {
    definition:{
        openapi:"3.0.3",
        info:{
            title:"DSU Chat",
            version:"1.0.0",
            description:" Socket application"
        },
        servers:[
            {
                url:"http://localhost:3030"
            }
        ]
    },
    apis: ["index.js"]
}
const specs = swaggerJsDoc(options)

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(specs))
//app.use('/socket',messageRouter)

io.on('connection', (socket) => {
    if(!pivotSocket){pivotSocket=socket}
    activeConnectedUser = activeConnectedUser + 1
    socket.data.id = identificationUser
    identificationUser = identificationUser + 1
    console.log('New user connected, total connected:',activeConnectedUser); 
    io.to(socket.id).emit("top_name",{name:`Usuario ${socket.data.id}`})
    socket.on('conectado', (data)=>
    {
        dataObject = {
            userName: `Usuario ${socket.data.id}`,
            message: data.msg || ''
        }
        //messages.push(dataObject) 
        addMessage(dataObject)
       
        socket.broadcast.emit("mensage_recibido",{...data,user:`Usuario ${socket.data.id}`})
    })
    socket.on('disconnect', () => {
        activeConnectedUser = activeConnectedUser - 1
        console.log('User disconnected, total connected',activeConnectedUser);
    });
});






/**
 * @swagger
 * tags:
 *  name: Socket
 *  description: Real Chat app.
 */

/**
 * @swagger
 * paths:
 *  /message:
 *   get:
 *      summary: Muestra el historial de mensajes    
 *      responses:
 *          200:
 *            description: Get all Messages
 *              
 */
 app.get('/message',(req,res)=>{
    const messages = getMessages()
    res.json(messages)
})

/** 
* @swagger
* paths:
*  /message:
*   delete:
*      summary: Elimina el historial de mensajes    
*      responses:
*          200:
*            description: Delete all Messages 
*/
app.delete('/message',(req,res)=>{
    clearMessages()
    const messages = getMessages() 
    if(pivotSocket){
        io.to(pivotSocket.id).emit("mensage_recibido",messages)
        pivotSocket.broadcast.emit("mensage_recibido",messages)
    }
    res.json(messages)
})

server.listen(3030, () => {
    console.log('listening on *:3030');
  });

