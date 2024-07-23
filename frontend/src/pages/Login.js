import React, {useState} from 'react'
import {Link,useNavigate } from 'react-router-dom' 
import 'bootstrap/dist/css/bootstrap.min.css'
import Validation from './LoginValidation';
import axios  from 'axios';

function Login (){
    const [values, setValues] = useState({
        username: '',
        password: ''
    })
    const navigate = useNavigate();
    const[errors, setErrors] = useState({})
    const handleInput = (event) => {
        setValues(prev =>({...prev, [event.target.name]: [event.target.value]}));
    }
    const handleSubmit= (event) => {
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.username === "" && errors.password === ""){
            axios.post('http://localhost:8081/login', values)
            .then(res  => {
                if(res.data === "Success"){
                    navigate('/home');
                }else{
                    alert("No record existed")
                }
                
            })
            .catch(err => console.log(err));
        }
    }

  return (
    <div className='d-flex vh-100 justify-content-center align-items-center bg-primary'>
        <div className='p-3 bg-white rounded w-25'>
            <h2>Sign In</h2>
            <form action ="" onSubmit={handleSubmit}>
                <div className= 'mb-3'>
                    <label htmlFor="username"><strong>Username</strong></label>
                    <input type="username" placeholder='Enter Username' name='username' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.username && <span className='text-danger'>{errors.username}</span>}
                </div>
                <div className= 'mb-3'>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder='Enter Password' name='password' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.password && <span className='text-danger'>{errors.password}</span>}
                </div>
                <button type ='submit'className='btn btn-success w-100 rounded-0'><strong>Log in</strong></button>
                <p>You have agreed to our terms and conditions</p>
                <Link to="/signup" className='btn btn-default border w-100 bg-light rounded-0 text-decoration-none'>Create Account</Link>
            </form>
        </div>
    </div>
  );
};

export default Login;
