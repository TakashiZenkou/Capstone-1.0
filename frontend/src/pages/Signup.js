import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';

function Signup() {
    const [values, setValues] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        education: '',
        gender: '',
        academic: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    };

    const handleDropdown = (event, key) => {
        setValues(prev => ({ ...prev, [key]: event.target.textContent }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            axios.post('http://localhost:8081/signup', values)
                .then(res => {
                    navigate('/');
                })
                .catch(err => console.log(err));
        }
    };

    useEffect(() => {
        const dropdowns = document.querySelectorAll('.dropdown');
        const dropdownContents = document.querySelectorAll('.dropdown-content');
        const dropdownLinks = document.querySelectorAll('.dropdown-content a');

        const handleMouseEnter = (content) => {
            content.style.display = 'block';
        };

        const handleMouseLeave = (content) => {
            content.style.display = 'none';
        };

        const handleLinkMouseEnter = (event) => {
            event.target.style.backgroundColor = '#f1f1f1';
        };

        const handleLinkMouseLeave = (event) => {
            event.target.style.backgroundColor = '#f9f9f9';
        };

        dropdowns.forEach((dropdown, index) => {
            const content = dropdownContents[index];
            dropdown.addEventListener('mouseenter', () => handleMouseEnter(content));
            dropdown.addEventListener('mouseleave', () => handleMouseLeave(content));
        });

        dropdownLinks.forEach(link => {
            link.addEventListener('mouseenter', handleLinkMouseEnter);
            link.addEventListener('mouseleave', handleLinkMouseLeave);
        });

        return () => {
            dropdowns.forEach((dropdown, index) => {
                const content = dropdownContents[index];
                dropdown.removeEventListener('mouseenter', () => handleMouseEnter(content));
                dropdown.removeEventListener('mouseleave', () => handleMouseLeave(content));
            });

            dropdownLinks.forEach(link => {
                link.removeEventListener('mouseenter', handleLinkMouseEnter);
                link.removeEventListener('mouseleave', handleLinkMouseLeave);
            });
        };
    }, []);

    return (
        <div className='d-flex vh-100 justify-content-center align-items-center bg-primary'>
            <div className='p-3 bg-white rounded w-25'>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="firstname"><strong>First Name</strong></label>
                        <input
                            type="text"
                            placeholder='Enter First Name'
                            name='firstname'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.firstname && <span className='text-danger'>{errors.firstname}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="lastname"><strong>Last Name</strong></label>
                        <input
                            type="text"
                            placeholder='Enter Last Name'
                            name='lastname'
                            onChange={handleInput}
                            className='form-control rounded-0'
                        />
                        {errors.lastname && <span className='text-danger'>{errors.lastname}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="username"><strong>Username</strong></label>
                        <input
                            type="text"
                            placeholder='Enter Username'
                            name='username'
                            onChange={handleInput}
                            className='form-control rounded-0'
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
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="education"><strong>Educational Level</strong></label>
                        <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                                type="button"
                                name= "education"
                                className="dropbtn w-100 rounded-0"
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    padding: '10px',
                                    fontSize: '16px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {values.education || "Select Education Level"}
                            </button>
                            <div
                                className="dropdown-content"
                                style={{
                                    display: 'none',
                                    position: 'absolute',
                                    backgroundColor: '#f9f9f9',
                                    minWidth: '160px',
                                    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                                    zIndex: 1
                                }}
                            >
                                <a href="#" onClick={(e) => handleDropdown(e, 'education')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Primary</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'education')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Secondary</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'education')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Tertiary</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'education')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Bachelor's</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'education')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Master's</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'education')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Doctoral</a>
                            </div>
                        </div>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="academic"><strong>Academic Interest</strong></label>
                        <div className="dropdown" style={{ position: 'relative', display: 'inline-block' }}>
                            <button
                                type="button"
                                name='academic'
                                className="dropbtn w-100 rounded-0"
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    padding: '10px',
                                    fontSize: '16px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                {values.academic || "Select Academic Interest"}
                            </button>
                            <div
                                className="dropdown-content"
                                style={{
                                    display: 'none',
                                    position: 'absolute',
                                    backgroundColor: '#f9f9f9',
                                    minWidth: '160px',
                                    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
                                    zIndex: 1
                                }}
                            >
                                <a href="#" onClick={(e) => handleDropdown(e, 'academic')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Engineering</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'academic')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Human & Education</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'academic')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Law</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'academic')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Medical Sciences</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'academic')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Science & Technology</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'academic')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Social Sciences</a>
                                <a href="#" onClick={(e) => handleDropdown(e, 'academic')} style={{ color: 'black', padding: '12px 16px', textDecoration: 'none', display: 'block' }}>Sport</a>
                            </div>
                        </div>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="gender"><strong>Gender</strong></label><br />
                        <input type="radio" name="gender" value="Male" onChange={handleInput} /> Male<br />
                        <input type="radio" name="gender" value="Female" onChange={handleInput} /> Female<br />
                        <input type="radio" name="gender" value="Rather not say" onChange={handleInput} /> Rather not say
                    </div>
                    <button type='submit' className='btn btn-success w-100 rounded-0'><strong>Sign up</strong></button>
                    <p>You have agreed to our terms and conditions</p>
                    <Link to="/" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Log in</Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;