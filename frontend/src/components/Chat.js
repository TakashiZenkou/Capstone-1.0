import React, { useState, useEffect } from 'react';
import { useSocket } from '../SocketContext';
import './Chat.css';
import axios from 'axios';

const Chat = ({ roomId }) => {
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');

    axios.defaults.withCredentials = true;


    useEffect(() => {

        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8081/user-details');
                setUsername(response.data.username || 'Anonymous'); 
            } catch (error) {
                console.error('Error fetching user details:', error);
                setUsername('Anonymous'); 
            }
        };

        fetchUserDetails();

        if (socket) {
            socket.on('chatMessage', (msg) => {
                console.log('Received chat message:', msg);
                setMessages((prevMessages) => [...prevMessages, msg]);
            });

            return () => {
                socket.off('chatMessage');
            };
        }
    }, [socket]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && roomId) {
            socket.emit('sendMessage', { roomId, message, username});
            setMessage(''); // Clear the input after sending
        }
    };

    return (
        <div className="chat-widget">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <strong>{msg.username}: </strong>{msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chat;