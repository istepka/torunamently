// In Account.js
import React, { useState, useEffect } from 'react';
import './styles/Account.css'; // Import your custom CSS file for Account styling
import Header from './Header';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Account = () => {
    const [createdTournaments, setCreatedTournaments] = useState([]);
    const [participatedTournaments, setParticipatedTournaments] = useState([]);

    useEffect(() => {
        const getListOfTournamentsUserCreated = () => {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");

            axios.get(`http://localhost:8801/get_list_of_tournaments_user_created?token=${token}&email=${email}`)
                .then(res => {
                    if (res.data.status === "success") {
                        setCreatedTournaments(res.data.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }

        const getListOfTournamentsUserIsSignedUpTo = () => {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");

            axios.get(`http://localhost:8801/get_full_list_of_tournaments_user_is_signed_up_to?token=${token}&email=${email}`)
                .then(res => {
                    if (res.data.status === "success") {
                        setParticipatedTournaments(res.data.data);
                        console.log(res.data.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }

        getListOfTournamentsUserCreated();
        getListOfTournamentsUserIsSignedUpTo();
    }, []);

    function logOut() {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "/";
    }

    return (
        <div>
            <Header />
            <div className="container account-container">
                <h1 className="account-title">Welcome to Your Account!</h1>
                <div className="account-details">
                    <p className="account-label">Your email:</p>
                    <p className="account-value">{localStorage.getItem("email")}</p>
                </div>
                
                <button className="btn btn-danger logout-button" onClick={logOut}>
                    Log Out
                </button>

                <div className="own-tournaments mt-4 mb-4">
                    <h2>Created Tournaments</h2>
                    <table className="table table-sm table-striped table-hover table-bordered">
                        <thead className="thead-dark center-titles sticky-top">
                            <tr>
                                <th>Tournament Name</th>
                                <th>Location</th>
                                <th>Start Date</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {createdTournaments.map(tournament => (
                                <tr key={tournament.id} scope="row">
                                    <td>{tournament.name}</td>
                                    <td>{tournament.location}</td>
                                    <td>{tournament.time}</td>
                                    <td>
                                        <Link 
                                            to={`/tournament-details/${tournament.id}`}
                                            className="btn btn-outline-primary btn-sm"
                                        >Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="own-tournaments mt-4">
                    <h2>Participating in tournaments</h2>
                    <table className="table table-sm table-striped table-hover table-bordered">
                        <thead className="thead-dark center-titles sticky-top">
                            <tr>
                                <th>Tournament Name</th>
                                <th>Location</th>
                                <th>Start Date</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {participatedTournaments.map(tournament => (
                                <tr key={tournament.id}>
                                    <td>{tournament.name}</td>
                                    <td>{tournament.location}</td>
                                    <td>{tournament.time}</td>
                                    <td>
                                    <Link 
                                        to={`/tournament-details/${tournament.id}`}
                                        className="btn btn-outline-primary btn-sm"
                                    >Details</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Account;
