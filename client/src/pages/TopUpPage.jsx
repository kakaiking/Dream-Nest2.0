import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import Navbar from '../components/Navbar';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import '../styles/TopUpPage.scss'; // Create a corresponding CSS file if needed

const TopUpPage = () => {
  const user = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sharesToAdd, setSharesToAdd] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`http://localhost:3001/bookings/${user._id}`);
        if (response.ok) {
          const data = await response.json();
          setBookings(data);
        } else {
          console.error("Error fetching bookings:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchBookings();
  }, [user._id]);

  const handleTopUp = async () => {
    if (!selectedBooking || sharesToAdd <= 0) {
      alert("Invalid top-up amount");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/bookings/${user._id}/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          sharesToAdd,
        }),
      });
  
      if (response.ok) {
        alert("Top-up processed successfully");
        // You might want to update the bookings state here accordingly
        setSelectedBooking(null);
        setSharesToAdd(0);
      } else {
        const errorData = await response.json();
        console.error("Error processing top-up:", errorData.message || response.statusText);
        alert(`Failed to process top-up: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error processing top-up:", error);
      alert("Failed to process top-up");
    }
  };

  return (
    <div>
      <Navbar />
      <h1 style={{ margin: "40px" }}>Top Up Shares</h1>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '7px', boxShadow: '0 3px 10px 2px rgba(0, 0, 0, 0.2)'  }}>
      <h2>Top up</h2><br />
                <p>If you want to add some shares to an already existing bid, select the desired bid from the dropdown below.</p> <br />
                <p>After Selecting the bid to top up, you can specify the number of shares you want to add.</p> <br /><hr /><br />
                <select onChange={e => setSelectedBooking(bookings.find(b => b._id === e.target.value))} style={{ width: '100%', height: '30px', marginBottom: '20px', borderRadius: '5px' }}>
          <option value="">Select the bid you want to top up</option>
          {bookings.map(booking => (
            <option key={booking._id} value={booking._id}>
              {booking.listingId.title} - Your shares: {booking.guestCount}
            </option>
          ))}
        </select>

        {selectedBooking && (
          <div className="basics">
            <h2>File Top Up</h2>
            <div className="basic_count">
              <RemoveCircleOutline
                onClick={() => sharesToAdd > 0 && setSharesToAdd(sharesToAdd - 1)}
                sx={{
                  fontSize: '25px',
                  cursor: 'pointer',
                  "&:hover": { color: 'grey' },
                }}
              />
              <p>{sharesToAdd}</p>
              <AddCircleOutline
                onClick={() => setSharesToAdd(sharesToAdd + 1)} // No upper limit on top-up
                sx={{
                  fontSize: '25px',
                  cursor: 'pointer',
                  "&:hover": { color: 'grey' },
                }}
              />
            </div>
            <button onClick={handleTopUp} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Confirm Top Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopUpPage;
