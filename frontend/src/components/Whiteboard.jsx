import React, { useRef, useState, useEffect } from 'react';

const WhiteboardWidget = () => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);

    const startDrawing = (e) => {
        if (isDragging) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        context.beginPath();
        setDrawing(true);
        context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const draw = (e) => {
        if (!drawing || isDragging) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        context.lineWidth = brushSize;
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        context.stroke();
    };

    const stopDrawing = () => {
        setDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const changeColor = (newColor) => {
        setColor(newColor);
    };

    const changeBrushSize = (size) => {
        setBrushSize(size);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 400; // Adjust width
        canvas.height = 300; // Adjust height
    }, []);

    const handleDragStart = (e) => {
        setIsDragging(true);
        const style = window.getComputedStyle(e.target, null);
        e.dataTransfer.setData('text/plain',
            (parseInt(style.getPropertyValue('left'), 10) - e.clientX) + ',' +
            (parseInt(style.getPropertyValue('top'), 10) - e.clientY) + ',' +
            'whiteboard'
        );
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        const [offsetX, offsetY] = e.dataTransfer.getData('text/plain').split(',');
        const x = e.clientX + parseInt(offsetX, 10);
        const y = e.clientY + parseInt(offsetY, 10);
        setPosition({ x, y });
        setIsDragging(false);
        e.preventDefault();
    };

    return (
        <div
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                zIndex: 1000,
                padding: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
                cursor: isDragging ? 'grabbing' : 'move',
            }}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div
                style={{
                    pointerEvents: isDragging ? 'none' : 'auto',
                }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            >
                <canvas
                    ref={canvasRef}
                    style={{ border: '1px solid #000' }}
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
            </div>
        </div>
    );
};

export default WhiteboardWidget;