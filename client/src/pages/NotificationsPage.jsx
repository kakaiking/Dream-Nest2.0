import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import '../styles/NotificationsPage.scss'; // Optional custom styles

const NotificationsPage = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUpdate, setSearchUpdate] = useState(''); // State for search input

  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Fetch logged-in user from Redux

  // Fetch updates from API
  const fetchUpdates = async () => {
    try {
      const response = await fetch('http://localhost:3001/updates');
      if (!response.ok) throw new Error('Failed to fetch updates');

      const data = await response.json();

      // Filter updates by checking if the user follows the listing
      const followedUpdates = data.filter((update) =>
        update.listing.followedBy.includes(user._id)
      );

      setUpdates(followedUpdates);
    } catch (error) {
      console.error('Error fetching updates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const filterUpdates = () =>
    updates.filter((update) =>
      update.title.toLowerCase().includes(searchUpdate.toLowerCase()) ||
      stripHtmlTags(update.description).toLowerCase().includes(searchUpdate.toLowerCase())
    );

  // Handle navigation to the update detail page
  const handleUpdateClick = (updateId) => {
    navigate(`/update/${updateId}`);
  };

  const renderUpdates = () =>
    filterUpdates().map((update) => (
      <div
        key={update._id}
        className="notification"
        style={{ marginBottom: '40px', cursor: 'pointer', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}
        onClick={() => handleUpdateClick(update._id)}
      >
          <div className="updateimg">
            <img
              src={`http://localhost:3001/${getDocumentPath(update.listing.creator.profileImagePath)}`}
              alt={`${user.firmName} Profile`}
              className="user-image"
            />
          </div> <br />

          <strong>Project:</strong> {update.listing.title} <br />
          <strong>Title:</strong> {update.title} <br />
          <strong>Host:</strong> {update.listing.creator.firmName} <br />
          <strong>Created At:</strong> {new Date(update.createdAt).toLocaleString()} <br />
        
      </div>
    ));

  // Helper function to remove 'public' from the path
  const getDocumentPath = (path) => path?.replace(/^\/?public/, '') || '';

  return (
    <div className="notifications-page">
      <Navbar />
      <div className="notifications-content">
        <div
          style={{
            justifyContent: 'center',
            width: '500px',
            textAlign: 'center',
            margin: '20px auto',
          }}
        >
          <h1 className="title-list">Notifications</h1>
        </div>
        <div
          className="search-input"
          style={{
            justifyContent: 'center',
            width: '500px',
            textAlign: 'center',
            margin: '20px auto',
          }}
        >
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchUpdate}
            onChange={(e) => setSearchUpdate(e.target.value)}
            style={{
              width: '300px',
              height: '30px',
              textAlign: 'center',
              border: '1px solid black',
              borderRadius: '7px',
            }}
          />
        </div>

        {loading ? (
          <Loader /> // Display loader while fetching data
        ) : updates.length === 0 ? (
          <p>No notifications found for followed projects.</p>
        ) : (
          <div className="notifications">
            <div className="notificationss">
            {renderUpdates()}
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
