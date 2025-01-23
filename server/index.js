const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors=require('cors')

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "https://chat-10bd.onrender.com" },
  pingInterval: 25000,
  pingTimeout: 20000,
  maxPayload: 1000000,
});
app.use(cors())
mongoose.connect('mongodb+srv://logu3222007:Logu%402007@cluster0.db3xo.mongodb.net/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB is connected!');
}).catch((err) => {
  console.log('MongoDB error: ' + err);
});

const chatSchema = mongoose.Schema({
  text: String,
}, {
  timestamps: true,
});

const chatModel = mongoose.model('chat', chatSchema);

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);
  socket.emit('welcome', 'Welcome to the server!');

  socket.on('message', async (data) => {
    console.log('Received message: ', data);
    try {
      const msgInsert = await chatModel.create({
        text: data,
      });

      socket.broadcast.emit('broad_cast_msg', {
        text: msgInsert.text,
        timestamp: msgInsert.createdAt, // Optionally include timestamp
      });
    } catch (err) {
      console.log('Error:', err);
      socket.emit('error', { message: 'Error saving message', error: err.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected!');
  });
});
app.get('/',async(req,res)=>{
  try{

    const msgSend=await chatModel.find().sort({createdAt:1})
    res.status(200).json(msgSend)
  }
  catch(err){
res.status(500).json({message:"server error"})
  }

})

server.listen(5000, () => {
  console.log('Server is running on port 5000!');
});
