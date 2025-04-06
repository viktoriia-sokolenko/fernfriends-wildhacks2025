import React from 'react';
import { Link } from "react-router-dom";
import { useAuth } from '../AuthContext';

const NavBar = () => {
    const { token, userId, handleLogout } = useAuth();
    return (
        <nav className='navbar'>
        <ul className='sections'>
        {token && userId ? (
            <>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/recommend">Recommendations</Link>
            </li>
            <li>
                <Link to="/plants">My Plants</Link>
            </li>
            <li>
                <Link to="/profile">My Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Log Out</button>
            </li>
          </>
        ) : (
            <>
            <li>
                <Link to="/signin">Sign In</Link>
            </li>
            <li>
                <Link to="/signup">Sign Up</Link>
            </li>
            </>
        )}
        </ul>
      </nav>
    );
};

export default NavBar;