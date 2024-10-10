import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaUniversity, FaPaperPlane } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { setListingStatus } from '../redux/state'; // Import the action



const FileReturnsPage = () => {
  const userId = useSelector((state) => state.user._id);
  const listings = useSelector((state) => state.listings); // Assuming listings is part of your Redux state

  const [unfiledListings, setUnfiledListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [paymentDue, setPaymentDue] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [returnDetails, setReturnDetails] = useState({
    referenceCode: '',
    paymentDate: '',
    paymentTime: '',
  });

  useEffect(() => {
    fetchUnfiledListings();
  }, [listings]); // Add listings as a dependency

  const fetchUnfiledListings = () => {
    // Filter listings based on the userId and status
    const filteredListings = listings.filter(
      (listing) => listing.creator._id === userId && listing.status === 'notFiled'
    );
    setUnfiledListings(filteredListings);
  };

  const handleListingSelect = (e) => {
    const listingId = e.target.value;
    const listing = unfiledListings.find((l) => l._id === listingId);
    setSelectedListing(listing);
    setPaymentDue(listing ? listing.target * 0.012 : 0); // 1.2% of the target
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const dispatch = useDispatch(); // Initialize useDispatch

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/returns/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listingId: selectedListing._id,
          hostId: userId,
          paymentMethod,
          ...returnDetails,
          amountPaid: paymentDue,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit return');
      }

      const result = await response.json(); // Get the result from the response
      // Dispatch the action to update the listing status in Redux
      dispatch(setListingStatus({ listingId: selectedListing._id, status: 'filed' }));

      alert('Return filed successfully.');
      fetchUnfiledListings(); // Refresh the list of unfiled listings
      setSelectedListing(null);
      setPaymentMethod(null);
      setReturnDetails({
        referenceCode: '',
        paymentDate: '',
        paymentTime: '',
      });
    } catch (error) {
      console.error('Error submitting return:', error.message);
      alert('Failed to submit return.');
    }

  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>File Your Returns</h1>
        <p style={{ marginBottom: '20px' }}>Thank you for hosting funding projects on our platform. Please file your returns for completed listings.</p>

        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Select Unfiled Listing</h2>
          <select
            onChange={handleListingSelect}
            style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
          >
            <option value="">Select a listing</option>
            {unfiledListings.map((listing) => (
              <option key={listing._id} value={listing._id}>
                {listing.title}
              </option>
            ))}
          </select>

          {selectedListing && (
            <div>
              <p>Payment due: KSH {paymentDue.toFixed(2)}</p>
            </div>
          )}
        </div>

        {selectedListing && (
          <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>File Return</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => handlePaymentMethodSelect('mpesa')}
                  style={{
                    marginRight: '10px',
                    padding: '5px 10px',
                    backgroundColor: paymentMethod === 'mpesa' ? '#3b82f6' : '#f3f4f6',
                    color: paymentMethod === 'mpesa' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <FaMoneyBillWave style={{ marginRight: '5px' }} />
                  M-Pesa
                </button>
                <button
                  type="button"
                  onClick={() => handlePaymentMethodSelect('bank')}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: paymentMethod === 'bank' ? '#3b82f6' : '#f3f4f6',
                    color: paymentMethod === 'bank' ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <FaUniversity style={{ marginRight: '5px' }} />
                  Bank Transfer
                </button>
              </div>

              <input
                type="text"
                placeholder="Reference Code"
                value={returnDetails.referenceCode}
                onChange={(e) => setReturnDetails({ ...returnDetails, referenceCode: e.target.value })}
                required
                style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
              />
              <input
                type="date"
                placeholder="Payment Date"
                value={returnDetails.paymentDate}
                onChange={(e) => setReturnDetails({ ...returnDetails, paymentDate: e.target.value })}
                required
                style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
              />
              <input
                type="time"
                placeholder="Payment Time"
                value={returnDetails.paymentTime}
                onChange={(e) => setReturnDetails({ ...returnDetails, paymentTime: e.target.value })}
                required
                style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                <FaPaperPlane style={{ marginRight: '5px' }} />
                Submit Return
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default FileReturnsPage;
