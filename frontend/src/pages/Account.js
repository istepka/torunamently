// In Account.js
import React from 'react';
import './styles/Account.css'; // Import your custom CSS file for Account styling
import Header from './Header';

const Account = () => {
    // Fetch user details or retrieve them from the token if needed

    function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "/";
    }

    return (
        <div>
            <Header />
            <div className="container account-container">
                <h1 className="account-title">Welcome to Your Account!</h1>
                <div className="account-details">
                    <p className="account-label">Your email:</p>
                    <p className="account-value">{localStorage.getItem("email")}</p>
                </div>
                
                <button className="btn btn-danger" onClick={logOut}>Log Out</button>
            </div>
        </div>
    );
};

export default Account;
