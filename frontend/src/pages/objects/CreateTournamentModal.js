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
                            <input type="text" className="form-control mt-2" id="tournamentName" name="name" value={tournamentData.name} onChange={handleInputChange} />

                            <label htmlFor="tournamentDate">Tournament Date</label>
                            <DateTimePicker
                                onChange={(value) => handleDateChange("date", value)}
                                value={tournamentData.date}
                                className="mt-2 mb-2 full-width"
                            />

                            <label htmlFor="tournamentLocation">Tournament Location</label>
                            <input type="text" className="form-control" id="tournamentLocation" name="location" value={tournamentData.location} onChange={handleInputChange} />

                            <label htmlFor="tournamentDiscipline">Tournament Discipline</label>
                            <input type="text" className="form-control" id="tournamentDiscipline" name="discipline" value={tournamentData.discipline} onChange={handleInputChange} />

                            <label htmlFor="tournamentCoordinates">Tournament Geo Coordinates</label>
                            <input type="text" className="form-control" id="tournamentCoordinates" name="coordinates" value={tournamentData.coordinates} onChange={handleInputChange} />

                            <label htmlFor="tournamentMaxParticipants">Tournament Max Participants</label>
                            <input type="number" className="form-control" 
                                id="tournamentMaxParticipants" name="max_participants" 
                                value={tournamentData.max_participants} onChange={handleInputChange} min="0" max="1000" 
                                onKeyPress={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />

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
