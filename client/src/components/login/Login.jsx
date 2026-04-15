import { useContext, useState } from 'react'
import './login.css'
import { AuthContext } from '../../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined
    })
    const navigate = useNavigate()
    const { loading, error, dispatch} = useContext(AuthContext);

    const handleChange = (e) =>{
        setCredentials((prev)=>(
            {...prev ,[e.target.id]: e.target.value}
        ));
        console.log(credentials); // Debugging line to track credentials state
    }
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        console.log("Submitting credentials:", credentials); // Check the credentials being submitted
        dispatch({type: "LOGIN_START"});
        try {
            const response = await axios.post('/api/auth/login', credentials);
            // console.log("Response data:", response.data); // Log the response from the server
            const userData = { ...response.data.details, token: response.data.token };
            dispatch({type: "LOGIN_SUCCESS", payload: userData});
            navigate('/')
        } catch (error) {
            console.error("Login error:", error); // Log the error
            const message = error.response?.data?.message || error.response?.data || error.message || "Something went wrong";
            dispatch({type: "LOGIN_FAILURE", payload: message});
        }
    }
    
  return (
    <div className='login-page'>
        <div className='container'>
            <form className='form' onSubmit={handleSubmit}>
            <h2 className='head'>LOG IN</h2>
            <input type="text"
                placeholder='username'
                id='username'
                className='lInput'
                value={credentials.username || ''}
                onChange={handleChange}
            />
            <input type="password"
                placeholder='password'
                id='password'
                className='lInput'
                value={credentials.password || ''}
                onChange={handleChange}
            />
            <button disabled={loading} type="submit" className='lButton'>Log in</button>
            {
              error && <span className='error'>{typeof error === 'string' ? error : error?.message || JSON.stringify(error)}</span>
            }
            </form>

        </div>
    </div>
  )
}

export default Login