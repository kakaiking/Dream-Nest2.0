import React, { useEffect, useState } from 'react';
import '../styles/AdminPage.scss'; // Import the CSS file
import Navbar from '../components/Navbar';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [properties, setProperties] = useState([]);
  const [returns, setReturns] = useState([]);
  const [comments, setComments] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [activeView, setActiveView] = useState('users');

  const fetchData = async () => {
    try {
      const [usersResponse, bookingsResponse, propertiesResponse, returnsResponse, commentsResponse, updatesResponse] = await Promise.all([
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

      setUsers(await usersResponse.json());
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

  const updateUserStatus = async (userId, status) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/verify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verified: status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      const updatedUser = await response.json();
      setUsers(prevUsers =>
        prevUsers.map(user => (user._id === userId ? updatedUser : user))
      );
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const renderUsers = () => (
    <ul>
      {users.map(user => (
        <li key={user._id} className="list-item">
          <strong>Owners:</strong> {user.owners} <br />
          <strong>Email:</strong> {user.email} <br />
          <strong>Phone Number:</strong> {user.phoneNumber} <br />
          <strong>Password:</strong> {user.password} <br />
          <strong>Firm Name:</strong> {user.firmName} <br />
          <strong>Year Started:</strong> {user.yearStarted} <br />
          <strong>CMA License Number:</strong> {user.cmaLicenseNumber} <br />
          <strong>Assets Under Management:</strong> {user.assetsUnderManagement} <br />
          <strong>Physical Address:</strong> {user.physical} <br />
          <strong>Website:</strong> {user.website} <br />
          <strong>Profile Image Path:</strong> {user.profileImagePath} <br />
          <strong>KRA PIN Path:</strong> {user.kraPinPath} <br />
          <strong>Business Certificate Path:</strong> {user.businessCertificatePath} <br />
          <strong>Status:</strong> {user.verified} <br />
          <strong>Trip List:</strong> {user.tripList?.length || 0} items <br />
          <strong>Wish List:</strong> {user.wishList?.length || 0} items <br />
          <strong>Property List:</strong> {user.propertyList?.length || 0} items <br />
          <strong>Reservation List:</strong> {user.reservationList?.length || 0} items <br />
          <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()} <br />
          <strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()} <br />
          <button
            className="button"
            onClick={() => updateUserStatus(user._id, 'verified')}
            disabled={user.verified === 'verified'}
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
        </li>
      ))}
    </ul>
  );
  

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return users.length > 0 ? renderUsers() : <p className="error">No users found</p>;
      case 'bookings':
        return bookings.length > 0 ? (
          <ul>
            {bookings.map(booking => (
              <li key={booking._id} className="list-item">
                <strong>Customer:</strong> {booking.customerName} <br />
                <strong>Email:</strong> {booking.customerEmail} <br />
                <strong>Listing:</strong> {booking.listingTitle} <br />
                <strong>Total Price:</strong> KES {booking.totalPrice} <br />
                <strong>Status:</strong> {booking.status}
              </li>
            ))}
          </ul>
        ) : (
          <p className="error">No bookings found</p>
        );
        case 'properties':
          return properties.length > 0 ? (
            <ul>
              {properties.map(property => (
                <li key={property._id} className="list-item">
                  <strong>Title:</strong> {property.title} <br />
                  <strong>Category:</strong> {property.category} <br />
                  <strong>Type:</strong> {property.type} <br />
                  <strong>Status:</strong> {property.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="error">No properties found</p>
          );
  
        case 'returns':
          return returns.length > 0 ? (
            <ul>
              {returns.map(returnItem => (
                <li key={returnItem._id} className="list-item">
                  <strong>Listing:</strong> {returnItem.listing.title} <br />
                  <strong>Host:</strong> {returnItem.host.firmName} <br />
                  <strong>Payment Method:</strong> {returnItem.paymentMethod} <br />
                  <strong>Amount Paid:</strong> KES {returnItem.amountPaid} <br />
                  <strong>Status:</strong> {returnItem.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="error">No returns found</p>
          );
  
        case 'comments':
          return comments.length > 0 ? (
            <ul>
              {comments.map(comment => (
                <li key={comment._id} className="list-item">
                  <strong>User:</strong> {comment.user.firmName} <br />
                  <strong>Comment:</strong> {comment.content} <br />
                  <strong>Replies:</strong> {comment.replies.length}
                </li>
              ))}
            </ul>
          ) : (
            <p className="error">No comments found</p>
          );
  
        case 'updates':
          return updates.length > 0 ? (
            <ul>
              {updates.map(update => (
                <li key={update._id} className="list-item">
                  <strong>Title:</strong> {update.title} <br />
                  <strong>Description:</strong> {update.description} <br />
                  <strong>Listing:</strong> {update.listing.title}
                </li>
              ))}
            </ul>
          ) : (
            <p className="error">No updates found</p>
          );
  
        default:
  
          return null;
      }
    };
  
    return (
      <>
      <Navbar />
      <div className="container">
        {/* Offcanvas section */}
        <div className="offCanvas">
          <h3 style={{ marginBottom: '20px' }}>Options</h3>
          <div className="button-container">
            <button onClick={() => setActiveView('users')} className="button">Users</button>
            <button onClick={() => setActiveView('bookings')} className="button">Bookings</button>
            <button onClick={() => setActiveView('properties')} className="button">Properties</button>
            <button onClick={() => setActiveView('returns')} className="button">Returns</button>
            <button onClick={() => setActiveView('comments')} className="button">Comments</button>
            <button onClick={() => setActiveView('updates')} className="button">Updates</button>
          </div>
        </div>
        {/* Content section */}
        <div className="content">
          <h2 style={{ marginBottom: '20px' }}>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h2>
          {renderContent()}
        </div>
      </div>
      </>
    );
  };
  
  export default AdminPage;  