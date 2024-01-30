import React, { useState, useEffect } from 'react';
import DateTimePicker from 'react-datetime-picker';
import '../styles/TournamentModal.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import axios from 'axios';
import Popup from './Popup';

const EditTournamentModal = ({ onClose, tournamentId }) => {


  
  const [tournamentData, setTournamentData] = useState({
    name: '',
    time: new Date(),
    location: '',
    discipline: '',
    geo_coordinates: '',
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
  const [popupMessage, setPopupMessage] = useState('');
  const [popupTitle, setPopupTitle] = useState(''); // ["Error", "Success"]
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Fetch existing tournament details using tournamentId
    const fetchTournamentDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:8801/get_tournament_details?id=${tournamentId}&token=${token}`
        );
        const jsonData = await response.json();
        if (jsonData.status === 'error') {
          console.log(jsonData.message);
          setPopupMessage(jsonData.message);
          setPopupTitle('Error');
          setShowPopup(true);
          return;
        }

        jsonData.data.tournament.time = new Date(jsonData.data.tournament.time);
        jsonData.data.tournament.app_deadline = new Date(jsonData.data.tournament.app_deadline);
     

        setTournamentData(jsonData.data.tournament);


        console.log(jsonData.data.tournament);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTournamentDetails();
  }, [tournamentId]);

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
    }));
  };

  const handleUpdateTournament = () => {
    console.log('Updating tournament with data:', tournamentData);

    const content = {
      tournamentData: tournamentData,
      sponsors: sponsors,
      token: localStorage.getItem('token'),
    };

    // Send data to backend for update
    axios
      .post(`http://localhost:8801/update_tournament?id=${tournamentId}`, content)
      .then((res) => {
        console.log(res.data);
        if (res.data.status === 'success') {
          // Tournament updated successfully
          setPopupMessage(res.data.message);
          setPopupTitle('Success');
          setShowPopup(true);

          // wait 2 seconds before closing the modal
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2000);


        } else {
          // Tournament update failed
          setPopupMessage(res.data.message);
          setPopupTitle('Error');
          setShowPopup(true);
        }
      })
      .catch((err) => {
        console.log(err);
        // Tournament update failed
        setPopupMessage(err.message);
        setPopupTitle('Error');
        setShowPopup(true);
      });
  };

  const handleAddSponsorClick = () => {
    setShowSponsorSection(true);
  };

  function isValidCoordinates(coordinates) {
    if (!coordinates) {
        return false;
    }
    
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


  const closeClick = () => {
    // Reset all fields
    setTournamentData({
      name: '',
      time: new Date(),
      location: '',
      discipline: '',
      geo_coordinates: '',
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
    setPopupTitle('');
    setPopupMessage('');
    onClose();
  };

  return (
    <div
      className="modal fade"
      id="editTournamentModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="editTournamentModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editTournamentModalLabel">
              Edit Tournament
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={closeClick}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
          <div className="form-group">
                            <label htmlFor="tournamentName">Tournament Name</label>
                            <input type="text" className="form-control mt-2" id="tournamentName" name="name" value={tournamentData.name} onChange={handleInputChange} />

                            <label htmlFor="tournamentDate">Tournament Date</label>
                            <DateTimePicker
                                selected={tournamentData.time}
                                onChange={(value) => handleDateChange("time", value)}
                                value={tournamentData.time}
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
                                className={`form-control ${isValidCoordinates(tournamentData.geo_coordinates) ? '' : 'is-invalid'}`}
                                id="tournamentCoordinates"
                                name="geo_coordinates"
                                value={tournamentData.geo_coordinates}
                                onChange={handleInputChange}
                            />
                            {!isValidCoordinates(tournamentData.geo_coordinates) && (
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
                                selected={tournamentData.app_deadline}
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

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateTournament}
            >
              Update Tournament
            </button>
          </div>
        </div>
      </div>

      <Popup title={popupTitle} message={popupMessage} show={showPopup} onClose={closeClick} />
    </div>
  );
};

export default EditTournamentModal;
