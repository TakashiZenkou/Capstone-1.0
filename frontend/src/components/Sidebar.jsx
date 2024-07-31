import React, { useState, useRef, useEffect } from 'react';
import { FaChalkboard, FaBars } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { CgNotes, CgProfile } from "react-icons/cg";
import { IoIosChatboxes, IoIosAlarm } from "react-icons/io";
import { LuListTodo } from "react-icons/lu";
import { NavLink } from 'react-router-dom';
import ToDo from './ToDo';
import Timer from './Timer';
import WhiteboardWidget from './Whiteboard';
import cafe from '../assets/cafe.mp4';
import park from '../assets/park.mp4';
import beach from '../assets/beach.mp4';
import { useSocket } from '../SocketContext';
import Chat from './Chat';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const Sidebar = ({ roomId, children }) => {
    const navigate = useNavigate();
    const [showChat, setShowChat] = useState(false);
    const socket = useSocket();
    const [isOpen, setIsOpen] = useState(true);
    const [isBackgroundPopupOpen, setIsBackgroundPopupOpen] = useState(false);
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [showTodo, setShowTodo] = useState(false);
    const [timerPosition, setTimerPosition] = useState({ x: 0, y: 0 });
    const [todoPosition, setTodoPosition] = useState({ x: 0, y: 0 });
    const [background, setBackground] = useState(null);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);
    const [whiteboardSize, setWhiteboardSize] = useState(null); 
    const [showMembers, setShowMembers] = useState(false);
    const [usernames, setUsernames] = useState([]);
    const [username, setUsername] = useState('');


    // Functions

    const toggle = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen)
    };

    const toggleChat = (e) => {
        e.preventDefault();
        setShowChat(prevShowChat => !prevShowChat);
    };

    const handleBackgroundClick = (e) => {
        e.preventDefault();
        setIsBackgroundPopupOpen(!isBackgroundPopupOpen);
    };

    const handleTimerClick = (e) => {
        e.preventDefault();
        setShowTimer(prevShowTimer => !prevShowTimer);
    };

    const handleVolumeChange = (event) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
        }
    };

    const handleTodoClick = (e) => {
        e.preventDefault();
        setShowTodo(prevShowTodo => !prevShowTodo);
    };

    const handleWhiteboardClose = () => {
        setWhiteboardSize(null); 
    };

    const handleTodoClose = () => {
        setShowTodo(false);
    };

    const handleTimerClose = () => {
        setShowTimer(false);
    };

    const handleBackgroundSelect = (bg) => {
        setBackground(bg);
        setIsBackgroundPopupOpen(false);
        socket.emit('backgroundUpdate', { roomId, background: bg });
    };

    const handleDragStart = (e, widget) => {
        const style = window.getComputedStyle(e.target, null);
        e.dataTransfer.setData("text/plain",
            (parseInt(style.getPropertyValue("left"), 10) - e.clientX) + ',' +
            (parseInt(style.getPropertyValue("top"), 10) - e.clientY) + ',' + widget);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        return false;
    };

    const handleDrop = (e) => {
        const [offsetX, offsetY, widget] = e.dataTransfer.getData("text/plain").split(',');
        const x = e.clientX + parseInt(offsetX, 10);
        const y = e.clientY + parseInt(offsetY, 10);

        if (widget === 'todo') {
            setTodoPosition({ x, y });
        } else if (widget === 'timer') {
            setTimerPosition({ x, y });
        }

        e.preventDefault();
        return false;
    };

    const handleInviteClick = () => {
        navigator.clipboard.writeText(roomId)
            .then(() => {
                alert('Text copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy text:', err);
            });
    };

    const handleWhiteboardClick = (e) => {
        e.preventDefault();
        setShowWhiteboard(true);
        setWhiteboardSize(null); 
    };

    const toggleMembersList = () => {
        setShowMembers(prevShowMembers => !prevShowMembers);
    };

    const handleLogout = () => {
        axios.get('http://localhost:8081/logout')
            .then(() => {
                socket.disconnect();
                navigate('/login');
            })
            .catch((err) => {
                console.error('Logout failed', err);
            });
    };

    const menuItem = [
        {
            path: "/backgrounds",
            name: "Backgrounds",
            icon: <AiOutlinePicture />,
            onClick: handleBackgroundClick
        },
        {
            path: "/chatz",
            name: "Chat",
            icon: <IoIosChatboxes />,
            onClick: toggleChat
        },
        {
            path: "/todo",
            name: "ToDo",
            icon: <LuListTodo />,
            onClick: handleTodoClick
        },
        {
            path: "/notes",
            name: "Notes",
            icon: <CgNotes />
        },
        {
            path: "/white",
            name: "Whiteboard",
            icon: <FaChalkboard />,
            onClick: handleWhiteboardClick 
        },
        {
            path: "/timer",
            name: "Timer",
            icon: <IoIosAlarm />,
            onClick: handleTimerClick
        },
        {
            path: "/Settings",
            name: "Profile",
            icon: <CgProfile />
        }
    ];

    // Use Effects

    useEffect(() => {
        // Function to check if room exists
        const checkRoomExists = async () => {
            try {
                const roomExistsResponse = await axios.get(`http://localhost:8081/check-room/${roomId}`);
                if (roomExistsResponse.data.exists) {
                } else {
                    // Room doesn't exist, check if user is logged in
                    try {
                        await axios.get('http://localhost:8081/user-details');
                        // User is logged in, navigate to Landing page
                        navigate('/landing');
                    } catch (userDetailsError) {
                        if (userDetailsError.response && userDetailsError.response.status === 401) {
                            // User is not logged in, navigate to Login page
                            navigate('/login');
                        } else {
                            console.error('Error checking user details:', userDetailsError);
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking room:', error);
            }
        };

        checkRoomExists();
    }, [navigate, roomId, socket]);



    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.load(); 
        }
    }, [background]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
        }
    }, [background, volume, isMuted]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8081/user-details')
                setUsername(response.data.username); // Set the username from userDetails

            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);


    useEffect(() => {
        if (!socket || !username) return;
        socket.emit('joinRoom', {roomId: roomId, username: username });

        socket.on('backgroundUpdate', (data) => {
            setBackground(data.background);
        });

        socket.on('widgetUpdate', (data) => {
        });
        socket.on('updateUsernames', (data) => {
            setUsernames(data);
        });


        return () => {
            socket.off('backgroundUpdate');
            socket.off('widgetUpdate');
            socket.off('updateUsernames');
        };
    }, [socket, roomId, username]);

    const handleWhiteboardSizeSelect = (size) => {
        setWhiteboardSize(size); 
        setShowWhiteboard(false); 
    };

    return (
        <div className="containerr" onDragOver={handleDragOver} onDrop={handleDrop}>
            <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {
                    menuItem.map((item, index) => (
                        <NavLink
                            to={item.path}
                            key={index}
                            className="link"
                            activeClassName="active"
                            onClick={item.onClick}
                            style={{ cursor: item.onClick ? 'pointer' : 'default' }}
                        >
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    ))
                }

                <div className="profile-section">
                    <div className="username-section">
                        {username && <p className="username-text">{username}</p>}
                    </div>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <main>
                <div className="header-container">
                    <h1 className="headtitle">S T U D Y S P H E R E</h1>
                    <div className="room-id-display">
                        <h2>Room ID: {roomId}</h2>
                    </div>
                    <div className="members-list-container">
                        <button onClick={toggleMembersList}>
                            {showMembers ? 'Hide Room Members' : 'Show Room Members'}
                        </button>
                        {showMembers && (
                            <ul className="members-list">
                                {usernames.map((name, index) => (
                                    <li
                                        key={index}
                                        className={name === username ? 'highlighted' : ''}
                                    >
                                        {name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                {children}
                {isBackgroundPopupOpen && (
                    <div className="popup-menu">
                        <h1>Select a Background</h1>
                        <div className="popup-buttons">
                            <button onClick={() => handleBackgroundSelect(cafe)}>Cafe</button>
                            <button onClick={() => handleBackgroundSelect(park)}>Park</button>
                            <button onClick={() => handleBackgroundSelect(beach)}>Beach</button>
                        </div>
                    </div>
                )}
                {background && (
                    <div className="background-container">
                        <video
                            ref={videoRef}
                            src={background}
                            autoPlay
                            loop
                            preload="auto"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 0,
                            }}
                        />
                        <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 5 }}>
                            <input
                                className='test'
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                style={{ width: '150px' }}
                            />
                            <button onClick={toggleMute}>
                                {isMuted ? 'Unmute' : 'Mute'}
                            </button>
                        </div>
                    </div>
                )}
                {showTimer && (
                    <div
                        className="timer-widget"
                        style={{ position: 'absolute', left: timerPosition.x, top: timerPosition.y }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'timer')}
                    >
                        <div className="timer-header">
                            <h3>Pomodoro Timer</h3>
                            <button onClick={handleTimerClose}>Close</button>
                        </div>
                        <div className="pomodoro-timer">
                            <Timer />
                        </div>
                    </div>
                )}
                {showTodo && (
                    <div
                        className="todo-widget"
                        style={{ position: 'absolute', left: todoPosition.x, top: todoPosition.y }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'todo')}
                    >
                        <ToDo roomId={roomId} onClose={handleTodoClose} />
                    </div>
                )}
                {showChat && <Chat roomId={roomId} />}
                {whiteboardSize === null && showWhiteboard && (
                    <div className="size-menu" >
                        <button onClick={() => handleWhiteboardSizeSelect('small')}>Small (300x300)</button>
                        <button onClick={() => handleWhiteboardSizeSelect('medium')}>Medium (600x450)</button>
                        <button onClick={() => handleWhiteboardSizeSelect('large')}>Large (650x500)</button>
                    </div>
                )}
                {whiteboardSize && (
                    <WhiteboardWidget roomId={roomId} size={whiteboardSize} onClose={handleWhiteboardClose} />
                )}
                <div className="upper-right-box">
                    <div className="box-title">My Room</div>
                    <div className="box-button-container">
                        <button className="box-button" onClick={handleInviteClick}>Invite</button>
                        <button className="box-button">Call</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Sidebar;