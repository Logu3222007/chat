import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socketio, setSocketio] = useState(null);
  const [box, setbox] = useState(false);

  useEffect(() => {
    const socket = io('https://chat-service-48er.onrender.com');
    setSocketio(socket);

    socket.on('welcome', (data) => {
      console.log(data);
    });

    socket.on('broad_cast_msg', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.text, sender: 'server' },
      ]);
    });

    return () => {
      socket.off('broad_cast_msg');
      socket.disconnect();
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();

    if (socketio && message.trim() !== '') {
      socketio.emit('message', message);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, sender: 'client' },
      ]);

      setMessage('');
    }
  };

  useEffect(() => {
    const messageBox = document.querySelector('#message-box');
    if (messageBox) {
      messageBox.scrollTop = messageBox.scrollHeight;
    }
  }, [messages]);

  const clearHandler = async () => {
    try {
      const res = await fetch('https://chat-service-48er.onrender.com', {
        method: 'DELETE',
      });

      if (res.status === 200) {
        setbox(false);
        setMessages([]);
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
          transform: 'translateX(-50%)',
          padding: '10px',
          width: '90%',
          maxWidth: '400px',
          maxHeight: '50vh',
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
              marginTop: '10px',
              textAlign: msg.sender === 'client' ? 'right' : 'left',
            }}
          >
            <span
              style={{
                padding: '10px',
                backgroundColor: msg.sender === 'client' ? 'green' : 'gray',
                color: 'white',
                borderRadius: '5px',
                display: 'inline-block',
                maxWidth: '225px',
                wordWrap: 'break-word',
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
            width: '90%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '0 10px',
            justifyContent: 'space-between', // Ensures the buttons have space
          }}
        >
          <input
            type="text"
            placeholder="Type a message"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            style={{
              flexGrow: 1,
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
          <button
            className="btn btn-danger"
            onClick={() => {
              setbox(true);
            }}
            style={{
              marginLeft: '10px',
            }}
          >
            Clear
          </button>

          {/* Clear Confirmation Modal */}
          {box && (
            <>
              <div
                style={{
                  backgroundColor: 'lightgrey',
                  width: '90%',
                  maxWidth: '400px',
                  height: '200px',
                  position: 'fixed',
                  top: '30%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  border: 'solid 1px black',
                  borderRadius: '6px',
                  padding: '20px',
                }}
              >
                <div className="d-flex justify-content-center" style={{ paddingTop: '50px' }}>
                  Are you sure you want to clear the chat?
                </div>
                <div style={{ paddingTop: '20px', textAlign: 'center' }}>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      setbox(false);
                    }}
                  >
                    Cancel
                  </button>
                  &nbsp;
                  <button className="btn btn-success" onClick={clearHandler}>
                    Confirm
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default App;
