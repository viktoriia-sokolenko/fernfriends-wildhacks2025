import React from 'react';
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav className='menu'>
        <ul className='nav-sections'>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/profile">My Profile</Link>
            </li>
            <li>
                <Link to="/plants">Plants</Link>
            </li>
            <li>
                <Link to="/recommend">Recommendations</Link>
            </li>
            <li>
                <Link to="/signin">Sign In</Link>
            </li>
            <li>
                <Link to="/signup">Sign Up</Link>
            </li>
        </ul>
      </nav>
    );
};

export default NavBar;