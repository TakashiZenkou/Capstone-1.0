import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';


const ToDo = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [priority, setPriority] = useState('Low');
    const [showCompleted, setShowCompleted] = useState(false);

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
                completed: false
            };
            setTasks([...tasks, newTask]);
            setTaskInput('');
            setPriority('Low');
        }
    };

    const handleRemoveTask = (id) => {
        const newTasks = tasks.filter(task => task.id !== id);
        setTasks(newTasks);
    };

    const toggleCompletion = (id) => {
        const newTasks = tasks.map(task =>
            task.id === id
                ? { ...task, completed: !task.completed }
                : task
        );
        setTasks(newTasks);
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
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleCompletion(task.id)}
                            />
                        </div>
                        <span>{task.text} {task.priority}</span>
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
