import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Popup from "./objects/Popup";
import Header from './Header';

// Write code for ResetPass heere
// User gets to this page by clicking on the link in the email they receive after clicking "Forgot Password" on the login page
// Link has two parameters: token and email

const ResetPass = () => {
    const [credentials, setCredentials] = useState({
        password: '',
        confirm_password: ''
    });
    const [popupMessage, setPopupMessage] = useState(""); 
    const [popupTitle, setPopupTitle] = useState(""); // ["Error", "Success"
    const [showPopup, setShowPopup] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [passwordsLenghtGood, setPasswordsLenghtGood] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));

        if (name === "password") {
            if (value.length < 8) {
                setPasswordsLenghtGood(false);
            } else {
                setPasswordsLenghtGood(true);
            }
        }

        if (name === "confirm_password") {
            if (credentials.password !== value) {
                setPasswordsMatch(false);
            } else {
                setPasswordsMatch(true);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Field value verification
        if (credentials.password.length < 8) {
            setPopupMessage("Password must be at least 8 characters long.");
            setPopupTitle("Error");
            setShowPopup(true);
            return;
        }
    
        if (credentials.password !== credentials.confirm_password) {
            setPopupMessage("Passwords do not match.");
            setPopupTitle("Error");
            setShowPopup(true);
            return;
        }
    
        try {
            const token = window.location.href.split("?")[1].split("&")[1].split("=")[1];
            const email = window.location.href.split("?")[1].split("&")[0].split("=")[1];

            console.log(token, email);
    
            const response = await axios.post("http://localhost:8801/reset_password", { token, email, password: credentials.password });
            const status = response.data.status;
            const message = response.data.message;
    
            if (status === "success") {
                setPopupMessage(message + " Redirecting to login page in 10 sec...");
                setPopupTitle("Success");
                setShowPopup(true);
    
                // wait 2 seconds before redirecting to login page
                setTimeout(() => {
                    window.location.href = "/login";
                }, 10000);
    
            } else {
                setPopupMessage(message);
                setPopupTitle("Error");
                setShowPopup(true);
            }
        } catch (err) {
            console.log(err);
    
            setPopupMessage("Something went wrong. Please try again.");
            setPopupTitle("Error");
            setShowPopup(true);
        }
    };
    

    return (
        <div>
            <Header />
            <div className="container mt-4">
                <div style={{ gridArea: "main", textAlign: "center" }}>
                    <h1 className="text-center mb-4">Reset Password</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group text-left mb-4" style={{ width: "40%", margin: "auto" }}>
                            <label htmlFor="password">Password:</label>
                            <input type="password" className="form-control" placeholder="Enter password" name="password" value={credentials.password} onChange={handleChange} required />
                            { passwordsMatch ? null : <p className="text-danger">Passwords do not match.</p> }
                            { passwordsLenghtGood ? null : <p className="text-danger">Password must be at least 8 characters long.</p> }
                        </div>
                        <div className="form-group text-left" style={{ width: "40%", margin: "auto" }}>
                            <label htmlFor="confirm_password">Confirm Password
                            </label>
                            <input type="password" className="form-control" placeholder="Confirm password" name="confirm_password" value={credentials.confirm_password} onChange={handleChange} required />
                        </div>
                        <button type="submit" className="btn btn-primary mt-4" style={{textAlign: "left"}}>Submit</button>
                    </form>
                    <Popup title={popupTitle} message={popupMessage} show={showPopup} onClose={() => {setShowPopup(false)}} />
                </div>
            </div>
        </div>
    );
}

export default ResetPass;
