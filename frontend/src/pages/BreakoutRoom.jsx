import React from 'react';
import './BreakoutRoom.css';

const BreakoutRoom = () => {
    return (
        <div className="breakout-room">
            <div className="chat-box">
                {/* Chat box content */}
            </div>
            <div className="widget-container">
                <button className="widget-button">Video Call</button>
                <button className="widget-button">Voice Call</button>
            </div>
        </div>
    );
};

export default BreakoutRoom;