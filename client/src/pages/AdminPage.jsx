import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/AdminPage.scss'; // Import the CSS file
import Navbar from '../components/Navbar';
import Listings from "../components/Listings";
import { setUsers, updateUserVerifiedState } from '../redux/userSlice'; // Redux actions

const AdminPage = () => {
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [returns, setReturns] = useState([]);
  const [comments, setComments] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [activeView, setActiveView] = useState('users');

  const navigate = useNavigate(); // For navigation
  const dispatch = useDispatch();

  const users = useSelector(state => state.user.userList); // Fetch users from Redux state

  const fetchData = async () => {
    try {
      const [
        usersResponse,
        bookingsResponse,
        propertiesResponse,
        returnsResponse,
        commentsResponse,
        updatesResponse,
      ] = await Promise.all([
        fetch('http://localhost:3001/users'),
        fetch('http://localhost:3001/bookings'),
        fetch('http://localhost:3001/properties'),
        fetch('http://localhost:3001/returns'),
        fetch('http://localhost:3001/comments'),
        fetch('http://localhost:3001/updates'),
      ]);

      if (
        !usersResponse.ok ||
        !bookingsResponse.ok ||
        !propertiesResponse.ok ||
        !returnsResponse.ok ||
        !commentsResponse.ok ||
        !updatesResponse.ok
      ) {
        throw new Error('One or more requests failed');
      }

      const usersData = await usersResponse.json();
      dispatch(setUsers(usersData)); // Store users in Redux

      setBookings(await bookingsResponse.json());
      setProperties(await propertiesResponse.json());
      setReturns(await returnsResponse.json());
      setComments(await commentsResponse.json());
      setUpdates(await updatesResponse.json());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateUserStatus = async (userId, action) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to update user status');

      const updatedUser = await response.json();
      dispatch(updateUserVerifiedState(updatedUser.user)); // Update user status in Redux
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const getDocumentPath = (path) => path?.replace(/^\/?public/, '') || '';

  const renderUsers = () =>
    users.map(user => (
      <div key={user._id} className="user-card" style={{ marginBottom: '40px' }}>
        <img
          src={`http://localhost:3001/${getDocumentPath(user.profileImagePath)}`}
          alt={`${user.firmName} Profile`}
          className="user-image"
        />
        <div className="user-info">
          <h3>User: {user.firmName}</h3>
          <h3>Email: {user.email}</h3>
        </div>
        <br />
        <div className="user-details">
          <strong>Owner(s):</strong> {user.owners} <br />
          <strong>Phone Number:</strong> {user.phoneNumber} <br />
          <strong>Year Started:</strong> {user.yearStarted} <br />
          <strong>CMA License Number:</strong> {user.cmaLicenseNumber} <br />
          <strong>Assets Under Management:</strong> {user.assetsUnderManagement} <br />
          <strong>Physical Address:</strong> {user.physical} <br />
          <strong>Website:</strong> {user.website} <br />

          <div className="supportDocs">
            <div className="supportTitle" style={{ width: '65%', margin: '0 auto 20px auto', textAlign: 'center' }}>
              <h3><u>User Documents:</u></h3>
            </div>
            <div className="doc-cards">
              <div className="doc-card">
                <a
                  href={`http://localhost:3001${getDocumentPath(user.kraPinPath)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="doc-icon">📄</div>
                  <div className="doc-name">KRA PIN</div>
                </a>
              </div>
              <div className="doc-card">
                <a
                  href={`http://localhost:3001${getDocumentPath(user.businessCertificatePath)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="doc-icon">📄</div>
                  <div className="doc-name">Business Certificate</div>
                </a>
              </div>
            </div>
          </div>

          <strong>Status:</strong> {user.verified} <br />
          <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()} <br />
          <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()} <br />
          <div className="userBtns" style={{ marginTop: '10px' }}>
            <button
              className="button"
              onClick={() => updateUserStatus(user._id, 'verified')}
              disabled={user.verified === 'verified'}
              style={{ marginRight: '10px', marginBottom: '10px' }}
            >
              Verify
            </button>
            <button
              className="button reject-button"
              onClick={() => updateUserStatus(user._id, 'rejected')}
              disabled={user.verified === 'rejected'}
            >
              Reject
            </button>
            <button
              className="button revert-button"
              onClick={() => updateUserStatus(user._id, 'notVerified')}
              disabled={user.verified === 'notVerified'}
              style={{ marginTop: '10px' }}
            >
              Revert Verification
            </button>
          </div>
        </div>
      </div>
    ));

  const renderContent = () => {
    const views = {
      users: renderUsers(),
      bookings: bookings.map(booking => (
        <div key={booking._id} className="booking-card" style={{ marginBottom: '40px' }}>
          <strong>Customer:</strong> {booking.customerName} <br />
          <strong>Email:</strong> {booking.customerEmail} <br />
          <strong>Listing:</strong> {booking.listingTitle} <br />
          <strong>Total Price:</strong> KES {booking.totalPrice} <br />
          <strong>Status:</strong> {booking.status}
        </div>
      )),
      properties: <Listings />,
      returns: returns.map(returnItem => (
        <div key={returnItem._id} className="return-card" style={{ marginBottom: '40px' }}>
          <strong>Listing:</strong> {returnItem.listing.title} <br />
          <strong>Host:</strong> {returnItem.host.firmName} <br />
          <strong>Payment Method:</strong> {returnItem.paymentMethod} <br />
          <strong>Amount Paid:</strong> KES {returnItem.amountPaid} <br />
          <strong>Status:</strong> {returnItem.status}
        </div>
      )),
      comments: comments.map(comment => (
        <div key={comment._id} className="comment-card" style={{ marginBottom: '40px' }}>
          <strong>User:</strong> {comment.user.firmName} <br />
          <strong>Comment:</strong> {comment.content} <br />
          <strong>Replies:</strong> {comment.replies.length}
        </div>
      )),
      updates: updates.map(update => (
        <div key={update._id} className="update-card" style={{ marginBottom: '40px' }}>
          <strong>Title:</strong> {update.title} <br />
          <strong>Description:</strong> {update.description} <br />
          <strong>Listing:</strong> {update.listing.title}
        </div>
      )),
    };

    return views[activeView] || <p className="error">No {activeView} found</p>;
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="offCanvas">
          <h2>Dashboard</h2>
          <div className="button-container">
            {['users', 'bookings', 'properties', 'returns', 'comments', 'updates'].map(view => (
              <button key={view} onClick={() => setActiveView(view)} className="button">
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="content">
          <h2>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h2>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default AdminPage;
