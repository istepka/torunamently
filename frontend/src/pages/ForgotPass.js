import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Popup from "./objects/Popup";

const ForgotPass = () => {
    const [email, setEmail] = useState("");
    const [popupMessage, setPopupMessage] = useState(""); 
    const [popupTitle, setPopupTitle] = useState(""); // ["Error", "Success"
    const [showPopup, setShowPopup] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmail(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8801/forgot_password", { email });
            const status = response.data.status;
            const message = response.data.message;

            if (status === "success") {
                setPopupMessage(message);
                setPopupTitle("Success, if the email exists, you will receive an email with a link to reset your password. Redirecting to login page...");
                setShowPopup(true);

                // wait 2 seconds before redirecting to login page
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);

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
        <div className="container">
            <div style={{ gridArea: "main", textAlign: "center" }}>
                <h1 className="text-center mb-4">Forgot Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group text-left" style={{ width: "40%", margin: "auto" }}>
                        <label htmlFor="email">Email:</label>
                        <input type="email" className="form-control" placeholder="Enter email" name="email" value={email} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" style={{textAlign: "left"}}>Submit</button>
                </form>
                <Popup title={popupTitle} message={popupMessage} show={showPopup} onClose={() => {setShowPopup(false)}} />
            </div>
        </div>
    );
}

export default ForgotPass;
