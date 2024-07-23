import React, { useState, useEffect, useRef } from 'react';
import alarmSound from '../assets/timer.mp3';

const Timer = () => {
    const [workTime, setWorkTime] = useState(25 * 60); // default 25 minutes
    const [breakTime, setBreakTime] = useState(5 * 60); // default 5 minutes
    const [time, setTime] = useState(workTime);
    const [isRunning, setIsRunning] = useState(false);
    const [isWorkTime, setIsWorkTime] = useState(true);
    const audioRef = useRef(null);
    

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setTime(prevTime => prevTime - 1);
            }, 1000);

            if (time === 0) {
                if (isWorkTime) {
                    setTime(breakTime);
                } else {
                    setTime(workTime);
                }
                setIsWorkTime(!isWorkTime);
            } else if (time <= 3 && time > 0) {
                audioRef.current.play();
            }
        }
        return () => clearInterval(timer);
    }, [isRunning, time, isWorkTime, breakTime, workTime]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsWorkTime(true);
        setTime(workTime);
    };

    const handleWorkTimeChange = (event) => {
        const newWorkTime = event.target.value * 60;
        setWorkTime(newWorkTime);
        if (isWorkTime && !isRunning) {
            setTime(newWorkTime);
        }
    };

    const handleBreakTimeChange = (event) => {
        const newBreakTime = event.target.value * 60;
        setBreakTime(newBreakTime);
        if (!isWorkTime && !isRunning) {
            setTime(newBreakTime);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div className="pomodoro-container">
            <h3>{isWorkTime ? 'Work Time' : 'Break Time'}</h3>
            <div className="time-display">{formatTime(time)}</div>
            <button onClick={handleStartStop}>
                {isRunning ? 'Stop' : 'Start'}
            </button>
            <button onClick={handleReset}>Reset</button>
            <div className="settings">
                <label>
                    Work Time (minutes):
                    <input
                        type="number"
                        value={workTime / 60}
                        onChange={handleWorkTimeChange}
                        disabled={isRunning}
                    />
                </label>
                <label>
                    Break Time (minutes):
                    <input
                        type="number"
                        value={breakTime / 60}
                        onChange={handleBreakTimeChange}
                        disabled={isRunning}
                    />
                </label>
            </div>
            <audio ref={audioRef} src={alarmSound} />
        </div>
    );
};

export default Timer;