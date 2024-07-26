import React, { useEffect, useState } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;

const SessionInfo = () => {
    const [sessionInfo, setSessionInfo] = useState(null);

    useEffect(() => {
        const fetchSessionInfo = async () => {
            try {
                const response = await axios.get('http://localhost:8081/session-info', {
                });
                setSessionInfo(response.data);
            } catch (error) {
                console.error('Error fetching session info:', error);
            }
        };

        fetchSessionInfo();
    }, []);

    if (!sessionInfo) return <p>Loading...</p>;

    return (
        <div>
            <h2>Session Information</h2>
            <pre>{JSON.stringify(sessionInfo, null, 2)}</pre>
        </div>
    );
};

export default SessionInfo;