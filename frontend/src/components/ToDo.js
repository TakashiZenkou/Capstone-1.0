import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useSocket } from '../SocketContext';
import axios from 'axios';
import './ToDo.css';

axios.defaults.withCredentials = true;

const ToDo = ({ roomId, onClose }) => {
    const socket = useSocket();
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [priority, setPriority] = useState('Low');
    const [showCompleted, setShowCompleted] = useState(false);
    const [username, setUsername] = useState(''); // Initialize username state

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8081/user-details', {
                    withCredentials: true // Include cookies in the request
                });

                setUsername(response.data.username); // Set the username from userDetails
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('updateTasks', (newTasks) => {
                setTasks(newTasks);
            });

            return () => {
                socket.off('updateTasks');
            };
        }
    }, [socket]);

    const handleInputChange = (e) => {
        setTaskInput(e.target.value);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleAddTask = () => {
        if (taskInput.trim()) {
            const newTask = {
                id: Date.now(),
                text: taskInput,
                priority,
                completed: false,
                user: username // Include the username
            };
            const updatedTasks = [...tasks, newTask];
            setTasks(updatedTasks);
            socket.emit('updateTasks', { roomId, tasks: updatedTasks });
            setTaskInput('');
            setPriority('Low');
        }
    };

    const handleRemoveTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        setTasks(updatedTasks);
        socket.emit('updateTasks', { roomId, tasks: updatedTasks });
    };

    const toggleCompletion = (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        );
        setTasks(updatedTasks);
        socket.emit('updateTasks', { roomId, tasks: updatedTasks });
    };

    const sortedTasks = tasks.sort((a, b) => {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const handleViewToggle = () => {
        setShowCompleted(!showCompleted);
    };

    const filteredTasks = showCompleted
        ? sortedTasks.filter(task => task.completed)
        : sortedTasks.filter(task => !task.completed);

    return (
        <div className="todo-container">
            <div className="todo-header">
                <h3>ToDo List</h3>
                <button onClick={handleViewToggle}>
                    {showCompleted ? 'Show Pending' : 'Show Completed'}
                </button>
                <button className="close-todo" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            {!showCompleted && (
                <div className="todo-input">
                    <input 
                        type="text" 
                        value={taskInput} 
                        onChange={handleInputChange} 
                        onKeyDown={e => e.key === 'Enter' && handleAddTask()} 
                        placeholder="Add a new task"
                    />
                    <select className='todo-select' value={priority} onChange={handlePriorityChange}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <button onClick={handleAddTask}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>
            )}
            <h2 className='todo-heading'>{showCompleted ? 'Completed Tasks' : 'Pending Tasks'}</h2>
            <ul className="todo-list">
                {filteredTasks.map((task) => (
                    <li key={task.id} className={`todo-item ${task.completed ? 'completed' : ''}`}>
                        <div className="task-details">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleCompletion(task.id)}
                                />
                            </div>
                            <span className="task-text">{task.text}</span>
                            <span className="task-user">{task.user}</span>
                            <span className={`task-priority ${task.priority.toLowerCase()}`}>{task.priority}</span>
                        </div>
                        {!showCompleted && (
                            <button className="remove-task" onClick={() => handleRemoveTask(task.id)}>
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ToDo;