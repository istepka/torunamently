import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Header from './Header';
import { Link } from 'react-router-dom';
import './styles/Home.css';
import axios from 'axios';
import CreateTournamentModal from './objects/CreateTournamentModal';

const Home = () => {

    const [tournaments, setTournaments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sigedUpToTournys, setSignedUpToTournys] = useState([]);
    const [tournamentsPerPage] = useState(10); 
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchAllTournaments = async () => {
            try {
                const response = await fetch("http://localhost:8801/get_all_tournaments");
                const jsonData = await response.json();
                setTournaments(jsonData);
                console.log(jsonData);
            }
            catch (err) {
                console.log(err);
            }
        }
        fetchAllTournaments();


        const getListOfTournamentsUserIsSignedUpTo = () => {
            const token = localStorage.getItem("token");
            const email = localStorage.getItem("email");
    
            axios.get(`http://localhost:8801/get_list_of_tournaments_user_is_signed_up_to?token=${token}&email=${email}`)
                .then(res => {
                    console.log(res.data)
                    // only if success
                    if (res.data.status === "success") {
                        setSignedUpToTournys(res.data.data);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }

        getListOfTournamentsUserIsSignedUpTo();


    }, [setSignedUpToTournys])

    function formatDate(date) {
       // return in format: 2021-05-01 12:00
         var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear(),
                hour = '' + d.getHours(),
                minute = '' + d.getMinutes();
    
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            if (hour.length < 2)
                hour = '0' + hour;
            if (minute.length < 2)
                minute = '0' + minute;

        return [year, month, day].join('-') + ' ' + [hour, minute].join(':');
    }


    // Pagination Logic
    const indexOfLastTournament = currentPage * tournamentsPerPage;
    const indexOfFirstTournament = indexOfLastTournament - tournamentsPerPage;
    const currentTournaments = tournaments.slice(indexOfFirstTournament, indexOfLastTournament);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Other logic
    const isAuthenticated = () => {
        // Check if the user has a valid token
        const token = localStorage.getItem('token');
        return token !== null && token !== undefined;
    };



    function checkIfUserSignedUpToTourny(tournamentId) {
        for (let i = 0; i < sigedUpToTournys.length; i++) {
            if (sigedUpToTournys[i] === tournamentId) {
                return true;
            }
        }
    }

    const handleCreateModalToggle = () => {
        setShowCreateModal(!showCreateModal);
    };
    

    return (
        <div>
            <Header />
            <div className="container">

                <div className="row mb-3 mt-3">

                    <div className="col-sm d-flex justify-content-end align-items-center">
                        {isAuthenticated() ? (
                            // If user is authenticated, show user's email button
                            <div>
                                <button className="btn btn-success ml-2" data-toggle="modal" data-target="#createTournamentModal">Create Tournament</button>

                                <a href="/account" className="btn btn-primary ml-2">{localStorage.getItem('email')}</a>
                            </div>

                        ) : (
                            // If user is not authenticated, show login/signup button
                            <a href="/login" className="btn btn-primary">Log In / Sign Up</a>
                        )}
                    </div>
                </div>

                <div className="row mb-3">
                    <table id="tournamentsTable" className="table table-sm table-striped table-hover table-bordered">
                        <thead className="thead-dark center-titles">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Date</th>
                                <th scope="col">Location</th>
                                <th scope="col">Discipline</th>
                                <th scope="col">Geo Coordinates</th>
                                <th scope="col">Max Participants</th>
                                <th scope="col">Application Deadline</th>
                                <th scope="col">Creator</th>
                                {isAuthenticated() ? (
                                    <th scope="col">User signed up</th>
                                ) : (<th scope="col" style={{display: "none"}}>User signed up</th>)}
                                <th scope="col">More</th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentTournaments.map((tournament) => (
                                <tr key={tournament.id}>
                                    <th scope="row">{tournament.id}</th>
                                    <td >{tournament.name}</td>
                                    <td>{formatDate(tournament.time)}</td>
                                    <td>{tournament.location}</td>
                                    <td>{tournament.discipline}</td>
                                    <td>{tournament.geo_coordinates}</td>
                                    <td>{tournament.max_participants}</td>
                                    <td>{formatDate(tournament.app_deadline)}</td>
                                    <td>{tournament.creator}</td>
                                    {isAuthenticated() ? (
                                        <td>
                                            {checkIfUserSignedUpToTourny(tournament.id) ? (
                                                <p>Yes</p>
                                            ) : (
                                                <p>No</p>
                                            )}
                                        </td>
                                    ) : (<td style={{ display: "none" }}></td>)}
                                    {/* Add a Link column */}
                                    <td>
                                        <Link
                                            to={isAuthenticated() ?  `/tournament-details/${tournament.id}` : `/login`}
                                            className="btn btn-outline-primary btn-sm"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <nav>
                        <ul className="pagination pagination-sm">
                            {Array.from({ length: Math.ceil(tournaments.length / tournamentsPerPage) }).map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <a onClick={() => paginate(index + 1)} className="page-link" href="#">
                                        {index + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>


                </div>
            </div>
            <CreateTournamentModal onClose={handleCreateModalToggle} />
        </div>
    );
}

export default Home;