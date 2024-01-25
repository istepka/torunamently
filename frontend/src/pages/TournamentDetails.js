// TournamentDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import axios from 'axios';
import EditTournamentModal from './objects/EditTorunamentModal';
import TournamentSignUpModal from './objects/TournamentSignUpModal';
import Popup from './objects/Popup';
import LadderModal from './objects/LadderModal';

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
            <div className='mt-3 mb-3'>
                <hr/>
                <h1 className="mb-4 text-center">Sponsors</h1>
                <div className="row mt-3 mb-3">
                    {sponsors.map((sponsor, index) => (
                        <div className="col-sm-4" key={sponsor.name}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{sponsor.name}</h5>
                                    <a href={'https://' + sponsor.website} className="btn btn-primary mb-2">Go to website</a>
                                    <img src={sponsor.logo} className="card-img-top" alt=""/>
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
        return (
            <div className="d-flex flex-column align-items-center">
            <h1 className="mb-4">{tournament.name}</h1>
            <div className="d-flex flex-column">
                <p className="mb-2"><strong>Discipline:</strong> {tournament.discipline}</p>
                <p className="mb-2"><strong>Time:</strong> {formatDate(tournament.time)}</p>
                <p className="mb-2"><strong>Location:</strong> {tournament.location}</p>
                
                {/* Add a container div with a fixed height and overflow-y: auto */}
                <strong>Participants:</strong>
                <div className="participants-list-container mb-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                <ol className="list-unstyled mb-0">
                    {participants.map((participant, index) => (
                    <li key={index}>{participant}</li>
                    ))}
                </ol>
                </div>

                <p className="mb-2"><strong>Participants limit:</strong> { participants.length } / {tournament.max_participants}</p>
                <p className="mb-2"><strong>Application Deadline:</strong> {formatDate(tournament.app_deadline)}</p>
                <p className="mb-2"><strong>Creator:</strong> {tournament.creator}</p>
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
    

    if (!isAuthenticated || isSignedUp) {
        console.log('User is not authenticated and not signed up: ', isAuthenticated, isSignedUp);
        return (
            <div>
                <Header />
                <div className="container mt-3 mb-3">
                    {renderTournamentDetails()}
                    <div className="d-flex justify-content-center mt-5 mb-5">
                        {renderSignUpButton(false)}
                        {renderEditButton(isCreator)}
                        {renderLadderButton()}
                    </div>
                    {renderSponsors()}
                </div>
                <EditTournamentModal onClose={toggleEditTorunamentModal} tournamentId={id} />
                <TournamentSignUpModal onClose={() => setShowSignUpModal(false)} onSignUp={handleSignUp} />
                <Popup title={popupTitle} message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} />
                <LadderModal participants={participants} onClose={() => setShowLadderModal(false)} tournament_id={id} />

            </div>
        );
    }
    else {
        console.log('User is ok');
        return (
            <div>
                <Header />
                <div className="container mt-3 mb-3">
                    {renderTournamentDetails()}
                    <div className="d-flex justify-content-center mt-5 mb-5">
                        {renderSignUpButton(true)}
                        {renderEditButton(isCreator)}
                        {renderLadderButton()}
                    </div>
                    {renderSponsors()}
                </div>
                <EditTournamentModal onClose={toggleEditTorunamentModal} tournamentId={id} />
                <TournamentSignUpModal onClose={() => setShowSignUpModal(false)} onSignUp={handleSignUp} />
                <Popup title={popupTitle} message={popupMessage} show={showPopup} onClose={() => setShowPopup(false)} />
                <LadderModal participants={participants} onClose={() => setShowLadderModal(false)} tournament_id={id} />

            </div>
        );
    }
}

export default TournamentDetails;
