import React from 'react';
import './App.css';
import{BrowserRouter, Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.js';
import Signup from './pages/Signup.js'
import Landing from './pages/Landing.jsx';
import Settings from './pages/Settings.jsx';
import Logout from './pages/Logout.jsx';
import { SocketProvider } from './SocketContext';
import BreakoutRoom from './pages/BreakoutRoom.jsx'

const App = () => {
  return (
    <div>
      <SocketProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/"element={<Login/>}/>
              <Route path="/dashboard/:roomId"element={<Dashboard/>}/>
              <Route path="/signup"element={<Signup/>}/>
              <Route path="/login"element={<Login/>}/>
              <Route path="/landing"element={<Landing/>}/>
              <Route path="/settings"element={<Settings/>}/>
              <Route path="/logout"element={<Logout/>}/>
              <Route path="/break" element={<BreakoutRoom/>}/>
            </Routes>
          </BrowserRouter>
      </SocketProvider>   
    </div>
  );
}

export default App;
