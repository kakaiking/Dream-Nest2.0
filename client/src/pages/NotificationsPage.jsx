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
      <div key={update._id} className="notification" style={{ marginBottom: '40px', cursor: 'pointer', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }} onClick={() => handleUpdateClick(update._id)}>
        <div className="updateimg">
          <img
            src={`http://localhost:3001/${getDocumentPath(update.listing.creator.profileImagePath)}`}
            alt={`${user.firmName} Profile`}
            className="user-image"
          />
        </div> <br />

        <div className="updateNotification">
          <p><strong>{update.listing.creator.firmName}</strong> has made a new update in <strong>{update.listing.title}</strong>.  </p> <br />
          {timeAgo(update.createdAt)}

        </div>

        <div className="updatePreview">
          <YouTubeThumbnail videoLink={update.videoLink} />
        </div>

      </div>
    ));

  // Helper function to remove 'public' from the path
  const getDocumentPath = (path) => path?.replace(/^\/?public/, '') || '';

  const timeAgo = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const differenceInMilliseconds = now - createdAt;

    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const differenceInDays = Math.floor(differenceInHours / 24);

    if (differenceInHours < 24) {
      if (differenceInMinutes < 60) {
        return differenceInMinutes === 1 ? "1 minute ago" : `${differenceInMinutes} minutes ago`;
      } else {
        return differenceInHours === 1 ? "1 hour ago" : `${differenceInHours} hours ago`;
      }
    } else {
      return differenceInDays === 1 ? "1 day ago" : `${differenceInDays} days ago`;
    }
  };

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const YouTubeThumbnail = ({ videoLink }) => {
    const videoId = getYouTubeVideoId(videoLink);
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;

    if (!thumbnailUrl) {
      return <div className="update-iconz"></div>;
    }

    return (
      <img
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="update-iconz"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/path/to/fallback/image.jpg'; // Replace with your fallback image path
        }}
      />
    );
  };

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
              height: '45px',
              textAlign: 'center',
              border: '1px solid black',
              borderRadius: '5px',
              marginBottom: '30px'
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
