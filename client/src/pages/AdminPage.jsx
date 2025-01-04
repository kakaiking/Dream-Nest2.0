import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AdminPage.scss'; // Import the CSS file
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import Listings from '../components/Listings'; // Import Listings component
import Loader from '../components/Loader';
import { MdPersonAddAlt1, MdPersonRemoveAlt1 } from "react-icons/md";
import { IoDocumentTextOutline, IoFileTrayFull, IoNotifications } from "react-icons/io5";
import { TbId } from "react-icons/tb";
import { IoIosPeople } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";
import { FaChevronRight, FaChevronLeft, FaRegComments, FaSort, FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';



const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [bids, setBids] = useState([]);
  const [returns, setReturns] = useState([]);
  const [comments, setComments] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [topups, setTopups] = useState([]);
  const [withdrawals, setWithdrawals] = useState([])
  const [activeView, setActiveView] = useState('users');

  // Search state for each data type
  const [searchUser, setSearchUser] = useState('');
  const [searchBid, setSearchBid] = useState('');
  const [searchReturn, setSearchReturn] = useState('');
  const [searchComment, setSearchComment] = useState('');
  const [searchUpdate, setSearchUpdate] = useState('');
  const [searchTopup, setSearchTopup] = useState('');
  const [searchWithdrawal, setSearchWithdrawal] = useState('');
  const [searchListing, setSearchListing] = useState(''); // Search state for Listings

  const navigate = useNavigate(); // For navigation

  const fetchData = async () => {
    try {
      const [usersResponse, bidsResponse, returnsResponse, commentsResponse, updatesResponse, topupsResponse, withdrawalsResponse] = await Promise.all([
        fetch('http://localhost:3001/users'),
        fetch('http://localhost:3001/bookings'),
        fetch('http://localhost:3001/returns'),
        fetch('http://localhost:3001/comments'),
        fetch('http://localhost:3001/updates'),
        fetch('http://localhost:3001/topups'),
        fetch('http://localhost:3001/withdrawals'),

      ]);

      if (
        !usersResponse.ok ||
        !bidsResponse.ok ||
        !returnsResponse.ok ||
        !commentsResponse.ok ||
        !updatesResponse.ok ||
        !topupsResponse.ok ||
        !withdrawalsResponse.ok
      ) {
        throw new Error('One or more requests failed');
      }

      setUsers(await usersResponse.json());
      setBids(await bidsResponse.json());
      setReturns(await returnsResponse.json());
      setComments(await commentsResponse.json());
      setUpdates(await updatesResponse.json());
      setTopups(await topupsResponse.json());
      setWithdrawals(await withdrawalsResponse.json());
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

  // Searches
  const filterUsers = () => {
    return users.filter(user =>
      user.firmName.toLowerCase().includes(searchUser.toLowerCase()) ||
      user.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      user._id.toLowerCase().includes(searchUser.toLowerCase())
    );
  };

  const filterBids = () => {
    return bids.filter(bid =>
      bid.customerName.toLowerCase().includes(searchBid.toLowerCase()) ||
      bid.customerEmail.toLowerCase().includes(searchBid.toLowerCase()) ||
      bid.listingTitle.toLowerCase().includes(searchBid.toLowerCase())
    );
  };

  const filterReturns = () => {
    return returns.filter(returnItem =>
      returnItem.listing.title.toLowerCase().includes(searchReturn.toLowerCase()) ||
      returnItem.host.firmName.toLowerCase().includes(searchReturn.toLowerCase())
    );
  };

  const filterComments = () => {
    return comments.filter(comment =>
      comment.user.firmName.toLowerCase().includes(searchComment.toLowerCase()) ||
      comment.content.toLowerCase().includes(searchComment.toLowerCase())
    );
  };

  const filterUpdates = () => {
    return updates.filter(update =>
      update.title.toLowerCase().includes(searchUpdate.toLowerCase()) ||
      update.description.toLowerCase().includes(searchUpdate.toLowerCase())
    );
  };

  const filterTopups = () => {
    return topups.filter(topup =>
      topup.customerName.toLowerCase().includes(searchTopup.toLowerCase()) ||
      topup.customerEmail.toLowerCase().includes(searchTopup.toLowerCase()) ||
      topup.listingTitle.toLowerCase().includes(searchTopup.toLowerCase())
    );
  };

  const filterWithdrawals = () => {
    return withdrawals.filter(withdrawal =>
      withdrawal.customerName.toLowerCase().includes(searchWithdrawal.toLowerCase()) ||
      withdrawal.customerEmail.toLowerCase().includes(searchWithdrawal.toLowerCase()) ||
      withdrawal.listingTitle.toLowerCase().includes(searchWithdrawal.toLowerCase())
    );
  };

  // State to manage sorting order
  const [sortOrder, setSortOrder] = useState('normal');
  const [dropdownOpen, setDropdownOpen] = useState(false);


  // Function to sort users based on the selected order
  const sortUsers = (users) => {
    switch (sortOrder) {
      case 'ascending':
        return [...users].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'descending':
        return [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return users; // Normal order
    }
  };

  // Renders
  const renderUsers = () =>
    sortUsers(filterUsers()).map(user => (
      <div key={user._id} className="user-card" style={{ marginBottom: '40px' }}>
        <img
          src={`http://localhost:3001/${getDocumentPath(user.profileImagePath)}`}
          alt={`${user.firmName} Profile`}
          className="user-image"
        />
        <div className="user-info" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3>{user.category == "Investor" ? ' Username:' : "Org. Name:"} {user.firmName}</h3>
          <h3>Email: {user.email}</h3>
        </div>
        <br />

        <div className="user-details">

          <div className="kaDetail">
            <div className="kaDetailHead">
              <strong> Category:</strong>
            </div>
            <div className="kaDetaill">
              {user.category}
            </div>
          </div>
          <hr style={{ width: '75%', marginLeft: '15px' }} /><br />

          <div className="kaDetail">
            <div className="kaDetailHead">
              <strong>Owner(s):</strong>
            </div>
            <div className="kaDetaill">
              {user.owners}
            </div>
          </div>
          <hr style={{ width: '75%', marginLeft: '15px' }} /><br />

          <div className="kaDetail">
            <div className="kaDetailHead">
              <strong>Phone Number:</strong>
            </div>
            <div className="kaDetaill">
              {user.phoneNumber}
            </div>
          </div>
          <hr style={{ width: '75%', marginLeft: '15px' }} /><br />

          <div className="kaDetail">
            <div className="kaDetailHead">
              <strong>Year Started:</strong>
            </div>
            <div className="kaDetaill">
              {user.yearStarted}
            </div>
          </div>
          <hr style={{ width: '75%', marginLeft: '15px' }} /><br />

          {user.category !== "Investor" && user.category !== 'Non-Profit' && (
            <>
              <div className="kaDetail">
                <div className="kaDetailHead">
                  <strong>CMA License Number:</strong>
                </div>
                <div className="kaDetaill">
                  {user.cmaLicenseNumber}
                </div>
              </div>
              <hr style={{ width: '75%', marginLeft: '15px' }} /><br />
            </>
          )}

          {user.category !== "Investor" && user.category !== 'Non-Profit' && (
            <>
              <div className="kaDetail">
                <div className="kaDetailHead">
                  <strong>Assets Under Management:</strong>
                </div>
                <div className="kaDetaill">
                  {user.assetsUnderManagement}
                </div>
              </div>
              <hr style={{ width: '75%', marginLeft: '15px' }} /><br />
            </>
          )}

          <div className="kaDetail">
            <div className="kaDetailHead">
              <strong>Physical Address:</strong>
            </div>
            <div className="kaDetaill">
              {user.physical}
            </div>
          </div>
          <hr style={{ width: '75%', marginLeft: '15px' }} /><br />

          <div className="kaDetail">
            <div className="kaDetailHead">
              <strong>Website:</strong>
            </div>
            <div className="kaDetaill">
              {user.website}
            </div>
          </div>
          <hr style={{ width: '75%', marginLeft: '15px' }} /><br />

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

          <div style={{ width: '240px', margin: '20px auto', textAlign: 'center' }}>
            <Link to={`/${user._id}/details`} style={{
              textDecoration: '0',
              padding: '10px 15px',
              backgroundColor: '#F8395A',
              border: 'none',
              fontSize: '20px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: '0.3s ease',
              color: 'white',
              borderRadius: '10px',
              width: '100%'
            }}> View User</Link>
          </div> <hr />

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
        <strong>Comment:</strong> {comment.content} <br />
        <strong>Update:</strong> {comment.update.title} <br />
        <strong>Listing:</strong> {comment.update.listing.title} <br />
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

  const renderTopups = () =>
    filterTopups().map(topup => (
      <div key={topup._id} className="booking-card" style={{ marginBottom: '40px' }}>
        <strong>Listing:</strong> {topup.listingTitle} <br />
        <strong>Host Id:</strong> {topup.hostId} <br />
        <strong>Bid Id:</strong> {topup.bookingId} <br /><br />

        <hr />
        <strong>Bidder:</strong> {topup.customerName} <br />
        <strong>Bidder's Email:</strong> {topup.customerEmail} <br />
        <strong>Topup Amount:</strong> Ksh. {topup.totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <br />
        <strong>Shares Topped Up:</strong> {topup.guestCount} <br /><hr />
        <br />

        <strong>Status:</strong> {topup.status}<br />
        <strong>Created At:</strong> {new Date(topup.createdAt).toLocaleString()} <br />
        <strong>Updated At:</strong> {new Date(topup.updatedAt).toLocaleString()} <br />
      </div>
    ));

  const renderWithdrawals = () =>
    filterWithdrawals().map(withdrawal => (
      <div key={withdrawal._id} className="booking-card" style={{ marginBottom: '40px' }}>
        <strong>Listing:</strong> {withdrawal.listingTitle} <br />
        <strong>Host Id:</strong> {withdrawal.hostId} <br />
        <strong>Bid Id:</strong> {withdrawal.bookingId} <br /><br />

        <hr />
        <strong>Bidder:</strong> {withdrawal.customerName} <br />
        <strong>Bidder's Email:</strong> {withdrawal.customerEmail} <br />
        <strong>Withdrawal Amount:</strong> Ksh. {withdrawal.totalPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} <br />
        <strong>Shares Withdrawn:</strong> {withdrawal.guestCount} <br /><hr />
        <br />

        <strong>Status:</strong> {withdrawal.status}<br />
        <strong>Created At:</strong> {new Date(withdrawal.createdAt).toLocaleString()} <br />
        <strong>Updated At:</strong> {new Date(withdrawal.updatedAt).toLocaleString()} <br />
      </div>
    ));

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);


  const getButtonStyle = (view) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: activeView === view ? '#ccc' : 'transparent',
    color: '#333',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'medium',
    fontWeight: 'bold',
    borderRadius: '5px'
  });

  const iconStyle = {
    marginRight: '10px',
    fontSize: 'x-large'
  };

  const renderContent = () => {
    switch (activeView) {
      case "users":
        return (
          <>
            <div className="inputDiv" style={{ width: '100%', height: '100px', marginTop: '10px', marginBottom: '30px' }}>
              <div className="inputt" style={{ width: '50%', height: '50%', margin: '20px auto' }}>
                <input
                  type="text"
                  placeholder="Search For A User..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid black',
                    textAlign: 'center',
                    fontSize: 'medium'
                  }}
                />
              </div>

              <div className="srtby" style={{ width: '80%', height: '50px', margin: '10px auto ' }}>
                <div className="arrangeBtn" style={{ display: 'flex', width: '120px', flexDirection: 'row' }}>
                  <p style={{ width: '60%', padding: '7px', fontSize: 'medium' }}>Sort By: </p>
                  <div style={{ width: '40%' }}>
                    <div
                      className="dropdown-container"
                      style={{ position: 'relative', display: 'inline-block', width: '100%' }}
                    >
                      <div
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="dropdown-selected"
                        style={{
                          width: '45px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: '1px solid black',
                          borderRadius: '7px',
                          padding: '0 10px',
                          cursor: 'pointer',
                          fontSize: 'medium',
                        }}
                      >
                        {sortOrder === 'ascending' ? (
                          <FaSortAmountUp />
                        ) : sortOrder === 'descending' ? (
                          <FaSortAmountDown />
                        ) : (
                          <FaSort />
                        )}
                      </div>
                      {dropdownOpen && (
                        <div
                          className="dropdown-options"
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: '1px solid black',
                            borderRadius: '7px',
                            zIndex: 10,
                            width: '200px'

                          }}
                        >
                          <div
                            onClick={() => {
                              setSortOrder('normal');
                              setDropdownOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              padding: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            <FaSort style={{ marginRight: '10px' }} />
                            <span>Default</span>
                          </div>
                          <hr style={{ width: '80%', margin: '0 auto' }} />

                          <div
                            onClick={() => {
                              setSortOrder('ascending');
                              setDropdownOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              padding: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            <FaSortAmountUp style={{ marginRight: '10px' }} />
                            <span>Date Ascending</span>
                          </div>
                          <hr style={{ width: '80%', margin: '0 auto' }} />

                          <div
                            onClick={() => {
                              setSortOrder('descending');
                              setDropdownOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              padding: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            <FaSortAmountDown style={{ marginRight: '10px' }} />
                            <span>Date Descending</span>
                          </div>

                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>


            </div>
            {renderUsers()}
          </>
        );
      case "bids":
        return (
          <>
            <div className="inputDiv" style={{ width: '100%', height: '50px', marginTop: '10px', marginBottom: '20px' }}>
              <div className="inputt" style={{ width: '50%', height: '100%', margin: '20px auto' }}>
                <input
                  type="text"
                  placeholder="Search For A Bid..."
                  value={searchBid}
                  onChange={(e) => setSearchBid(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid black',
                    textAlign: 'center',
                    fontSize: 'medium'
                  }}
                />
              </div>
            </div>
            {renderBids()}
          </>
        );
      case "returns":
        return (
          <>
            <div className="inputDiv" style={{ width: '100%', height: '50px', marginTop: '10px', marginBottom: '20px' }}>
              <div className="inputt" style={{ width: '50%', height: '100%', margin: '20px auto' }}>
                <input
                  type="text"
                  placeholder="Search For A Return..."
                  value={searchReturn}
                  onChange={(e) => setSearchReturn(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid black',
                    textAlign: 'center',
                    fontSize: 'medium'
                  }}
                />
              </div>
            </div>
            {renderReturns()}
          </>
        );
      case "comments":
        return (
          <>
            <div className="inputDiv" style={{ width: '100%', height: '50px', marginTop: '10px', marginBottom: '20px' }}>
              <div className="inputt" style={{ width: '50%', height: '100%', margin: '20px auto' }}>
                <input
                  type="text"
                  placeholder="Search For A Comment..."
                  value={searchComment}
                  onChange={(e) => setSearchComment(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid black',
                    textAlign: 'center',
                    fontSize: 'medium'
                  }}
                />
              </div>
            </div>
            {renderComments()}
          </>
        );
      case "updates":
        return (
          <>
            <div className="inputDiv" style={{ width: '100%', height: '50px', marginTop: '10px', marginBottom: '20px' }}>
              <div className="inputt" style={{ width: '50%', height: '100%', margin: '20px auto' }}>
                <input
                  type="text"
                  placeholder="Search For An Update..."
                  value={searchUpdate}
                  onChange={(e) => setSearchUpdate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid black',
                    textAlign: 'center',
                    fontSize: 'medium'
                  }}
                />
              </div>
            </div>
            {renderUpdates()}
          </>
        );
      case "updates":
        return (
          <>
            <div className="inputDiv" style={{ width: '100%', height: '50px', marginTop: '10px', marginBottom: '20px' }}>
              <div className="inputt" style={{ width: '50%', height: '100%', margin: '20px auto' }}>
                <input
                  type="text"
                  placeholder="Search For An Update..."
                  value={searchUpdate}
                  onChange={(e) => setSearchUpdate(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid black',
                    textAlign: 'center',
                    fontSize: 'medium'
                  }}
                />
              </div>
            </div>
            {renderUpdates()}
          </>
        );
      case "topups":
        return (
          <>
            <div className="inputDiv" style={{ width: '100%', height: '50px', marginTop: '10px', marginBottom: '20px' }}>
              <div className="inputt" style={{ width: '50%', height: '100%', margin: '20px auto' }}>
                <input
                  type="text"
                  placeholder="Search For A Topup..."
                  value={searchTopup}
                  onChange={(e) => setSearchTopup(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid black',
                    textAlign: 'center',
                    fontSize: 'medium'
                  }}
                />
              </div>
            </div>
            {renderTopups()}
          </>
        );

      case "withdrawals":
        return (
          <>
            <div className="inputDiv" style={{ width: '100%', height: '50px', marginTop: '10px', marginBottom: '20px' }}>
              <div className="inputt" style={{ width: '50%', height: '100%', margin: '20px auto' }}>
                <input
                  type="text"
                  placeholder="Search For A Withdrawal..."
                  value={searchWithdrawal}
                  onChange={(e) => setSearchWithdrawal(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid black',
                    textAlign: 'center',
                    fontSize: 'medium'
                  }}
                />
              </div>
            </div>
            {renderWithdrawals()}
          </>
        );
      case "listings":
        return (
          <>
            <div className="inputDiv" style={{ width: '100%', height: '50px', marginTop: '10px', marginBottom: '20px' }}>
              <div className="inputt" style={{ width: '50%', height: '100%', margin: '20px auto' }}>
                <input
                  type="text"
                  placeholder="Search For A Listing..."
                  value={searchListing}
                  onChange={(e) => setSearchListing(e.target.value)}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '7px',
                    border: '1px solid black',
                    textAlign: 'center',
                    fontSize: 'medium'
                  }}
                />
              </div>
            </div>
            <Listings searchTerm={searchListing} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Sidebar */}
        <div style={{ position: "relative", width: isSidebarVisible ? "20vw" : "0", transition: "width 0.3s" }}>
          {/* Toggle Button */}
          <div
            onClick={toggleSidebar}
            style={{
              position: "absolute",
              top: "20px",
              left: isSidebarVisible ? "90%" : "-10px",
              width: "45px",
              height: "40px",
              borderRadius: "20px",
              background: "#007bff",
              color: "black",
              fontSize: "xx-large",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "left 0.3s",
              zIndex: 1000,
            }}
          >
            {isSidebarVisible ? <FaChevronLeft /> : <FaChevronRight />}
          </div>

          {/* Sidebar Content */}
          {isSidebarVisible && (
            <div style={{ height: "100%", background: "#f8f9fa", padding: "20px", overflow: "hidden", boxShadow: '0 3px 10px 2px rgba(0, 0, 0, 0.2)'
            }}>
              <h2 style={{ textAlign: "center", color: "#333", borderBottom: "1px solid black" }}>Admin Dashboard</h2>
              <br />
              <button onClick={() => setActiveView("users")} style={getButtonStyle('users')}>
                <IoIosPeople style={iconStyle} /> Users
              </button>

              <button onClick={() => setActiveView("bids")} style={getButtonStyle('bids')}>
                <GrTransaction style={iconStyle} /> Bids
              </button>

              <button onClick={() => setActiveView("returns")} style={getButtonStyle('returns')}>
                <IoFileTrayFull style={iconStyle} /> Returns
              </button>

              <button onClick={() => setActiveView("comments")} style={getButtonStyle('comments')}>
                <FaRegComments style={iconStyle} /> Comments
              </button>

              <button onClick={() => setActiveView("updates")} style={getButtonStyle('updates')}>
                <IoNotifications style={iconStyle} /> Updates
              </button>

              <button onClick={() => setActiveView("topups")} style={getButtonStyle('topups')}>
                <MdPersonAddAlt1 style={iconStyle} /> Topups
              </button>

              <button onClick={() => setActiveView("withdrawals")} style={getButtonStyle('withdrawals')}>
                <MdPersonRemoveAlt1 style={iconStyle} /> Withdrawals
              </button>

              <button onClick={() => setActiveView("listings")} style={getButtonStyle('listings')}>
                <TbId style={iconStyle} /> Listings
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div style={{ width: isSidebarVisible ? "calc(100% - 20vw)" : "100%", padding: "20px", overflowY: "auto", transition: "width 0.3s" }}>
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default AdminPage;