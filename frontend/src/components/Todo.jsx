import React, { useState } from 'react';

const ToDo = () => {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");

    const addTask = () => {
        if (task.trim()) {
            setTodos([...todos, task]);
            setTask("");
        }
    };

    return (
        <div className="todo-container">
            <h3>ToDo List</h3>
            <input 
                type="text" 
                value={task} 
                onChange={(e) => setTask(e.target.value)} 
                placeholder="Add a task" 
            />
            <button onClick={addTask}>Add</button>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>{todo}</li>
                ))}
            </ul>
        </div>
    );
};

export default ToDo;