import React from 'react';
import './App.css';
import{BrowserRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import ChatRoom from './pages/ChatRoom.jsx';
import Notes from './pages/Notes.jsx';
import Profile from './pages/Profile.jsx';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js'
import Whiteboard from './components/Whiteboard';
import Landing from './pages/Landing.jsx';
import Settings from './pages/Settings.jsx';
import Logout from './pages/Logout.jsx';
import { SocketProvider } from './SocketContext';

const App = () => {
  return (
    <div>
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"element={<Dashboard/>}/>
          <Route path="/dashboard/:roomId"element={<Dashboard/>}/>
          <Route path="/chatroom"element={<ChatRoom/>}/>
          <Route path="/notes"element={<Notes/>}/>
          <Route path="/whiteboard"element={<Whiteboard/>}/>
          <Route path="/profile"element={<Profile/>}/>
          <Route path="/signup"element={<Signup/>}/>
          <Route path="/login"element={<Login/>}/>
          <Route path="/landing"element={<Landing/>}/>
          <Route path="/settings"element={<Settings/>}/>
          <Route path="/logout"element={<Logout/>}/>   
        </Routes>
      </BrowserRouter>
    </SocketProvider>
    </div>
  );
}

export default App;
