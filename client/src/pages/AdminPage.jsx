import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminPage.scss'; // Import the CSS file
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import Listings from '../components/Listings'; // Import Listings component
import Loader from '../components/Loader';
import { IoDocumentTextOutline } from "react-icons/io5";


const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [bids, setBids] = useState([]);
  const [returns, setReturns] = useState([]);
  const [comments, setComments] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [activeView, setActiveView] = useState('users');
  
  // Search state for each data type
  const [searchUser, setSearchUser] = useState('');
  const [searchBid, setSearchBid] = useState('');
  const [searchReturn, setSearchReturn] = useState('');
  const [searchComment, setSearchComment] = useState('');
  const [searchUpdate, setSearchUpdate] = useState('');
  const [searchListing, setSearchListing] = useState(''); // Search state for Listings

  const navigate = useNavigate(); // For navigation

  const fetchData = async () => {
    try {
      const [usersResponse, bidsResponse, returnsResponse, commentsResponse, updatesResponse] = await Promise.all([
        fetch('http://localhost:3001/users'),
        fetch('http://localhost:3001/bookings'),
        fetch('http://localhost:3001/returns'),
        fetch('http://localhost:3001/comments'),
        fetch('http://localhost:3001/updates'),
      ]);

      if (
        !usersResponse.ok ||
        !bidsResponse.ok ||
        !returnsResponse.ok ||
        !commentsResponse.ok ||
        !updatesResponse.ok
      ) {
        throw new Error('One or more requests failed');
      }

      setUsers(await usersResponse.json());
      setBids(await bidsResponse.json());
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
      setUsers(prevUsers =>
        prevUsers.map(user => (user._id === userId ? updatedUser.user : user))
      );
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };
  

  // Helper function to remove 'public' from the path
  const getDocumentPath = (path) => path?.replace(/^\/?public/, '') || '';

  const filterUsers = () => {
    return users.filter(user => user.firmName.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase()));
  };

  const filterBids = () => {
    return bids.filter(bid => bid.customerName.toLowerCase().includes(searchBid.toLowerCase()) ||
      bid.customerEmail.toLowerCase().includes(searchBid.toLowerCase()) ||
      bid.listingTitle.toLowerCase().includes(searchBid.toLowerCase()));
  };

  const filterReturns = () => {
    return returns.filter(returnItem => returnItem.listing.title.toLowerCase().includes(searchReturn.toLowerCase()) ||
      returnItem.host.firmName.toLowerCase().includes(searchReturn.toLowerCase()));
  };

  const filterComments = () => {
    return comments.filter(comment => comment.user.firmName.toLowerCase().includes(searchComment.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchComment.toLowerCase()));
  };

  const filterUpdates = () => {
    return updates.filter(update => update.title.toLowerCase().includes(searchUpdate.toLowerCase()) ||
      update.description.toLowerCase().includes(searchUpdate.toLowerCase()));
  };

  const renderUsers = () =>
    filterUsers().map(user => (
      <div key={user._id} className="user-card" style={{ marginBottom: '40px' }}>
        <img
          src={`http://localhost:3001/${getDocumentPath(user.profileImagePath)}`}
          alt={`${user.firmName} Profile`}
          className="user-image"
        />
        <div className="user-info">
          <h3>User: {user.firmName}</h3>
          <h3>Email: {user.email}</h3>
        </div><br />
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
              onClick={() => updateUserStatus(user._id, 'Verified')}
              disabled={user.verified === 'Verified'}
              style={{ marginRight: '10px', marginBottom: '10px' }}
            >
              Verify
            </button>
            <button
              className="button reject-button"
              onClick={() => updateUserStatus(user._id, 'Rejected')}
              disabled={user.verified === 'Rejected'}
            >
              Reject
            </button>
            <button
              className="button revert-button"
              onClick={() => updateUserStatus(user._id, 'Pending Verification')}
              disabled={user.verified === 'Pending Verification'}
              style={{ marginTop: '10px' }}
            >
              Revert Verification
            </button>
          </div>
        </div>
      </div>
    ));

  const renderBids = () =>
    filterBids().map(booking => (
      <div key={booking._id} className="booking-card" style={{ marginBottom: '40px' }}>
        <strong>Bidder:</strong> {booking.customerName} <br />
        <strong>Bidder's Email:</strong> {booking.customerEmail} <br />
        <strong>Bid Amount:</strong> Ksh. {booking.totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <br />
        <hr />
        <strong>Listing Title:</strong> {booking.listingTitle} <br />
        <strong>Host Id:</strong> {booking.hostId} <br /><br />
        <strong>Status:</strong> {booking.status}<br />
        <strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()} <br />
        <strong>Updated At:</strong> {new Date(booking.updatedAt).toLocaleString()} <br />
      </div>
    ));

  const renderReturns = () =>
    filterReturns().map(returnItem => (
      <div key={returnItem._id} className="return-card" style={{ marginBottom: '40px' }}>
        <strong>Listing:</strong> {returnItem.listing.title} <br />
        <strong>Host:</strong> {returnItem.host.firmName} <br />
        <strong>Amount Returned:</strong> Ksh. {returnItem.amountPaid.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <br />
        <strong>Status:</strong> {returnItem.status} <br />
        <strong>Created At:</strong> {new Date(returnItem.createdAt).toLocaleString()} <br />
        <strong>Updated At:</strong> {new Date(returnItem.updatedAt).toLocaleString()} <br />
      </div>
    ));

  const renderComments = () =>
    filterComments().map(comment => (
      <div key={comment._id} className="comment-card" style={{ marginBottom: '40px' }}>
        <strong>Comment By:</strong> {comment.user.firmName} <br />
        <strong>Content:</strong> {comment.content} <br />
        <strong>Created At:</strong> {new Date(comment.createdAt).toLocaleString()} <br />
        <strong>Updated At:</strong> {new Date(comment.updatedAt).toLocaleString()} <br />
      </div>
    ));

  const renderUpdates = () =>
    filterUpdates().map(update => (
      <div key={update._id} className="update-card" style={{ marginBottom: '40px' }}>
      <strong>Title:</strong> {update.title} <br />
      <strong>Project:</strong> {update.listing.title} <br />
      <strong>Host:</strong> {update.listing.creator.firmName} <br />
      <strong>Description:</strong> {stripHtmlTags(update.description)} <br />

      <div className="supportDocs">
            <div className="supportTitle" style={{ width: '65%', margin: "0 auto 20px auto", textAlign: "center" }}>
              <h3><u>Supporting Documents:</u></h3>
            </div>
            {update.supportingDocuments && update.supportingDocuments.length > 0 ? (
              <div className="doc-cards">
                {update.supportingDocuments.map((doc, index) => (
                  <div className="doc-card" key={index}>
                    <a href={`http://localhost:3001/uploads/${doc.fileUrl}`} target="_blank" rel="noopener noreferrer">
                      <div className="doc-icon">
                        <IoDocumentTextOutline />
                      </div>
                      <div className="doc-name">
                        {doc.fileName}
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p>No supporting documents available.</p>
            )}
          </div>

      <strong>Created At:</strong> {new Date(update.createdAt).toLocaleString()} <br />
      <strong>Updated At:</strong> {new Date(update.updatedAt).toLocaleString()} <br />
    </div>
    ));

  return (
    <div className="admin-page">
      <Navbar />
      <div className="admin-content">
        <h1 style={{marginTop: '30px', marginLeft: '30px'}}>Admin Dashboard</h1>
        <div className="view-switch">
          <button onClick={() => setActiveView('users')}>Users</button>
          <button onClick={() => setActiveView('bids')}>Bids</button>
          <button onClick={() => setActiveView('returns')}>Returns</button>
          <button onClick={() => setActiveView('comments')}>Comments</button>
          <button onClick={() => setActiveView('updates')}>Updates</button>
          <button onClick={() => setActiveView('listings')}>Listings</button> {/* Button to switch to Listings */}
        </div>
        <div className="search-inputs">
          {activeView === 'users' && (
            <div className='inputDiv'>
              <input
                type="text"
                placeholder="Search users..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
            </div>
          )}
          {activeView === 'bids' && (
            <div className='inputDiv'>
              <input
                type="text"
                placeholder="Search bids..."
                value={searchBid}
                onChange={(e) => setSearchBid(e.target.value)}
              />
            </div>
          )}
          {activeView === 'returns' && (
            <div className='inputDiv'>
              <input
                type="text"
                placeholder="Search returns..."
                value={searchReturn}
                onChange={(e) => setSearchReturn(e.target.value)}
              />
            </div>
          )}
          {activeView === 'comments' && (
            <div className='inputDiv'>
              <input
                type="text"
                placeholder="Search comments..."
                value={searchComment}
                onChange={(e) => setSearchComment(e.target.value)}
              />
            </div>
          )}
          {activeView === 'updates' && (
            <div className='inputDiv'>
              <input
                type="text"
                placeholder="Search updates..."
                value={searchUpdate}
                onChange={(e) => setSearchUpdate(e.target.value)}
              />
            </div>
          )}
          {activeView === 'listings' && (
            <div className='inputDiv'>
              <input
                type="text"
                placeholder="Search listings..."
                value={searchListing}
                onChange={(e) => setSearchListing(e.target.value)}
              />
            </div>
          )}
        </div>

        {activeView === 'users' && renderUsers()}
        {activeView === 'bids' && renderBids()}
        {activeView === 'returns' && renderReturns()}
        {activeView === 'comments' && renderComments()}
        {activeView === 'updates' && renderUpdates()}
        {activeView === 'listings' && <Listings searchTerm={searchListing} />} {/* Render Listings component */}

        {/* Loading state */}
        {users.length === 0 && bids.length === 0 && returns.length === 0 && comments.length === 0 && updates.length === 0 && <Loader />}
      </div>
    </div>
  );
};

export default AdminPage;
