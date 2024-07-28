import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Settings.css'; 

axios.defaults.withCredentials = true;

const Validation = (values) => {
    let errors = {};

    if (values.firstname !== undefined && !values.firstname.trim()) {
        errors.firstname = "First Name is required";
    }
    if (values.lastname !== undefined && !values.lastname.trim()) {
        errors.lastname = "Last Name is required";
    }
    if (values.username !== undefined && !values.username.trim()) {
        errors.username = "Username is required";
    }
    if (values.password !== undefined) {
        if (!values.password.trim()) {
            errors.password = "Password is required";
        } else if (values.password.length < 8) {
            errors.password = "Password must be at least 8 characters long";
        }
    }
    if (values.education !== undefined && !values.education) {
        errors.education = "Education level is required";
    }
    if (values.academic !== undefined && !values.academic) {
        errors.academic = "Academic area is required";
    }
    if (values.gender !== undefined && !values.gender) {
        errors.gender = "Gender is required";
    }

    return errors;
};

const Settings = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        education: '',
        academic: '',
        gender: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [initialData, setInitialData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8081/user-details')
            .then(response => {
                setFormData(response.data);
                setInitialData(response.data);
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    navigate('/login', { state: { message: "Please login to access this page" } });
                } else {
                    console.error('Error fetching user details:', error);
                }
            });
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        setSuccessMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const changedData = Object.keys(formData).reduce((acc, key) => {
            if (formData[key] !== initialData[key]) {
                acc[key] = formData[key];
            }
            return acc;
        }, {});

        const validationErrors = Validation(changedData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            axios.put('http://localhost:8081/update-user', changedData)
                .then(response => {
                    setSuccessMessage('Your details have been updated successfully.');
                    setInitialData(formData); 
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        navigate('/login', { state: { message: "Please login to access this page" } });
                    } else {
                        console.error('Error updating user details:', error);
                        setErrors({ update: 'Error updating user details' });
                    }
                });
        }
    };

    return (
        <div className="settings-page">
            <h1>Settings</h1>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errors.update && <p className="error-message">{errors.update}</p>}
            <form onSubmit={handleSubmit} className="settings-form">
                <label>
                    First Name:
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                        placeholder="First Name"
                    />
                    {errors.firstname && <span className="error">{errors.firstname}</span>}
                </label>
                <label>
                    Last Name:
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        placeholder="Last Name"
                    />
                    {errors.lastname && <span className="error">{errors.lastname}</span>}
                </label>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Username"
                    />
                    {errors.username && <span className="error">{errors.username}</span>}
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                    {errors.password && <span className="error">{errors.password}</span>}
                </label>
                <label>
                    Education:
                    <select
                        name="education"
                        value={formData.education}
                        onChange={handleChange}
                    >
                        <option value="">Select your education level</option>
                        <option value="High School">High School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                    </select>
                    {errors.education && <span className="error">{errors.education}</span>}
                </label>
                <label>
                    Academic:
                    <select
                        name="academic"
                        value={formData.academic}
                        onChange={handleChange}
                    >
                        <option value="">Select your academic area</option>
                        <option value="Science">Science</option>
                        <option value="Arts">Arts</option>
                        <option value="Commerce">Commerce</option>
                    </select>
                    {errors.academic && <span className="error">{errors.academic}</span>}
                </label>
                <label>
                    Gender:
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                    >
                        <option value="">Select your gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="error">{errors.gender}</span>}
                </label>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default Settings;