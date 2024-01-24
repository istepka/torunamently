// In Account.js
import React from 'react';
import './styles/Account.css'; // Import your custom CSS file for Account styling
import Header from './Header';

const Account = () => {
    // Fetch user details or retrieve them from the token if needed

    return (
        <div>
            <Header />
            <div className="container account-container">
                <h1 className="account-title">Welcome to Your Account!</h1>
                <div className="account-details">
                    <p className="account-label">Your email:</p>
                    <p className="account-value">{localStorage.getItem("email")}</p>
                </div>
            </div>
        </div>
    );
};

export default Account;
