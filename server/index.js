const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')
const socketio = io(server, { cors: { origin: "https://chat-10bd.onrender.com/" } })
const mongoose=require('mongoose')
const { text } = require('stream/consumers')
const { timeStamp } = require('console')  
//db connection
mongoose.connect('mongodb+srv://logu3222007:Logu%402007@cluster0.db3xo.mongodb.net/chat').then(()=>{
  console.log('mongodb is connected!')
})
.catch((err)=>{
  console.log('mongodb error : '+err)
})
//mongose model
const chatSchema=mongoose.Schema({
  text:String,
  
},
{
  timeStamp:true
})
const chatModel=mongoose.model('chat',chatSchema)
socketio.on('connection', (socket) => {
  console.log('user is connected! ', socket.id)
  socket.emit('welcome', 'welcome to server')
  socket.on('message',async(data)=>{
    console.log('receviced message : ',data)
    try{
      const msgInsert= await chatModel.create({
        text:data
      })
    socket.broadcast.emit('broad_cast_msg',msgInsert)

      
    }
    catch(err){
      console.log('error',err)
    }
  })
  socket.on('disconnect', () => {
    console.log('user disconnected!')
  })
})


server.listen(5000, () => {
  console.log('server is connected!')
})