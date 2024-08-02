import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Validation from './LoginValidation';
import axios from 'axios';

axios.defaults.withCredentials = true;

function Login() {
    const [values, setValues] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();
    const location = useLocation(); 
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState('');

    useEffect(() => {

        if (location.state && location.state.message) {
            setServerMessage(location.state.message);
        }
    }, [location.state]);

    const handleInput = (event) => {

        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            axios.post('http://localhost:8081/login', values)
                .then(res => {
                    if (res.status === 200) {
                        navigate('/Landing');
                    } else {
                        alert("No record existed");
                    }
                })
                .catch(err => {
                    console.error("Error during login:", err);
                });
        } else {
            console.log("Validation errors found:", validationErrors);
        }
    };

    return (
        <div className='d-flex vh-100 justify-content-center align-items-center bg-primary'>
            <div className='p-3 bg-white rounded w-25'>
                <h2>Sign In</h2>
                {serverMessage && <div className="alert alert-warning">{serverMessage}</div>} {/* Display the message */}
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input 
                            type="text" 
                            placeholder='Enter Username' 
                            name='username' 
                            onChange={handleInput} 
                            className='form-control rounded-0'
                            value={values.username} 
                        />
                        {errors.username && <span className='text-danger'>{errors.username}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input 
                            type="password" 
                            placeholder='Enter Password' 
                            name='password' 
                            onChange={handleInput} 
                            className='form-control rounded-0'
                            value={values.password}
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Log in</strong></button>
                    <p>You have agreed to our terms and conditions</p>
                    <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;