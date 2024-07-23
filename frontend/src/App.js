import React from 'react';
import './App.css';
import{BrowserRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import ChatRoom from './pages/ChatRoom.jsx';
import Notes from './pages/Notes.jsx';
import Whiteboard from './pages/Whiteboard.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js'

const App = () => {
  return (
    <div>
     <BrowserRouter>
      <Routes>
        <Route path="/"element={<Dashboard/>}/>
        <Route path="/dashboard"element={<Dashboard/>}/>
        <Route path="/chatroom"element={<ChatRoom/>}/>
        <Route path="/notes"element={<Notes/>}/>
        <Route path="/whiteboard"element={<Whiteboard/>}/>
        <Route path="/profile"element={<Profile/>}/>
        <Route path="/signup"element={<Signup/>}/>
        <Route path="/login"element={<Login/>}/>       
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
