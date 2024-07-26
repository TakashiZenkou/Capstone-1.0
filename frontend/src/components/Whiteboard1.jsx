import React, { useRef, useState, useEffect } from 'react';
import { useSocket } from '../SocketContext';

const WhiteboardWidget = ({ roomId }) => {
    const canvasRef = useRef(null);
    const socket = useSocket();
    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [undoStack, setUndoStack] = useState([]);
    const [redoStack, setRedoStack] = useState([]);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        context.beginPath();
        setDrawing(true);
        context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        socket.emit('drawing', { roomId, type: 'start', x: e.clientX - rect.left, y: e.clientY - rect.top, color, brushSize });
    };

    const draw = (e) => {
        if (!drawing) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        context.lineWidth = brushSize;
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        context.stroke();
        socket.emit('drawing', { roomId, type: 'draw', x: e.clientX - rect.left, y: e.clientY - rect.top, color, brushSize });
    };

    const stopDrawing = () => {
        if (!drawing) return;
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL();
        setUndoStack(prev => [...prev, dataUrl]);
        setDrawing(false);
        socket.emit('drawing', { roomId, type: 'stop' });
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        setUndoStack([]);
        setRedoStack([]);
        socket.emit('clearCanvas', roomId);
    };

    const undo = () => {
        if (undoStack.length > 0) {
            const lastState = undoStack.pop();
            setRedoStack(prev => [...prev, lastState]);
            restoreCanvas(lastState);
            socket.emit('undo', { roomId });
        }
    };

    const redo = () => {
        if (redoStack.length > 0) {
            const nextState = redoStack.pop();
            setUndoStack(prev => [...prev, nextState]);
            restoreCanvas(nextState);
            socket.emit('redo', { roomId });
        }
    };

    const restoreCanvas = (dataUrl) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0);
        };
    };

    const changeColor = (newColor) => {
        setColor(newColor);
    };

    const changeBrushSize = (size) => {
        setBrushSize(size);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 400; 
        canvas.height = 300;

        const handleDrawing = (data) => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (data.type === 'start') {
                context.beginPath();
                context.moveTo(data.x, data.y);
                context.strokeStyle = data.color;
                context.lineWidth = data.brushSize;
            } else if (data.type === 'draw') {
                context.lineTo(data.x, data.y);
                context.stroke();
            } else if (data.type === 'stop') {
                context.closePath();
            }
        };

        const handleClearCanvas = () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            setUndoStack([]);
            setRedoStack([]);
        };

        const handleUndo = () => {
            undo(); 
        };

        const handleRedo = () => {
            redo(); 
        };

        socket.on('drawing', handleDrawing);
        socket.on('clearCanvas', handleClearCanvas);
        socket.on('undo', handleUndo);
        socket.on('redo', handleRedo);

        return () => {
            socket.off('drawing', handleDrawing);
            socket.off('clearCanvas', handleClearCanvas);
            socket.off('undo', handleUndo);
            socket.off('redo', handleRedo);
        };
    }, [undoStack, redoStack, socket]);

    return (
        <div
            style={{
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                padding: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                display: 'inline-block',
                position: 'relative',
            }}
        >
            <div>
                <canvas
                    ref={canvasRef}
                    style={{ border: '1px solid #000' }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                />
            </div>
            <div style={{ marginTop: '10px' }}>
                <button onClick={() => changeColor('#000000')} style={{ backgroundColor: '#000000', color: '#ffffff' }}>Black</button>
                <button onClick={() => changeColor('#ff0000')} style={{ backgroundColor: '#ff0000', color: '#ffffff' }}>Red</button>
                <button onClick={() => changeColor('#00ff00')} style={{ backgroundColor: '#00ff00', color: '#ffffff' }}>Green</button>
                <button onClick={() => changeColor('#0000ff')} style={{ backgroundColor: '#0000ff', color: '#ffffff' }}>Blue</button>
                <button onClick={() => changeColor('#ffff00')} style={{ backgroundColor: '#ffff00', color: '#000000' }}>Yellow</button>
                <button onClick={clearCanvas}>Clear</button>
                <select value={brushSize} onChange={(e) => changeBrushSize(Number(e.target.value))} style={{ marginLeft: '10px' }}>
                    <option value="1">Brush Size: 1</option>
                    <option value="2">Brush Size: 2</option>
                    <option value="3">Brush Size: 3</option>
                    <option value="4">Brush Size: 4</option>
                    <option value="5">Brush Size: 5</option>
                </select>
                <button onClick={undo} style={{ marginLeft: '10px' }}>Undo</button>
                <button onClick={redo} style={{ marginLeft: '10px' }}>Redo</button>
            </div>
        </div>
    );
};

export default WhiteboardWidget;