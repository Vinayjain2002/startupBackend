import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyparser from 'body-parser'
import cors from 'cors'
import connectDB from './mongoDB/connection.js'
import * as Server from 'socket.io'
import { graphqlHTTP } from 'express-graphql'
import Schema from './schemas/Schema.js'

dotenv.config();
const app= express();
const corsConfig= {
    origin: process.env.BASE_URL,
    credentials: true
}

const PORT= process.env.PORT || 8000

app.use(bodyparser.json())
app.use(cors(corsConfig))
mongoose.set('strictQuery',false)

connectDB();
const server= app.listen(PORT,()=>{
    console.log(`Server is listening on the PORT- ${PORT}`);
})

app.use("/graphql", graphqlHTTP({
    Schema,
    graphiql: true
}))

app.get('/', (req,res)=>{
    res.send("Auth System");
})
// creating the socket.io Server
const io= new Server.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket)=>{
    socket.on('setup',(userData)=>{
        socket.join(userData.id);
        socket.emit('connected');
    })

    socket.on('join room', (room)=>{
        socket.join(room);
    })

    socket.on('new message', (newMessageRecieve)=>{
        var chat= newMessageRecieve.chatId;
        if(!chat.users){
            console.log('chats.users is not defined');
        }
        chat.users.forEach((user)=>{
            if(user.id== newMessageRecieve.sender._id){
                return
            }
            socket.in(user._id).emit('message Recieved', newMessageRecieve);
        });
    });
});