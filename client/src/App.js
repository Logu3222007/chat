import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // State to keep track of all messages
  const [socketio, setSocketio] = useState(null);
  console.log('msg',messages)

  useEffect(() => {
    const socket = io('https://chat-service-48er.onrender.com');
    setSocketio(socket);

    // Listen for messages from the server
    socket.on('welcome', (data) => {
      console.log(data);
    });

    // Listen for broadcast messages from the server
    socket.on('broad_cast_msg', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.text, sender: 'server' },
      ]);
    });

    return () => {
      socket.off('broad_cast_msg'); // Cleanup on component unmount
      socket.disconnect();
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    if (socketio && message.trim() !== '') {
      // Emit the message to the server
      socketio.emit('message', message);

      // Update the local state to display the message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: 'client' },
      ]);

      // Clear the input field
      setMessage('');
    }
  };

  useEffect(() => {
    // Get the message box DOM element after a new message is added
    const messageBox = document.querySelector('#message-box');
    if (messageBox) {
      // Scroll to the bottom of the message box
      messageBox.scrollTop = messageBox.scrollHeight;
    }
  }, [messages]); // Run this effect when messages change

  return (
    <div>
      {/* Message Box */}
      <div
        id="message-box"
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)', // Center horizontally
          padding: '10px',
          width: '400px',
          maxWidth: '90%', // Ensure the box doesn't exceed 90% of the screen width
          maxHeight: '50vh', // Limit the height of the message box to 50% of the viewport height
          overflowY: 'auto',
        }}
      >
        {messages.map((msg, index) => (
          <p
            key={index}
            style={{
              position: 'relative',
              left: msg.sender === 'client' ? '1%' : null,
              right: msg.sender === 'client' ? '1%' : null,
              marginTop: '10px', // Add some spacing between messages
              textAlign: msg.sender === 'client' ? 'right' : 'left', // Align based on sender
            }}
          >
            <span
              style={{
                padding: '10px',
                backgroundColor: msg.sender === 'client' ? 'green' : 'gray', // Green for client, gray for server
                color: 'white',
                borderRadius: '5px',
                display: 'inline-block',
                maxWidth: '225px', // Max width for larger screens
                wordWrap: 'break-word', // Allows text to wrap to the next line
              }}
            >
              {msg.text}
            </span>
          </p>
        ))}
      </div>

      {/* Form */}
      <div className="d-flex justify-content-center">
        <form
          onSubmit={submitHandler}
          style={{
            position: 'fixed',
            bottom: '10%',
            display: 'flex',
            width: '80%',
            maxWidth: '600px', // Limit max width for larger screens
            margin: '0 auto', // Centers the form horizontally
            padding: '0 10px',
          }}
        >
          <input
            type="text"
            placeholder="Type a message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            style={{
              flexGrow: 1, // Make input flexible to fill available space
              height: '45px',
              paddingLeft: '20px',
              fontSize: '16px',
              borderRadius: '5px',
            }}
          />
          <input
            type="submit"
            className="btn btn-success"
            style={{ marginLeft: '10px' }}
            value="Send"
          />
        </form>
      </div>
    </div>
  );
};

export default App;
