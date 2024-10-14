// UserDetails.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/UserDetails.scss'; // Style for detailed view

const UserDetails = () => {
  const { state } = useLocation();
  const { user } = state;
  const navigate = useNavigate();

  return (
    <div className="user-details-container">
      <button className="back-button" onClick={() => navigate(-1)}>Back</button>
      <img src={user.profileImagePath} alt={`${user.firmName} profile`} className="detail-profile-image" />
      <h2>{user.firmName}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
      <p><strong>Year Started:</strong> {user.yearStarted}</p>
      <p><strong>CMA License:</strong> {user.cmaLicenseNumber}</p>
      <p><strong>Assets Under Management:</strong> {user.assetsUnderManagement}</p>
      <p><strong>Website:</strong> <a href={user.website}>{user.website}</a></p>
      <p><strong>Address:</strong> {user.physical}</p>
    </div>
  );
};

export default UserDetails;
