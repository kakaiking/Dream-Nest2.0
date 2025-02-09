import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import Navbar from '../components/Navbar';
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import '../styles/WithdrawalPage.scss';

const WithdrawalPage = ({ userId }) => {
  const user = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sharesToWithdraw, setSharesToWithdraw] = useState(0);

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
  }, [userId]);

  const handleWithdraw = async () => {
    if (!selectedBooking || sharesToWithdraw <= 0 || sharesToWithdraw > selectedBooking.guestCount) {
      alert("Invalid withdrawal amount");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/bookings/${user._id}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          sharesToWithdraw,
        }),
      });
  
      if (response.ok) {
        alert("Withdrawal processed successfully");
        setBookings(bookings.map(b => b._id === selectedBooking._id 
          ? { ...b, guestCount: b.guestCount - sharesToWithdraw } 
          : b
        ));
        setSelectedBooking(null);
        setSharesToWithdraw(0);
      } else {
        const errorData = await response.json();
        console.error("Error processing withdrawal:", errorData.message || response.statusText);
        alert(`Failed to process withdrawal: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      alert("Failed to process withdrawal");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <p>If you want to withdraw some shares from a project, select a bid from the dropdown below.</p>
        <select onChange={e => setSelectedBooking(bookings.find(b => b._id === e.target.value))}>
          <option value="">Select a booking</option>
          {bookings.map(booking => (
            <option key={booking._id} value={booking._id}>
              {booking.listingId.title} - Your shares: {booking.guestCount}
            </option>
          ))}
        </select>

        {selectedBooking && (
          <div className="basics">
            <h2>File Withdrawal</h2>
            <div className="basic_count">
              <RemoveCircleOutline
                onClick={() => sharesToWithdraw > 0 && setSharesToWithdraw(sharesToWithdraw - 1)}
                sx={{
                  fontSize: '25px',
                  cursor: 'pointer',
                  "&:hover": { color: 'grey' },
                }}
              />
              <p>{sharesToWithdraw}</p>
              <AddCircleOutline
                onClick={() => sharesToWithdraw < selectedBooking.guestCount && setSharesToWithdraw(sharesToWithdraw + 1)}
                sx={{
                  fontSize: '25px',
                  cursor: 'pointer',
                  "&:hover": { color: 'grey' },
                }}
              />
            </div>
            <button onClick={handleWithdraw} style={{ marginTop: '20px', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
              Confirm Withdrawal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalPage;
