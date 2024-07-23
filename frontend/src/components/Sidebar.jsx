import React, { useState } from 'react';
import { FaThLarge, FaChalkboard, FaBars } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import { CgNotes, CgProfile } from "react-icons/cg";
import { IoIosChatboxes, IoIosAlarm } from "react-icons/io";
import { LuListTodo } from "react-icons/lu";
import { BsCameraVideoFill } from "react-icons/bs";
import { NavLink } from 'react-router-dom';
import ToDo from './ToDo'; 
import Timer from './Timer'
import cafe from '../assets/cafe.mp4';
import park from '../assets/park.mp4'; 
import beach from '../assets/beach.mp4';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isBackgroundPopupOpen, setIsBackgroundPopupOpen] = useState(false);
    const [showTimer, setShowTimer] = useState(false);
    const [showTodo, setShowTodo] = useState(false);
    const [timerPosition, setTimerPosition] = useState({ x: 0, y: 0 });
    const [todoPosition, setTodoPosition] = useState({ x: 0, y: 0 });
    const [background, setBackground] = useState(null);

    const toggle = () => setIsOpen(!isOpen);

    const handleBackgroundClick = (e) => {
        e.preventDefault();
        setIsBackgroundPopupOpen(!isBackgroundPopupOpen);
    };

    const handleTimerClick = (e) => {
        e.preventDefault();
        setShowTimer(prevShowTimer => !prevShowTimer);
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
        console.log("Hi")
        setBackground(bg);
        setIsBackgroundPopupOpen(false);
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
            path: "/chatroom",
            name: "ChatRoom",
            icon: <IoIosChatboxes />
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
            path: "/whiteboard",
            name: "Whiteboard",
            icon: <FaChalkboard />
        },
        {
            path: "/timer",
            name: "Timer",
            icon: <IoIosAlarm />,
            onClick: handleTimerClick
        },
        {
            path: "/profile",
            name: "Profile",
            icon: <CgProfile />
        }
    ];

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
                            activeclassName="active" 
                            onClick={item.onClick}
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
                        </div>
                    </div>
                )}
                {background && (
                    <div className="background-container">
                        <video
                            src={background}
                            autoPlay
                            loop
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                zIndex: 4,
                                volume: 0.5,
                            }}
                        />
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
                        <ToDo />
                    </div>
                )}
                <div className="upper-right-box">
                    <div className="box-title">My Room</div>
                    <div className="box-button-container">
                        <button className="box-button">INVITE</button>
                        <BsCameraVideoFill className="box-icon" />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Sidebar;