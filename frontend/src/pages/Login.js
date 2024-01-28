import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Popup from "./objects/Popup";
import Header from './Header';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [popupMessage, setPopupMessage] = useState(""); 
    const [popupTitle, setPopupTitle] = useState(""); // ["Error", "Success"
    const [showPopup, setShowPopup] = useState(false);
    const [action, setAction] = useState("login"); // ["login", "sign_up"]

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
            var response = null;
            if (action === "login") {
                response = await axios.post("http://localhost:8801/sign_in", credentials);
                
                const token = response.data.token;
                if (token !== "") {
                    localStorage.setItem("token", token);
                    localStorage.setItem("email", credentials.email);
                    console.log("Token saved to local storage!");
                }

            }
            else if (action === "sign_up") {
                response = await axios.post("http://localhost:8801/sign_up", credentials);
            }

            
            const status = response.data.status;
            const message = response.data.message;

            if (status === "success") {
                setPopupMessage(message + " Redirecting to home page...");
                setPopupTitle("Success");
                setShowPopup(true);

                // wait 2 seconds before redirecting to home page
                setTimeout(() => {
                    window.location.href = "/";
                }, action === "login" ? 2000 : 5000);

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
        setCredentials({...credentials, password: ""});
    };

    return (
        <div>
            <Header />
            <div className="container">
                

                <div className="row justify-content-center" style={{ gridArea: "main" }}>
                    <div className="col-md-6">
                        <h1 className="mt-5 mb-4 text-center">{action === "login" ? "Log in" : "Sign Up"} to Tournamently</h1>
                        <form id="login-form" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
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
                            <button type="submit" className="btn btn-primary">{action === "login" ? "Login" : "Sign Up"}</button>

                            {action === "login" && (
                                <a href="/forgot_password" className="btn btn-link">Forgot password?</a>
                            )}

                        </form>

                        <button className="btn btn-secondary mt-2" onClick={() => setAction(action === "login" ? "sign_up" : "login")}>
                            {action === "login" ? "Don't have an account? Sign up here." : "Already have an account? Login here."}
                        </button>



                        <Popup title={popupTitle} message={popupMessage} show={showPopup} onClose={closePopup} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
