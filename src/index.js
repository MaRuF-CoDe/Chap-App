const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { getMessage, getLocationMessage } = require('./utils/messages')
const { addUser,removeUser,getUser,getUserInRoom } = require('./utils/users')


const app = express()
server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')));


io.on("connection", (socket)=>{
    console.log('New Websocket connection')

   socket.on('join',({username,room},callback)=>{

    const {error , user } = addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message',getMessage('Welcome!'))
        socket.broadcast.to(user.room).emit('message',getMessage(`${user.username} has joined!`))
    })
    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity not allowed!')
        }

        io.emit('message',getMessage(message))
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',getLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',getMessage(`${user.username} has left!`))
        }
    })
})

server.listen(port,() =>{
    console.log(`Server is up ${port}!`)
})