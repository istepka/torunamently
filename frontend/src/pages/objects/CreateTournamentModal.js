import React, { useState } from 'react';
import DateTimePicker from 'react-datetime-picker'; // Import the datetime picker library
import '../styles/TournamentModal.css'
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import axios from 'axios';
import Popup from "./Popup";

const CreateTournamentModal = ({ onClose }) => {
    const [tournamentData, setTournamentData] = useState({
        name: '',
        date: new Date(),
        location: '',
        discipline: '',
        coordinates: '',
        max_participants: 0,
        app_deadline: new Date(),
        creator: localStorage.getItem('email'),
    });

    const [sponsors, setSponsors] = useState({
        name: '',
        website: '',
        logo: '',
    });

    const [showSponsorSection, setShowSponsorSection] = useState(false);
    const [popupMessage, setPopupMessage] = useState(""); 
    const [popupTitle, setPopupTitle] = useState(""); // ["Error", "Success"
    const [showPopup, setShowPopup] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTournamentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

    };

    const handleDateChange = (name, value) => {
        setTournamentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSponsorInputChange = (e) => {
        const { name, value } = e.target;
        setSponsors((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    };

    const handleCreateTournament = () => {
        console.log('Creating tournament with data:', tournamentData);

        const content = {
            tournamentData: tournamentData,
            sponsors: sponsors,
            token: localStorage.getItem('token'),
        };

        // Send data to backend
        axios.post('http://localhost:8801/create_tournament', content)
            .then(res => {
                console.log(res.data);
                if (res.data.status === "success") {
                    // Tournament created successfully
                    setPopupMessage(res.data.message);
                    setPopupTitle("Success");
                    setShowPopup(true);

                    // wait 2 seconds before redirecting to home page
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                } else {
                    // Tournament creation failed
                    setPopupMessage(res.data.message);
                    setPopupTitle("Error");
                    setShowPopup(true);
                }
            })
            .catch(err => {
                console.log(err);  
                // Tournament creation failed
                setPopupMessage(err.message);
                setPopupTitle("Error");
                setShowPopup(true);
            })
        onClose();
    };

    const handleAddSponsorClick = () => {
        setShowSponsorSection(true);
    };

    const closeClick = () => {
        // Reset all fields
        setTournamentData({
            name: '',
            date: new Date(),
            location: '',
            discipline: '',
            coordinates: '',
            max_participants: 0,
            app_deadline: new Date(),
            creator: localStorage.getItem('email'),
        });
        setSponsors({
            name: '',
            website: '',
            logo: '',
        });
        setShowSponsorSection(false);
        setShowPopup(false);
        setPopupTitle("");
        setPopupMessage("");
        onClose();
    }

    function isValidCoordinates(coordinates) {
        // if empty string, return true
        if (coordinates.trim() === "") {
            return true;
        }

        // Regular expression to match latitude and longitude format: [latitude, longitude]
        const coordinatesRegex = /^\s*-?([0-8]?[0-9]|90)\.[0-9]{1,6}\s*,\s*-?((1?[0-7]?|[0-9]?)[0-9]|180)\.[0-9]{1,6}\s*$/;
        return coordinatesRegex.test(coordinates.trim());
    }

    const isValidInput = (value) => {
        return value.length >= 3 || value.trim() === "";
    };
    



    return (
        <div className="modal fade" id="createTournamentModal" tabIndex="-1" role="dialog" aria-labelledby="createTournamentModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="createTournamentModalLabel">Create Tournament</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeClick}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <div className="form-group">
                            <label htmlFor="tournamentName">Tournament Name</label>
                            <input 
                                type="text"
                                className={`form-control ${isValidInput(tournamentData.name) ? '' : 'is-invalid'}`}
                                id="tournamentName"
                                name="name"
                                value={tournamentData.name}
                                onChange={handleInputChange}
                            />
                            {!isValidInput(tournamentData.name) && (
                                <div className="invalid-feedback">
                                    Please enter a name at least 3 characters long
                                </div>
                            )}

                            <label htmlFor="tournamentDate">Tournament Date</label>
                            <DateTimePicker
                                onChange={(value) => handleDateChange("date", value)}
                                value={tournamentData.date}
                                className="mt-2 mb-2 full-width"
                            />

                            <label htmlFor="tournamentLocation">Tournament Location</label>
                            <input 
                                type="text"
                                className={`form-control ${isValidInput(tournamentData.location) ? '' : 'is-invalid'}`}
                                id="tournamentLocation"
                                name="location"
                                value={tournamentData.location}
                                onChange={handleInputChange}
                            />
                            {!isValidInput(tournamentData.location) && (
                                <div className="invalid-feedback">
                                    Please enter a location at least 3 characters long
                                </div>
                            )}

                            <label htmlFor="tournamentDiscipline">Tournament Discipline</label>
                            <input 
                                type="text" 
                                className="form-control ${isValidInput(tournamentData.discipline) ? '' : 'is-invalid'}"
                                id="tournamentDiscipline" 
                                name="discipline" 
                                value={tournamentData.discipline} onChange={handleInputChange} 
                                />
                            {!isValidInput(tournamentData.discipline) && (
                                <div className="invalid-feedback">
                                    Please enter a valid discipline name (at least 3 characters long)
                                </div>
                            )}

                            <label htmlFor="tournamentCoordinates">Tournament Geo Coordinates</label>
                            <input 
                                type="text"
                                className={`form-control ${isValidCoordinates(tournamentData.coordinates) ? '' : 'is-invalid'}`}
                                id="tournamentCoordinates"
                                name="coordinates"
                                value={tournamentData.coordinates}
                                onChange={handleInputChange}
                            />
                            {!isValidCoordinates(tournamentData.coordinates) && (
                                <div className="invalid-feedback">
                                    Please enter valid geo coordinates (latitude, longitude), e.g., 40.7128, -74.0060
                                </div>
                            )}

                            <label htmlFor="tournamentMaxParticipants">Tournament Max Participants</label>
                            <select
                                id="tournamentMaxParticipants"
                                name="max_participants"
                                value={tournamentData.max_participants}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="4">4</option>
                                <option value="8">8</option>
                                <option value="16">16</option>
                                <option value="32">32</option>
                                <option value="64">64</option>
                            </select>


                            <label htmlFor="tournamentAppDeadline">Tournament Application Deadline</label>
                            <DateTimePicker
                                onChange={(value) => handleDateChange("app_deadline", value)}
                                value={tournamentData.app_deadline}
                                className="mt-2 mb-2 full-width"
                            />

                            <label htmlFor="tournamentCreator">Tournament Creator</label>
                            <input type="text" className="form-control" id="tournamentCreator" name="creator" value={tournamentData.creator} readOnly />
                        </div>

                        <hr className='mt-4 mb-4' />

                        {showSponsorSection && (
                            <div className="form-group">
                                <label htmlFor="sponsorName">Sponsor Name</label>
                                <input type="text" className="form-control mt-2" id="sponsorName" name="name" value={sponsors.name} onChange={handleSponsorInputChange} />
                                <label htmlFor="sponsorWebsite">Sponsor Website</label>
                                <input type="text" className="form-control mt-2" id="sponsorWebsite" name="website" value={sponsors.website} onChange={handleSponsorInputChange} />
                                <label htmlFor="sponsorLogo">Sponsor Logo</label>
                                <input type="text" className="form-control" id="sponsorLogo" name="logo" value={sponsors.logo} onChange={handleSponsorInputChange} />
                            </div>
                        )}

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeClick}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleCreateTournament}>Create Tournament</button>
                        {!showSponsorSection && (
                            <button type="button" className="btn btn-info" onClick={handleAddSponsorClick}>Add Sponsor?</button>
                        )}
                    </div>
                </div>
            </div>

            <Popup title={popupTitle} message={popupMessage} show={showPopup} onClose={closeClick} />
        </div>
    );
};

export default CreateTournamentModal;
