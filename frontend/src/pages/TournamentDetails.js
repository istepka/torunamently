// TournamentDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import EditTournamentModal from './objects/EditTorunamentModal';
import TournamentSignUpModal from './objects/TournamentSignUpModal';
import { SystemPopup } from './objects/Popup';
import LadderModal from './objects/LadderModal';
import './styles/TournamentDetails.css';
// import marker from '../../Assets/icons/Location.svg';
// import { Icon } from 'leaflet'

// const myIcon = new Icon({
//  iconUrl: marker,
//  iconSize: [32,32]
// })



const TournamentDetails = () => {
    // Use the useParams hook to get the id from the URL
    const { id } = useParams();

    const [tournament, setTournament] = useState({});
    const [sponsors, setSponsors] = useState([]);
    const [participants, setParticipants] = useState([]); 
    const [problem, setProblem] = useState("");
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showLadderModal, setShowLadderModal] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupTitle, setPopupTitle] = useState(''); // ["Error", "Success"]
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchTournamentDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8801/get_tournament_details?id=${id}&token=${token}`);
                const jsonData = await response.json();
                if (jsonData.status === "error") {
                    alert(jsonData.message);
                    setProblem(jsonData.message);
                    return;
                }
                setTournament(jsonData.data.tournament);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchTournamentDetails();

        const fetchSponsors = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8801/get_tournament_sponsors?id=${id}&token=${token}`);
                const jsonData = await response.json();
                
                if (jsonData.status === "error") {
                    alert(jsonData.message);
                    setProblem(jsonData.message);
                    return;
                }
                setSponsors(jsonData.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchSponsors();

        const fetchParticipants = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`http://localhost:8801/get_tournament_participants?id=${id}&token=${token}`);
                const jsonData = await response.json();

                if (jsonData.status === "error") {
                    alert(jsonData.message);
                    setProblem(jsonData.message);
                    return;
                }
                setParticipants(jsonData.data);
            }
            catch (err) {
                console.log(err);
            }
        }

        fetchParticipants();

        const checkIfSignedUpToTournament = async () => {
            try {
                const token = localStorage.getItem("token");
                const email = localStorage.getItem("email");
    
                const response = await axios.post(`http://localhost:8801/check_if_signed_up_to_tournament`, {
                    token: token,
                    email: email,
                    tournamentId: id
                });
    
                if (response.data.status === "success" && response.data.data === true) {
                    return true;
                }
    
                return false;
            } catch (err) {
                console.log(err);
                return false;
            }
        }
    
        const checkIfUserIsTournamentCreator = async () => {
            try {
                const token = localStorage.getItem("token");
                const email = localStorage.getItem("email");
    
                const response = await axios.post(`http://localhost:8801/check_if_user_is_tournament_creator`, {
                    token: token,
                    email: email,
                    tournamentId: id
                });
    
                if (response.data.status === "success" && response.data.data === true) {
                    return true;
                }
    
                return false;
            } catch (err) {
                console.log(err);
                return false;
            }
        }

        const checkIfUserIsAuthenticated = async () => {
            try {
                const token = localStorage.getItem("token");
        
                const response = await axios.post(`http://localhost:8801/check_if_user_is_logged_in`, { token: token });
        
                if (response.data.status === "success") {
                    console.log('User is authenticated ', response.data.status);
                    return true;
                }
                return false;
            } catch (err) {
                console.log(err);
                return false;
            }
        }
        
      
        const fetchData = async () => {
            try {
                const [signedUpResult, creatorResult, isAuthenticatedResult] = await Promise.all([
                    checkIfSignedUpToTournament(),
                    checkIfUserIsTournamentCreator(),
                    checkIfUserIsAuthenticated(),
                ]);
                
                console.log('fetchData: ', signedUpResult, creatorResult, isAuthenticatedResult);
                setIsSignedUp(signedUpResult);
                setIsCreator(creatorResult);
                setIsAuthenticated(isAuthenticatedResult);
            } catch (err) {
                console.log(err);
            }
        };
    
        fetchData();
    }, [id, setTournament, setSponsors, setIsSignedUp, setShowEditModal]);
    

    const handleSignUp = ({ licenseNumber, currentRanking }) => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");

        axios.post(`http://localhost:8801/sign_up_to_tournament`, { 
            token: token, 
            email: email, 
            tournamentId: id,
            licenseNumber: licenseNumber,
            currentRanking: currentRanking
        })
            .then(res => {
                // only if success
                if (res.data.status === "success") {
                    setIsSignedUp(true);

                    // close modal
                    setShowSignUpModal(false);

                    // show popup
                    setPopupMessage(res.data.message);
                    setPopupTitle('Success');
                    setShowPopup(true);
                } else {
                    // show popup
                    setPopupMessage(res.data.message);
                    setPopupTitle('Error');
                    setShowPopup(true);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    function toggleEditTorunamentModal() {
        setShowEditModal(!showEditModal);

        // refr
    }

    function renderSignUpButton(show = true) {
        if (!show) {
            return (
                <button type="button" className="btn btn-primary" disabled>Sign Up</button>
            );
        } else {
            return (
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#signUpModal">Sign Up</button>
            );
        }
    }

    function renderSponsors() {
        return (
            <div className='mt-3 mb-3 sponsors-container'>
                <hr/>
                <h1 className="mb-4 text-center">Sponsors</h1>
                <div className="row mt-3 mb-3 ">
                    {sponsors.map((sponsor, index) => (
                        <div className="col-sm-4 mr-2 mt-2 sponsor-card" key={sponsor.name}>
                            <div className=" sponsor-div" >
                                <div className="card-body">
                                    <h5 className="card-title">{sponsor.name}</h5>
                                    <a href={'https://' + sponsor.website} className="btn mb-2">
                                        <img src={sponsor.logo} className="card-img-top mb-2" alt="..."/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    

    function formatDate(date) {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const day = dateObj.getDate();
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const seconds = dateObj.getSeconds();
        const formattedDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
        return formattedDate;
    }

    function renderTournamentDetails() {

        var geo_coordinates_parsed = tournament.geo_coordinates ? tournament.geo_coordinates.split(',') : null;
        console.log('geo_coordinates_parsed: ', geo_coordinates_parsed);
        // check if geo_coordinates_parsed is valid
        const isGeoCoordinatesValid = geo_coordinates_parsed 
                                        && geo_coordinates_parsed.length === 2 
                                        && !isNaN(geo_coordinates_parsed[0]) 
                                        && !isNaN(geo_coordinates_parsed[1]);

        console.log('isGeoCoordinatesValid: ', isGeoCoordinatesValid);

        // to float
        if (isGeoCoordinatesValid){
            geo_coordinates_parsed = geo_coordinates_parsed.map(parseFloat);  
        }

        var position = isGeoCoordinatesValid ? [geo_coordinates_parsed[0], geo_coordinates_parsed[1]] : [0, 0];
        //Convert to array of floats
        position = position.map(parseFloat);
        console.log('position: ', position, typeof(position[0]), typeof(position[1]), typeof(position));
        return (
            <div className='tournament-details-container'>
                <div className="tournament-details m-2">
                    <h1 className="mb-4">{tournament.name}</h1>
                    <p className="mb-2"><strong>Discipline:</strong> {tournament.discipline}</p>
                    <p className="mb-2"><strong>Time:</strong> {formatDate(tournament.time)}</p>
                    <p className="mb-2"><strong>Location:</strong> {tournament.location}</p>
                    <p className="mb-2"><strong>Geo Location:</strong> {tournament.geo_coordinates}</p>
                    <p className="mb-2"><strong>Participants limit:</strong> { participants.length } / {tournament.max_participants}</p>
                    <p className="mb-2"><strong>Application Deadline:</strong> {formatDate(tournament.app_deadline)}</p>
                    <p className="mb-2"><strong>Creator:</strong> {tournament.creator}</p>
                </div>

                <div className='map-container m-2'>
                    <h2 className="mb-3 text-center">Map</h2>
                    { isGeoCoordinatesValid ? (
                        <MapContainer center={position} zoom={position ? 1 : 15} scrollWheelZoom={true} style={{ height: '80%', width: '100%' }}>
                            <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={position}>
                            <Popup>
                                Tournament Location <br /> {tournament.location}
                            </Popup>
                            </Marker>
                        </MapContainer>
                    ) : (
                        <div className="alert alert-danger" role="alert">
                            Invalid Geo Coordinates <br /> Coordinates: {tournament.geo_coordinates} <br /> Please contact the tournament creator.
                        </div>
                    )
                    }
                </div>
                <div className='participants-list m-2'>
                    <h2>Participants</h2>
                    <ol className="list-unstyled mb-0">
                        {participants.map((participant, index) => (
                        <li key={index}>{participant}</li>
                        ))}
                    </ol>
                </div>
            </div>

        );
    }

    function renderEditButton(owner = false) {
        if (owner) {
            return (
                <button type="button" className="btn btn-primary ml-2" data-toggle="modal" data-target="#editTournamentModal">Edit</button>
            );
        } else {
            return (
                <button type="button" className="btn btn-primary ml-2" disabled>Edit</button>
            );
        }
    }

    function renderLadderButton() {
        return (
            <button type="button" className="btn btn-primary ml-2" data-toggle="modal" data-target="#ladderModal">
            Ladder
          </button>
          
        );
    }
    

    if ((!isAuthenticated || isSignedUp) && tournament) {
        console.log('User is not authenticated and not signed up: ', isAuthenticated, isSignedUp);
        return (
            <div>
                <Header />
                <div className="container mt-3 mb-3">
                    {renderTournamentDetails()}
                    <div className="d-flex justify-content-center mt-5 mb-5 tournament-details-buttons">
                        {renderSignUpButton(false)}
                        {renderEditButton(isCreator)}
                        {renderLadderButton()}
                    </div>
                    {sponsors.length > 0 && renderSponsors()}
                </div>
                <EditTournamentModal onClose={toggleEditTorunamentModal} tournamentId={id} />
                <TournamentSignUpModal onClose={() => setShowSignUpModal(false)} onSignUp={handleSignUp} />
                <SystemPopup title={popupTitle} message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} />
                <LadderModal participants={participants} onClose={() => setShowLadderModal(false)} tournament_id={id} />

            </div>
        );
    }
    else {
        console.log('User is ok');
        return (
            <div>
                <Header />
                <div className="container container-t mt-3 mb-3 ">
                        <div>
                            {renderTournamentDetails()}
                            <div className="tournament-details-buttons mt-2 mb-2">
                                {renderSignUpButton(true)}
                                {renderEditButton(isCreator)}
                                {renderLadderButton()}
                            </div>
                            { sponsors.length > 0 && renderSponsors() }
                        </div>
                </div>
                <EditTournamentModal onClose={toggleEditTorunamentModal} tournamentId={id} />
                <TournamentSignUpModal onClose={() => setShowSignUpModal(false)} onSignUp={handleSignUp} />
                <SystemPopup title={popupTitle} message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} />
                <LadderModal participants={participants} onClose={() => setShowLadderModal(false)} tournament_id={id} />

            </div>
        );
    }
}

export default TournamentDetails;
