import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/logout', { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    navigate('/login', { state: { message: 'You have been logged out' } }); 
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => {
                console.error('Error during logout:', error);
            });
    }, [navigate]);

    return null;
};

export default Logout;