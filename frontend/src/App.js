import React from 'react';
import './App.css';
import{BrowserRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
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
<<<<<<< HEAD
      <SocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/"element={<Login/>}/>
              <Route path="/dashboard/:roomId"element={<Dashboard/>}/>
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
=======
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"element={<Login/>}/>
          <Route path="/dashboard/:roomId"element={<Dashboard/>}/>
          <Route path="/notes"element={<Login/>}/>
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
>>>>>>> parent of 43de4b5 (Started Adding Voice and Video Chat)
    </div>
  );
}

export default App;
