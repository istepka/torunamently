import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/js/bootstrap.bundle.min";


const LadderModal = ({ participants, onClose, tournament_id }) => {

    console.log(participants);

    const [loading, setLoading] = useState(false);
    const [ladder, setLadder] = useState(null); // Array of (participant, idx)
    const [results, setResults] = useState([]);

    useEffect(() => {
        fetchLadder();
        fetchScoresForTournament();
    }, [participants]);

    const fetchLadder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8801/fetch_ladder', { params: { token, tournament_id } });

            if (response.data.status === 'success') {
                setLadder(response.data.data);
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


    const generateLadderTable = () => {
        if (!ladder || ladder.length === 0) return null;


        // First generate logical structure of the Ladder, then create the html
        var stages = []
        const initial_size = participants.length;
        var participants_in_current_stage_cnt = participants.length;
        var participants_in_next_stage_cnt = 0;

        while (participants_in_current_stage_cnt > 1) {
            var stage = [];
            for (let i = 0; i < participants_in_current_stage_cnt; i += 2) {
                const pair1 = ladder[i];
                const pair2 = i + 1 < ladder.length ? ladder[i + 1] : null;

                stage.push(pair1);
                if (pair2) stage.push(pair2);
            }
            stages.push(stage);
            participants_in_next_stage_cnt = Math.ceil(participants_in_current_stage_cnt / 2);
            participants_in_current_stage_cnt = participants_in_next_stage_cnt;
        }

        console.log(stages);


        // Generate html
        // Each stage is a column
        // Each pair should occupy two vertical next to eachorther cells
        // Between each stage there should be a vertical line separating them with some large margins
        // Between each pait vertically there should be a horizontal line separating them with some large margins
            // Generate HTML
            const columns = [];
            stages.forEach((stage, stageIndex) => {
                columns.push(
                <td key={stageIndex} style={{  paddingRight: '20px', paddingLeft: '20px' }} className="text-center mt-4 mb-4">
                    {stage.map((pair, pairIndex) => (
                        <React.Fragment key={pairIndex}>
                            <tr className="text-center mt-4">
                                <td className="border border-dark font-weight-bold">{pair.participant}</td>
                            </tr>
                            <tr className="text-center mb-4">
                                <td className="border border-dark">{pair.idx}</td>
                            </tr>
                            { pairIndex % 2 === 1 && pairIndex !== stage.length - 1 && (
                                <tr className="text-center mt-4 mb-4">
                                    <td className="">&nbsp;</td>
                                </tr>
                            )}
                            
                        </React.Fragment>
                    ))}
                </td>
                );
                
            }

            );
        
            return (
                <table className="table">
                    <tbody>
                        <tr>
                            {columns}
                        </tr>
                    </tbody>
                </table>
            );
    };

    return (
       <div className="modal fade" id="ladderModal" tabIndex="-1" role="dialog" aria-labelledby="ladderModalLabel" aria-hidden="true">
    <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
        <div className="modal-content">
            <div className="modal-header">
                <h2>Ladder Management</h2>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body">
                {loading && <p>Loading...</p>}
                {!loading && ladder && (
                    <div>
                        <table className="table">
                            <tbody>
                                {generateLadderTable()}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && !ladder && (
                    <div>
                        <p>No ladder available.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
</div>

    );
    

};

export default LadderModal;