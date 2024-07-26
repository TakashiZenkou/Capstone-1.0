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
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        // Fetch the user details from the server to populate the form
        axios.get('http://localhost:8081/user-details') // Adjust the endpoint as needed
            .then(response => {

            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    // Redirect to login page with a message
                    navigate('/login', { state: { message: "Please login to access this page" } });
                } else {
                    console.error('Error fetching user details:', error);
                }
            });
    }, [navigate]);


    useEffect(() => {
        socket.on('error', (errorMessage) => {
            console.log("Hello");
            setError(errorMessage);
            console.log(error);
        });

        socket.on('roomJoined', (roomId) => {
            console.log("It hit the roomJoined");
            // Redirect to the room page when the room is joined
            navigate(`/dashboard/${roomId}`);
        });

        return () => {
            socket.off('error');
            socket.off('roomJoined');
        };
    }, [navigate]);



    const handleCreateRoom = async () => {
        try {
            const response = await axios.post('http://localhost:8081/create-room');
            const newRoomId = response.data.roomId;
            setRoomId(newRoomId);
            navigate(`/dashboard/${newRoomId}`);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleJoinRoom = async () => {
        if (roomId) {
            // Emit event to join the room
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