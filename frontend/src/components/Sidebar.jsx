import React, { useState, useRef, useEffect } from 'react';
import { FaThLarge, FaChalkboard, FaBars } from "react-icons/fa";
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


const Sidebar = ({ roomId, children }) => {
    const [showChat, setShowChat] = useState(false);
    const socket = useSocket();
    const [isOpen, setIsOpen] = useState(false);
    const [isBackgroundPopupOpen, setIsBackgroundPopupOpen] = useState(false);
    const [showWhiteboard, setShowWhiteboard] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [showTodo, setShowTodo] = useState(false);
    const [timerPosition, setTimerPosition] = useState({ x: 0, y: 0 });
    const [todoPosition, setTodoPosition] = useState({ x: 0, y: 0 });
    const [background, setBackground] = useState(null);
    const [volume, setVolume] = useState(0.1);
    const [isMuted, setIsMuted] = useState(false);
    const videoRef = useRef(null);
    const [isSharing, setIsSharing] = useState(false);
    const peerConnRef = useRef(null);
    const screenRef = useRef(null);


    const user = {
        firstName: "John",
        lastName: "Doe"
    };

    const toggle = () => setIsOpen(!isOpen);

    const toggleChat = () => {
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

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = isMuted;
        }
    }, [volume, isMuted]);

    useEffect(() => {

        const handleOffer = async (offer) => {
            try {
                console.log('Received offer:', offer);
                const peerConnection = new RTCPeerConnection();
                peerConnRef.current = peerConnection; // Store peerConnection in ref
                
                await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                console.log('Sending answer:', answer);
                socket.emit('answer', { room: roomId, answer });
                
                peerConnection.ontrack = (event) => {
                    console.log('Track event:', event);
                    if (screenRef.current) {
                        screenRef.current.srcObject = event.streams[0];
                        console.log('Stream received and set to screenRef:', event.streams[0]);
                    }
                };
                
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        console.log('Sending ICE candidate:', event.candidate);
                        socket.emit('ice-candidate', { room: roomId, candidate: event.candidate });
                    }
                };
            } catch (error) {
                console.error('Error handling offer:', error);
            }
        };
    
        const handleIceCandidate = (candidate) => {
            try {
                const peerConnection = peerConnRef.current;
                if (peerConnection) {
                    console.log('Adding ICE candidate:', candidate);
                    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                } else {
                    console.error('Peer connection is not available');
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        };

        if (!socket) return;
        socket.on('backgroundUpdate', (data) => {
            setBackground(data.background);
        });
    
        socket.on('widgetUpdate', (data) => {
        });
        socket.on('offer', handleOffer);
        socket.on('ice-candidate', handleIceCandidate);

        return () => {
            socket.off('backgroundUpdate');
            socket.off('widgetUpdate');
            socket.off('offer');
            socket.off('ice-candidate');

        };
    }, [socket, roomId]);


    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleTodoClick = (e) => {
        e.preventDefault();
        setShowTodo(prevShowTodo => !prevShowTodo);
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
        socket.emit('backgroundUpdate', { roomId, background:bg});
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
        } else if (widget === 'whiteboard') {
        }

        e.preventDefault();
        return false;
    };

    const menuItem = [
        {
            path: "/",
            name: "Dashboard",
            icon: <FaThLarge />
        },
        {
            path: "/backgrounds",
            name: "Backgrounds",
            icon: <AiOutlinePicture />,
            onClick: handleBackgroundClick
        },
        {
            path: "#",  
            name: "ChatRoom",
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
            path: "#",
            name: "Whiteboard",
            icon: <FaChalkboard />,
            onClick: () => setShowWhiteboard(prev => !prev)
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


    const handleCallClick = () => {
            console.log("Yo");
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

    const startSharing = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            console.log('Stream obtained:', stream);
            
            const peerConnection = new RTCPeerConnection();
            peerConnRef.current = peerConnection; // Store peerConnection in ref
            
            stream.getTracks().forEach(track => {
                console.log('Adding track:', track);
                peerConnection.addTrack(track, stream);
            });
            
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            console.log('Sending offer:', offer);
            socket.emit('offer', { room: roomId, offer });
            
            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log('Sending ICE candidate:', event.candidate);
                    socket.emit('ice-candidate', { room: roomId, candidate: event.candidate });
                }
            };
            
            peerConnection.ontrack = (event) => {
                console.log('Track event:', event);
                if (screenRef.current) {
                    screenRef.current.srcObject = event.streams[0];
                    console.log('Stream received and set to screenRef:', event.streams[0]);
                }
            };
            
            setIsSharing(true);
        } catch (error) {
            console.error('Error sharing screen:', error);
        }
    };
    
    const stopSharing = () => {
        const peerConnection = peerConnRef.current;
        if (peerConnection) {
            peerConnection.getSenders().forEach(sender => {
                console.log('Removing track:', sender);
                peerConnection.removeTrack(sender);
            });
            peerConnection.close();
            peerConnRef.current = null;
        }
        setIsSharing(false);
        
        if (screenRef.current && screenRef.current.srcObject) {
            const stream = screenRef.current.srcObject;
            stream.getTracks().forEach(track => {
                console.log('Stopping track:', track);
                track.stop();
            });
        }
        if (screenRef.current) {
            screenRef.current.srcObject = null;
        }
    };

    return (
        <div className="containerr" onDragOver={handleDragOver} onDrop={handleDrop}>
            <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
                <div className="top_section">
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">Logo</h1>
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
            </div>
            <main>
                <h1 className="headtitle">S T U D Y S P H E R E</h1>
                {children}
                {isBackgroundPopupOpen && (
                    <div className="popup-menu">
                        <h1>Select a Background</h1>
                        <div className="popup-buttons">
                            <button onClick={() => handleBackgroundSelect(cafe)}>Cafe</button>
                            <button onClick={() => handleBackgroundSelect(park)}>Park</button>
                            <button onClick={() => handleBackgroundSelect(beach)}>Beach</button>
                            <button onClick={() => handleBackgroundSelect(beach)}>Apartment</button>
                            <button onClick={() => handleBackgroundSelect(beach)}>City</button>
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
                            <Timer/>
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
                        <ToDo roomId={roomId}/>
                    </div>
                )}
                {showChat && <Chat roomId={roomId} />}
                {showWhiteboard && (
                        <WhiteboardWidget roomId ={ roomId }/>
                )}
                {background && 
                    <video ref={videoRef} autoPlay loop muted={isMuted} className="background-video">
                        <source src={background} type="video/mp4" />
                    </video>
                }
            <div>
            <button onClick={startSharing} disabled={isSharing}>Start Sharing</button>
            <button onClick={stopSharing} disabled={!isSharing}>Stop Sharing</button>
            <video ref={screenRef} autoPlay muted style={{ width: '80%', margin: 'auto', zIndex:5 }} />
            </div>
                <div className="upper-right-box">
                    <div className="box-title">My Room</div>
                    <div className="box-button-container">
                        <button className="box-button" onClick={handleInviteClick}>Invite</button>
                        <button className="box-button" onClick={handleCallClick}>Call</button>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Sidebar;