import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]); // State to keep track of all messages
  const [socketio, setSocketio] = useState(null);
  const [box,setbox] = useState(false)
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
  // useEffect(() => {
  //   // Fetch messages from the backend when the component mounts
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await fetch('https://chat-service-48er.onrender.com');
  //       const data = await response.json();
  //       setMessages(data.map(msg => ({ text: msg.text, sender: 'server' })));
  //     } catch (err) {
  //       console.error('Error fetching messages:', err);
  //     }
  //   };

  //   fetchMessages();
  // }, []);
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
  const clearHandler = async () => {
    try {
      // Send DELETE request to the server to delete all messages
      const res = await fetch('https://chat-service-48er.onrender.com', {
        method: 'DELETE',
      });
  
      // Check if the response is successful
      if (res.status === 200) {
        alert('Messages deleted successfully!');
        
        // Optionally, you could clear the local message state here too
        setMessages([]); // Clears the messages from the UI immediately
      } else {
        alert('Failed to delete messages.');
      }
    } catch (err) {
      console.log('Error:', err);
      alert('An error occurred while deleting messages.');
    }
  };
  

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
          />&nbsp;
          <button className='btn btn-danger'onClick={()=>{setbox(true)}}>clear</button>
          {
            box&&<>
            <div 
            style={{backgroundColor:"lightgrey",
              width:"400px",
              height:"200px",
              position:"fixed",
              top:"30%",
              left:"35%",
              border:"solid 1px black",
              borderRadius:"6px"  
            }}
            >
              <div className='d-flex justify-content-center' style={{
                paddingTop:"80px"
                
              }}>
            are you confirm to clear chat?
              
            </div>
            <div style={{paddingLeft:"120px",paddingTop:"20px"}}>
            <button className='btn btn-danger'onClick={()=>{setbox(false)}}>cancel</button>&nbsp;
              <button className='btn btn-success'onClick={clearHandler}>confirm</button>
              </div>
            </div>
            </>
          }
        </form>
      </div>
    </div>
  );
};

export default App;
