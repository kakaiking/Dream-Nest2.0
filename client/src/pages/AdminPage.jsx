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
        fetch("http://localhost:3001/users"),
        fetch("http://localhost:3001/bookings"),
        fetch("http://localhost:3001/properties"),
        fetch("http://localhost:3001/returns"),
        fetch("http://localhost:3001/comments"),
        fetch("http://localhost:3001/updates"),
      ]);

      if (!usersResponse.ok || !bookingsResponse.ok || !propertiesResponse.ok || !returnsResponse.ok || !commentsResponse.ok || !updatesResponse.ok) {
        throw new Error("One or more requests failed");
      }

      const usersData = await usersResponse.json();
      const bookingsData = await bookingsResponse.json();
      const propertiesData = await propertiesResponse.json();
      const returnsData = await returnsResponse.json();
      const commentsData = await commentsResponse.json();
      const updatesData = await updatesResponse.json();

      setUsers(usersData);
      setBookings(bookingsData);
      setProperties(propertiesData);
      setReturns(returnsData);
      setComments(commentsData);
      setUpdates(updatesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return users.length > 0 ? (
          <ul>
            {users.map(user => (
              <li key={user._id} className="list-item">
                <strong>Name:</strong> {user.firstName} {user.lastName} <br />
                <strong>Email:</strong> {user.email} <br />
                <strong>Phone:</strong> {user.phoneNumber} <br />
                <strong>Firm:</strong> {user.firmName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="error">No users found</p>
        );

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
                <strong>Host:</strong> {returnItem.host.firstName} {returnItem.host.lastName} <br />
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
                <strong>User:</strong> {comment.user.firstName} {comment.user.lastName} <br />
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
