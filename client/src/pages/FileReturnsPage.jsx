import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaUniversity, FaPaperPlane } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux'; 
import { setListingStatus } from '../redux/state'; 

const FileReturnsPage = () => {
  const userId = useSelector((state) => state.user._id);
  const listings = useSelector((state) => state.listings);
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
  }, [listings]);

  const fetchUnfiledListings = () => {
    const filteredListings = listings.filter(
      (listing) => listing.creator._id === userId && listing.status === 'notFiled'
    );
    setUnfiledListings(filteredListings);
  };

  const handleListingSelect = (e) => {
    const listingId = e.target.value;
    const listing = unfiledListings.find((l) => l._id === listingId);
    setSelectedListing(listing);
    setPaymentDue(listing ? listing.target * 0.012 : 0);
  };

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod((prevMethod) => (prevMethod === method ? null : method));
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/returns/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: selectedListing._id,
          hostId: userId,
          paymentMethod,
          ...returnDetails,
          amountPaid: paymentDue,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit return');

      const result = await response.json();
      dispatch(setListingStatus({ listingId: selectedListing._id, status: 'filed' }));
      alert('Return filed successfully.');

      fetchUnfiledListings();
      setSelectedListing(null);
      setPaymentMethod(null);
      setReturnDetails({ referenceCode: '', paymentDate: '', paymentTime: '' });
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
        <p style={{ marginBottom: '20px' }}>
          Thank you for hosting funding projects on our platform. Please file your returns for completed listings and be eligible to host another listing.
        </p>

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

          {selectedListing && <p>Payment due: Ksh. {paymentDue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>}
        </div>

        {selectedListing && (
          <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>File Return</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                <h4>Choose Between Payment Via Mpesa or Bank</h4>
                <button
                  type="button"
                  onClick={() => handlePaymentMethodSelect('mpesa')}
                  style={{
                    marginRight: '10px',
                    marginTop: '10px',
                    padding: '5px 10px',
                    backgroundColor: paymentMethod === 'mpesa' ? '#3b82f6' : '#fff',
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
                    marginTop: '10px',
                    backgroundColor: paymentMethod === 'bank' ? '#3b82f6' : '#fff',
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

              {paymentMethod === 'mpesa' && (
                <div style={{ marginTop: '20px', textAlign: 'center', marginBottom: '20px' }}>
                  <p><b>Paybill Number:</b> 123456</p>
                  <p><b>Account Number:</b> ABCD123</p>
                </div>
              )}

              {paymentMethod === 'bank' && (
                <div style={{ marginTop: '20px', textAlign: 'center', marginBottom: '20px'  }}>
                  <p><b>Bank Name:</b> Muamana Bank</p>
                  <p><b>Account Number:</b> 987654321</p>
                </div>
              )}

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
                value={returnDetails.paymentDate}
                onChange={(e) => setReturnDetails({ ...returnDetails, paymentDate: e.target.value })}
                required
                style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
              />
              <input
                type="time"
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
