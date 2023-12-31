import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Popup from "./objects/Popup";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [popupMessage, setPopupMessage] = useState(""); 
    const [popupTitle, setPopupTitle] = useState(""); // ["Error", "Success"
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8801/sign_in", credentials);
            
            const status = response.data.status;
            const message = response.data.message;

            if (status === "success") {
                setPopupMessage(message + " Redirecting to home page...");
                setPopupTitle("Success");
                setShowPopup(true);

                // wait 2 seconds before redirecting to home page
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);

            } else {
                setPopupMessage(message);
                setPopupTitle("Error");
                setShowPopup(true);
            }
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupTitle("");
        setPopupMessage("");
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="mt-5 mb-4">Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">email</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>

                    <Popup title={popupTitle} message={popupMessage} show={showPopup} onClose={closePopup} />
                </div>
            </div>
        </div>
    );
}

export default Login;
