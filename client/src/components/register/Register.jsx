import { useContext, useState } from 'react'
import './register.css'
import { AuthContext } from '../../context/AuthContext'
import {useNavigate, Link} from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: undefined,
        email: undefined,
        password: undefined,
        country: undefined,
        city: undefined,
        phone: undefined
    })
    const navigate = useNavigate()
    const { loading, error, dispatch} = useContext(AuthContext);

    const handleChange = (e) =>{
        setCredentials((prev)=>(
            {...prev ,[e.target.id]: e.target.value}
        ));
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        dispatch({type: "LOGIN_START"});
        try {
            const response = await axios.post('/api/auth/register', credentials);
            console.log("Registration successful:", response.data);
            const userData = { ...response.data.details, token: response.data.token };
            dispatch({type: "LOGIN_SUCCESS", payload: userData});
            navigate('/');
        } catch (error) {
            console.error("Registration error:", error);
            console.error("Registration error response:", error.response?.data);
            const message = error.response?.data?.message || error.response?.data || error.message || "Something went wrong";
            dispatch({type: "LOGIN_FAILURE", payload: message});
        }
    }

  return (
    <div className='login-page'>
        <div className='container'>
            <form className='form' onSubmit={handleSubmit}>
            <h2 className='head'>REGISTER</h2>
            <input type="text"
                placeholder='username'
                id='username'
                className='lInput'
                value={credentials.username || ''}
                onChange={handleChange}
                required
            />
            <input type="email"
                placeholder='email'
                id='email'
                className='lInput'
                value={credentials.email || ''}
                onChange={handleChange}
                required
            />
            <input type="password"
                placeholder='password'
                id='password'
                className='lInput'
                value={credentials.password || ''}
                onChange={handleChange}
                required
            />
            <input type="text"
                placeholder='country'
                id='country'
                className='lInput'
                value={credentials.country || ''}
                onChange={handleChange}
                required
            />
            <input type="text"
                placeholder='city'
                id='city'
                className='lInput'
                value={credentials.city || ''}
                onChange={handleChange}
                required
            />
            <input type="text"
                placeholder='phone'
                id='phone'
                className='lInput'
                value={credentials.phone || ''}
                onChange={handleChange}
                required
            />
            <button disabled={loading} type="submit" className='lButton'>Register</button>
            {error && <span className='error'>{typeof error === 'string' ? error : error?.message || JSON.stringify(error)}</span>}
            <Link to="/login" className='register-link'>
                Already have an account? Login here
            </Link>
            </form>
        </div>
    </div>
  )
}

export default Register