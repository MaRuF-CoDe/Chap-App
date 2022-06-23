const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { getMessage, getLocationMessage } = require('./utils/messages')


const app = express()
server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, '../public')));


io.on("connection", (socket)=>{
    console.log('New Websocket connection')

    socket.emit('message',getMessage('Welcome!'))

    socket.broadcast.emit('message',getMessage('A new user has joined!'))

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
        io.emit('message',getMessage('A user has left!'))
    })
})

server.listen(port,() =>{
    console.log(`Server is up ${port}!`)
})