// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Header.css';

const Header = () => {
    return (
        <div className="header-container">
            <Link to="/" className="logo-link">
                <img className="logo" src="./logo192.png" alt="Logo" width="30" height="30" />
                <span className="website-name">Tournamently</span>
            </Link>
        </div>
    );
};

export default Header;
