import "./navbar.css"
import { FaLongArrowAltRight } from "react-icons/fa";
import {Link, useNavigate} from 'react-router-dom'
import { Logo } from "../../assets";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { FaUser } from "react-icons/fa6";

const Navbar = () => {
  const {user, dispatch} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate('/');
  }

  return (
    <div className="navbar">
      <Link to={'/'}>
        <div className="name">
        <img src={Logo} width={'30px'} height={'30px'} alt="" />
        <span className="logo" style={{fontWeight:"700"}}>Stay<span style={{color: 'white', fontWeight:'700', margin:'5px'}}>Nest</span></span>
        </div>
      </Link>
      {
        user ? <div className="navContainer">
          <div className="profile">
            <FaUser />
            <span>{user.username}</span>
          </div>
          <Link to="/bookings" style={{textDecoration: 'none'}}>
            <button className="navButton">My Bookings</button>
          </Link>
          <button className="navButton" onClick={handleLogout}>Logout</button>
        </div>
        : <div className="navContainer">
        <div className="navItems">
          <Link to="/register" style={{textDecoration: 'none', color: 'inherit'}}>
            <span>Register</span>
          </Link>
          <Link to="/login">
            <button className="navButton">Login <FaLongArrowAltRight /> </button>
          </Link>
        </div>
      </div>
      }
    </div>
  )
}

export default Navbar