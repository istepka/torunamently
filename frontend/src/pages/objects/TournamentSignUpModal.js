import React, { useState } from 'react';
import axios from 'axios';

const TournamentSignUpModal = ({ onClose, onSignUp }) => {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [currentRanking, setCurrentRanking] = useState('');

  const handleLicenseNumberChange = (e) => {
    setLicenseNumber(e.target.value);
  };

  const handleCurrentRankingChange = (e) => {
    setCurrentRanking(e.target.value);
  };

  const handleSignUp = () => {
    // Perform any validation here before allowing sign-up

    // Assuming validation passes, call the onSignUp function with the provided information
    onSignUp({ licenseNumber, currentRanking });
  };

  return (
    <div className="modal fade" id="signUpModal" tabIndex="-1" role="dialog" aria-labelledby="signUpModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="signUpModalLabel">Sign Up to Tournament</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={onClose}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="licenseNumber">License Number</label>
              <input type="text" className="form-control" id="licenseNumber" value={licenseNumber} onChange={handleLicenseNumberChange} />
            </div>
            <div className="form-group">
              <label htmlFor="currentRanking">Current Ranking</label>
              <input type="text" className="form-control" id="currentRanking" value={currentRanking} onChange={handleCurrentRankingChange} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};
  
  export default TournamentSignUpModal;