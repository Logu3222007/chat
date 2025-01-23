import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './Root';
import ChatApp from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatApp/>
  </React.StrictMode>
);

