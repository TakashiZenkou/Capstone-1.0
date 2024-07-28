import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Landing.css';
import { useSocket } from '../SocketContext';

axios.defaults.withCredentials = true;

const Landing = () => {
    const navigate = useNavigate();
    const socket = useSocket();
    const [roomId, setRoomId] = useState('');
    const [error, setError] = useState(null);


    useEffect(() => {
        axios.get('http://localhost:8081/user-details') 
            .then(response => {
                
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    navigate('/login', { state: { message: "Please login to access this page" } });
                } else {
                    console.error('Error fetching user details:', error);
                }
            });
    }, [navigate]);


    useEffect(() => {
        if (!socket) return;
        
        socket.on('error', (errorMessage) => {
            setError(errorMessage);
            console.log(error);
        });

        socket.on('roomJoined', (roomId) => {
            navigate(`/dashboard/${roomId}`);
        });

        socket.on('roomCreated', (roomId)=>{
            navigate(`/dashboard/${roomId}`);
        })

        return () => {
            socket.off('error');
            socket.off('roomJoined');
            socket.off('roomCreated');
        };
    }, [navigate]);


    const handleCreateRoom = () => {
        socket.emit('createRoom',roomId);
    };

    const handleJoinRoom = async () => {
        if (roomId) {
            socket.emit('joinRoom', roomId);
        } else {
            alert('Please enter a room ID');
        }
    };

    const handleSettings = () => {
        navigate('/settings');
    };

    return (
        <div className="home-page">
            <h1 className="title">Welcome to the Room Management System</h1>
            <div className="button-container">
                <button className="button" onClick={handleCreateRoom}>Create Room</button>
                <div className="join-room">
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        className="room-input"
                    />
                    <button className="button" onClick={handleJoinRoom}>Join Room</button>
                </div>
                <button className="button" onClick={handleSettings}>Settings</button>
            </div>
        </div>
    );
};

export default Landing;