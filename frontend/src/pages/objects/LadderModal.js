import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "../styles/Ladder.css"
import Popup from './Popup';


const LadderModal = ({ participants, onClose, tournament_id }) => {

    console.log(participants);

    const [loading, setLoading] = useState(false);
    const [ladderInit, setLadderInit] = useState(null); // Array of (participant, idx)
    const [results, setResults] = useState([]);
    
    const [popupMessage, setPopupMessage] = useState('');
    const [popupTitle, setPopupTitle] = useState(''); 
    const [showPopup, setShowPopup] = useState(false);


    useEffect(() => {
        const fetchLadder = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8801/fetch_ladder', { params: { token, tournament_id } });
    
                if (response.data.status === 'success') {
                    setLadderInit(response.data.data);
                    console.log('Ladder:', response.data.data)
                } else {
                    console.error(response.data.message);
                }
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };
    
        const fetchScoresForTournament = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8801/fetch_results_for_tournament', { params: { token, tournament_id } });
                
                if (response.data.status === 'success') {
                    setResults(response.data.data);
                    console.log('Ladder scores:', response.data.data)
                } else {
                    console.error('Error fetching scores for tournament:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching scores for tournament:', error);
            }
            setLoading(false);
        }
        fetchLadder();
        fetchScoresForTournament();
    }, [participants]);

    function showPopupMessage(title, message) {
        setPopupTitle(title);
        setPopupMessage(message);
        setShowPopup(true);
    }


    function checkMatchupScore(participant1, participant2) {
        // Check if there is a score for this matchup
        const matchup = results.find((matchup) => {
            return (matchup.participant1 === participant1 && matchup.participant2 === participant2) ||
                (matchup.participant1 === participant2 && matchup.participant2 === participant1);
        });

        // If there is a score, return it
        if (matchup) {
            return [matchup.score1, matchup.score2, matchup.verified];
        }
        else {
            return null;
        }
    }

    function verifyMatchupScore(participant1, participant2) {
        console.log('Verifying matchup score:', participant1, participant2);
        setLoading(true);

        // Check if score1 and score2 are not null and are the same
        const matchup = results.find((matchup) => {
            return (matchup.participant1 === participant1 && matchup.participant2 === participant2) ||
                (matchup.participant1 === participant2 && matchup.participant2 === participant1);
        });

        // Update score of the matchup

        if (matchup) {
            if (matchup.score1 !== -1 && matchup.score2 !== -1 && matchup.score1 === matchup.score2) {
                // Update verified
                matchup.verified = true;
                console.log('Updating matchup score:', matchup);

                // Update in database
                const token = localStorage.getItem('token');
                axios.post('http://localhost:8801/update_matchup_score', { token, tournament_id, participant1, participant2, score1: matchup.score1, score2: matchup.score2, verified: matchup.verified })
                    .then((response) => {
                        if (response.data.status === 'success') {
                            console.log('Successfully updated matchup score.');
                            showPopupMessage('Success', 'Successfully updated matchup score and verified it.');
                        }
                        else {
                            console.error('Error updating matchup score:', response.data.message);
                            showPopupMessage('Error', 'Error updating matchup score. It was not verified.');
                        }
                    })
                    .catch((error) => {
                        console.error('Error updating matchup score:', error);
                        showPopupMessage('Error', 'Error updating matchup score. It was not verified.');
                    });

            }
            else if (matchup.score1 === -1 || matchup.score2 === -1) {
                //Here we update the database but we need to wait for the other player to update the score
                console.log('Updating matchup score:', matchup);
                
                const token = localStorage.getItem('token');
                axios.post('http://localhost:8801/update_matchup_score', { token, tournament_id, participant1, participant2, score1: matchup.score1, score2: matchup.score2, verified: matchup.verified })
                    .then((response) => {
                        if (response.data.status === 'success') {
                            console.log('Successfully updated matchup score.');
                            showPopupMessage('Success', 'Successfully updated matchup score. But, we need to wait for the other player to update the score as well.');
                        }
                        else {
                            console.error('Error updating matchup score:', response.data.message);
                            showPopupMessage('Error', 'Error updating matchup score. It was not verified.');
                        }
                    })
                    .catch((error) => {
                        console.error('Error updating matchup score:', error);
                        showPopupMessage('Error', 'Error updating matchup score. It was not verified.');
                    });

            }
            else {
                console.error('Scores:', matchup.score1, matchup.score2, 'are not valid. They should be equal.');
                
                const token = localStorage.getItem('token');
                axios.post('http://localhost:8801/update_matchup_score', { token, tournament_id, participant1, participant2, score1: -1, score2: -1, verified: false })
                .then((response) => {
                    if (response.data.status === 'success') {
                        console.log('Successfully updated matchup score.');
                    }
                    else {
                        console.error('Error updating matchup score:', response.data.message);
                    }
                })
                .catch((error) => {
                    console.error('Error updating matchup score:', error);
                });

                showPopupMessage('Error', 'Scores are not valid. They should be equal. Please try again.');
            }
        }

        setLoading(false);
    }

    function onChangeForMatchupScore(event, participant1, participant2) {
        event.preventDefault(); // To prevent form submission
        const selectedValue = event.target.value;
        console.log('Selected value:', selectedValue);

        // Check if there is a score for this matchup
        const matchup = results.find((matchup) => {
            return (matchup.participant1 === participant1 && matchup.participant2 === participant2) ||
                (matchup.participant1 === participant2 && matchup.participant2 === participant1);
        });

        // If there is a score, update it
        const currentUser = localStorage.getItem('email');
    
        if (matchup) {
            // Update existing score
            if (matchup.participant1 === currentUser) {
                 //selectedValue to int 
                matchup.score1 = parseInt(selectedValue);

            }
            else if (matchup.participant2 === currentUser) {
                matchup.score2 = parseInt(selectedValue);
            }
            else {
                console.error('User is not a participant in this matchup. They should not be able to select a score.');
            }
        }
    }

    function notVerifiedAndEditable(participant1, participant2) {
        // Check if there is a score for this matchup
        const matchup = results.find((matchup) => {
            return (matchup.participant1 === participant1 && matchup.participant2 === participant2) ||
                (matchup.participant1 === participant2 && matchup.participant2 === participant1);
        });

        // If there matchup is not verified and the current user is a participant, return true
        const currentUser = localStorage.getItem('email');
        if (matchup && !matchup.verified && (matchup.participant1 === currentUser || matchup.participant2 === currentUser)) {
            return true;
        }
        else {
            return false;
        }
    } 

    function checkOrAddMatchup(participant1, participant2) {
        // Check if there is a score for this matchup
        const matchup = results.find((matchup) => {
            return (matchup.participant1 === participant1 && matchup.participant2 === participant2) ||
                (matchup.participant1 === participant2 && matchup.participant2 === participant1);
        });

        // If there is no score, add it
        if (!matchup) {
            const token = localStorage.getItem('token');

            axios.post('http://localhost:8801/add_matchup', { token, tournament_id, participant1, participant2 })
                .then((response) => {
                    if (response.data.status === 'success') {
                        console.log('Successfully added matchup.');
                    }
                    else {
                        console.error('Error adding matchup:', response.data.message);
                    }
                })
                .catch((error) => {
                    console.error('Error adding matchup:', error);
                });
        }
    }

    const generateLadderTable = () => {
        if (!ladderInit || ladderInit.length === 0) return null;

        const supported_lengths = [2, 4, 8, 16, 32, 64, 128];
        if (!supported_lengths.includes(participants.length)) {
            return (
                <div className='alert alert-danger' role='alert'>
                    <p>Unsupported number of participants. </p>
                    <p>  Supported numbers are: {supported_lengths.join(', ')}. </p>
                    <p>Current number of participants: {participants.length}.</p>
                </div>
            );
        }

        // First generate logical structure of the Ladder, then create the html
        var stages = []
        const initial_size = participants.length;
        var participants_in_current_stage_cnt = participants.length;
        var participants_in_next_stage_cnt = 0;

        while (participants_in_current_stage_cnt > 1) {
            var stage = [];
            for (let i = 0; i < participants_in_current_stage_cnt; i += 2) {
                if (stages.length === 0) {
                    const pair1 = ladderInit[i];
                    const pair2 = ladderInit[i + 1];


                    const matchup_score = checkMatchupScore(pair1.participant, pair2.participant);

                    
                    const match = {
                        participant1: pair1.participant,
                        participant2: pair2.participant,
                        score1: matchup_score ? matchup_score[0] : null,
                        score2: matchup_score ? matchup_score[1] : null,
                        verified: matchup_score ? matchup_score[2] : false,
                        editableByUser: notVerifiedAndEditable(pair1.participant, pair2.participant),
                    };

                    stage.push(match);
                }
                else {
                    var previous_mathch1_winner = null;
                    var previous_mathch2_winner = null;
                    

                    // Check if there is a winner from the previous stage and add it to the next stage
                    const previous_stage = stages[stages.length - 1];

                    // Match 1
                    const previous_match1 = previous_stage[i];
                    const previous_match1_score1 = previous_match1.score1;
                    const previous_match1_verified = previous_match1.verified;

                    if (previous_match1_verified) {
                        previous_mathch1_winner = previous_match1_score1 === 1 ? previous_match1.participant2 : previous_match1.participant1;
                    }

                    // Match 2
                    const previous_match2 = previous_stage[i + 1];
                    const previous_match2_score1 = previous_match2.score1;
                    const previous_match2_verified = previous_match2.verified;

                    if (previous_match2_verified) {
                        previous_mathch2_winner = previous_match2_score1 === 1 ? previous_match2.participant2 : previous_match2.participant1;
                    }

                    // Check if there is a score for this matchup
                    const matchup_score = checkMatchupScore(previous_mathch1_winner, previous_mathch2_winner);

                    // If there is no score, add it
                    if (!matchup_score && previous_mathch1_winner && previous_mathch2_winner) {
                        checkOrAddMatchup(previous_mathch1_winner, previous_mathch2_winner);
                    }

                    var score1 = -1;
                    var score2 = -1;
                    var verified = false;
                    var editableByUser = notVerifiedAndEditable(previous_mathch1_winner, previous_mathch2_winner);

                    if (matchup_score) {
                        score1 = matchup_score[0];
                        score2 = matchup_score[1];
                        verified = matchup_score[2];
                    }
                    

                    const match = {
                        participant1: previous_mathch1_winner,
                        participant2: previous_mathch2_winner,
                        score1: score1,
                        score2: score2,
                        verified: verified,
                        editableByUser: editableByUser,
                    };

                    console.log('Match:', match);
                    stage.push(match);
                }
            }
            stages.push(stage);
            participants_in_next_stage_cnt = Math.ceil(participants_in_current_stage_cnt / 2);
            participants_in_current_stage_cnt = participants_in_next_stage_cnt;
        }

        console.log('Stages:', stages);


        // Generate html
        // Each stage is a column
        // Each pair should occupy two vertical next to eachorther cells
        // Between each stage there should be a vertical line separating them with some large margins
        // Between each pait vertically there should be a horizontal line separating them with some large margins
        // Generate HTML
        const first_stage_length = stages[0].length;
        const last_stage_index = stages.length - 1;
        const columns = [];
        
        stages.forEach((stage, stageIndex) => {
            var added_rows = 0;
        
            const tmp = stage;
        
            // Insert dummy rows in the beginning to align the stages
            if (stageIndex !== 0) {
                const howMany = stageIndex;
                for (let i = 0; i < howMany; i++) {
                    tmp.unshift({ participant1: 'DUMMY1' + stageIndex, participant2: 'DUMMY2' + stageIndex, score1: null, score2: null, verified: null, editableByUser: null });
                }
            }
        
            columns.push(
                <td key={stageIndex} className="fixed-width-column">
                    {tmp.map((match) => {
                        if (match.participant1 !== 'DUMMY1' + stageIndex) {
                            return (
                                <React.Fragment key={match.participant1 + match.participant2}>
                                    <tr className="text-left">
                                        <td className="font-weight-bold border-3 border-bottom-0 border-top-3 border-dark">[0] {match.participant1 ? match.participant1 : 'TBA'}</td>
                                    </tr>
                                    <tr className="text-left">
                                        <td className="font-weight-bold border-3 border-top-0">[1] {match.participant2 ? match.participant2 : 'TBA'}</td>
                                    </tr>
                                    <tr className="text-center border-3">
                                        <td className="border-0">
                                            <div className="row">
                                                <div className="col-12 mb-2 d-flex justify-content-between align-items-center">
                                                    <form className="form-inline w-100 ">
                                                        <label className="w-100 text-center col-6 mb-1">Winner</label>
                                                        <select id={`select-${match.participant1}-${match.participant2}`} className="form-control w-100 text-center col-4 ml-2" 
                                                            disabled={match.verified || !match.editableByUser} 
                                                            defaultValue={ match.verified ? match.score1 : null }
                                                            onChange={(event) => onChangeForMatchupScore(event, match.participant1, match.participant2)}>
                                                            <option value={null}>-</option>
                                                            <option value="0">0</option>
                                                            <option value="1">1</option>
                                                        </select>
                                                    </form>
                                                    <button className={`btn btn-${match.verified ? 'secondary' : 'primary'} w-100`} disabled={match.verified || !match.editableByUser}
                                                        onClick={() => verifyMatchupScore(match.participant1, match.participant2)}>
                                                        {match.verified ? 'Match ended' : match.editableByUser ? 'Verify' : 'No permission'}
                                                    </button>
                                                </div>
                                            </div>                                       
                                        </td>
                                    </tr>
                                    <tr className="text-center  border-0">
                                        <td className="border-0 fixed-width-column">&nbsp;</td>
                                    </tr>
                                </React.Fragment>
                            );
                        } else {
                            // Return an empty structure of the same size and properties
                            return (
                                <React.Fragment key={match.participant1 + match.participant2}>

                                    { stageIndex !== last_stage_index && (
                                    <tr className="">
                                        <td className="border-0 empty-td">&nbsp;</td>
                                    </tr>
                                    )}
                                    <tr className="">
                                        <td className="border-0 empty-td">&nbsp;</td>
                                    </tr>
                                    <tr className="">
                                        <td className="border-0 empty-td">&nbsp;</td>
                                    </tr>
                                    <tr className="">
                                        <td className="border-0 empty-td">&nbsp;</td>
                                    </tr>
                                </React.Fragment>
                            );
                        }
                    })}
                </td>
            );
        
            added_rows = columns[stageIndex].props.children.length;
        
            // Add another column with empty cells to fill the space between stages
            if (stageIndex !== stages.length - 1) {
                columns.push(
                    <td key={"empty-" + stageIndex.toString()} className="empty-col empty-td">
                        {Array.from({ length: added_rows }).map((_, index) => (
                            <React.Fragment key={"empty-" + stageIndex.toString() + "-" + index.toString()}>
                                <tr className="">
                                    <td className="border-0 empty-td">&nbsp;</td>
                                </tr>
                                <tr className="">
                                    <td className="border-0 empty-td">&nbsp;</td>
                                </tr>
                                <tr className="">
                                    <td className="border-0 empty-td">&nbsp;</td>
                                </tr>
                                <tr className="">
                                    <td className="border-0 empty-td">&nbsp;</td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </td>
                );
            }
        });
        
    
        return (
            <table className="">
                <tbody>
                    <tr className="">
                        {columns}
                    </tr>
                </tbody>
            </table>
        );
    };

    return (
        <div className="modal fade" id="ladderModal" tabIndex="-1" role="dialog" aria-labelledby="ladderModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-ladder modal-dialog-scrollable" role="document" style={{maxWidth: "50%", overflow: "auto"}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Tournament Ladder</h2>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {loading && <p>Loading...</p>}
                        {!loading && ladderInit && (
                            <div>
                                <table className="table ladder-table">
                                    <tbody>
                                        { !loading ? (
                                            generateLadderTable()
                                        ) : (<div></div>)}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {!loading && !ladderInit && (
                            <div>
                                <p>No ladder available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Popup title={popupTitle} message={popupMessage} onClose={() => setShowPopup(false)} show={showPopup} />
        </div>
    );
};

export default LadderModal;
