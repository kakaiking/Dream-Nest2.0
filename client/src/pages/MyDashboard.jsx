import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { IoDocumentTextOutline } from "react-icons/io5";
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import '../styles/TopUpPage.scss';
import { setListingStatus, setTripList, setReservationList } from '../redux/state';


const MyDashboard = () => {
    const user = useSelector((state) => state.user);
    const [bids, setBids] = useState([]);
    const [returns, setReturns] = useState([]);
    const [comments, setComments] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [sharesToAdd, setSharesToAdd] = useState(1);
    const [sharesToWithdraw, setSharesToWithdraw] = useState(1);
    const [activeView, setActiveView] = useState('topUp');

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
    const userId = useSelector((state) => state.user._id);
    const tripList = useSelector((state) => state.user.tripList);
    const reservationList = useSelector((state) => state.user.reservationList);


    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [topupList, setTopupList] = useState([]);
    const [withdrawalList, setWithdrawalList] = useState([]);
    const [topups, setTopups] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [returnLogs, setReturnLogs] = useState([]);


    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ---------------------------- My Project Topups --------------------------------------------------------------------
    const getTopupList = async () => {
        try {
            const response = await fetch(`http://localhost:3001/topups/${user._id}/projectTopups`, {
                method: "GET",
            });

            const data = await response.json();
            setTopupList(data);
            setLoading(false);
        } catch (err) {
            console.log("Failed to fetch topups:", err.message);
        }
    };

    useEffect(() => {
        getTopupList();
    }, []);

    const getTripList = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/users/${userId}/trips`,
                {
                    method: "GET",
                }
            );

            const data = await response.json();
            dispatch(setTripList(data));
            setLoading(false);
        } catch (err) {
            console.log("Fetch Trip List failed!", err.message);
        }
    };

    useEffect(() => {
        getTripList();
    }, []);

    const filteredTripList = useMemo(() => {
        return tripList.filter((trip) => {
            if (filter === "all") return true;
            return trip.status === filter;
        });
    }, [tripList, filter]);

    const totalPayoutMyBids = useMemo(() => {
        return filteredTripList.reduce((sum, trip) => {
            return sum + (trip.customerReturns / 100) * trip.totalPrice;
        }, 0);
    }, [filteredTripList]);

    const totalBidsMyBids = useMemo(() => {
        return filteredTripList.reduce((sum, trip) => sum + trip.totalPrice, 0);
    }, [filteredTripList]);

    const handleApproveTopup = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/topups/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "approved" }),
            });

            if (response.ok) {
                setTopupList((prevTopups) =>
                    prevTopups.map((topup) =>
                        topup._id === id ? { ...topup, status: "approved" } : topup
                    )
                );
            } else {
                console.error("Failed to update topup status");
            }
        } catch (err) {
            console.error("Error updating topup status:", err);
        }
    };

    const filteredTopupList = useMemo(() => {
        return topupList.filter((topup) => {
            if (filter === "all") return true;
            return topup.status === filter;
        });
    }, [topupList, filter]);

    //    -------------------- My Projects Withdrawals -----------------------------------------------------------------------
    const getWithdrawalList = async () => {
        try {
            const response = await fetch(`http://localhost:3001/withdrawals/${user._id}/projectWithdrawals`, {
                method: "GET",
            });

            const data = await response.json();
            setWithdrawalList(data);
            setLoading(false);
        } catch (err) {
            console.log("Failed to fetch withdrawals:", err.message);
        }
    };

    useEffect(() => {
        getWithdrawalList();
    }, []);

    const handleApproveWithdrawal = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/withdrawals/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "approved" }),
            });

            if (response.ok) {
                setWithdrawalList((prevWithdrawals) =>
                    prevWithdrawals.map((withdrawal) =>
                        withdrawal._id === id ? { ...withdrawal, status: "approved" } : withdrawal
                    )
                );
            } else {
                console.error("Failed to update withdrawal status");
            }
        } catch (err) {
            console.error("Error updating withdrawal status:", err);
        }
    };

    const filteredWithdrawalList = useMemo(() => {
        return withdrawalList.filter((withdrawal) => {
            if (filter === "all") return true;
            return withdrawal.status === filter;
        });
    }, [withdrawalList, filter]);

    // ------------ File Returns -------------------------------------------------------------------------------

    const fetchUnfiledListings = () => {
        const filteredListings = listings.filter(
            (listing) => listing.creator._id === user._id && listing.status === 'notFiled'
        );
        setUnfiledListings(filteredListings);
    };

    useEffect(() => {
        fetchUnfiledListings();
    }, [listings]);

    useEffect(() => {
        fetchData();
    }, []);

    const handleListingSelect = (e) => {
        const listingId = e.target.value;
        const listing = unfiledListings.find((l) => l._id === listingId);
        setSelectedListing(listing);
        setPaymentDue(listing ? listing.target * 0.012 : 0);
    };

    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod((prevMethod) => (prevMethod === method ? null : method));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/returns/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: selectedListing._id,
                    hostId: user._id,
                    paymentMethod,
                    referenceCode: returnDetails.referenceCode,
                    paymentDate: returnDetails.paymentDate,
                    paymentTime: returnDetails.paymentTime,
                    amountPaid: paymentDue,
                }),
            });

            if (response.ok) {
                dispatch(setListingStatus({ listingId: selectedListing._id, status: 'filed' }));
                alert("Return filed successfully");
                setSelectedListing(null);
                setPaymentMethod(null);
                setReturnDetails({ referenceCode: '', paymentDate: '', paymentTime: '' });
                fetchUnfiledListings(); // Refresh the list of unfiled listings
            } else {
                const errorData = await response.json();
                console.error("Error filing return:", errorData.message || response.statusText);
                alert(`Failed to file return: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error filing return:", error);
            alert("Failed to file return");
        }
    };


    const fetchData = async () => {
        try {
            const [bidsResponse, returnsResponse, commentsResponse, updatesResponse, bookingsResponse] = await Promise.all([
                fetch('http://localhost:3001/bookings'),
                fetch('http://localhost:3001/returns'),
                fetch('http://localhost:3001/comments'),
                fetch('http://localhost:3001/updates'),
                fetch(`http://localhost:3001/bookings/${user._id}`)
            ]);

            if (!bidsResponse.ok || !returnsResponse.ok || !commentsResponse.ok || !updatesResponse.ok || !bookingsResponse.ok) {
                throw new Error('One or more requests failed');
            }

            setBids(await bidsResponse.json());
            setReturns(await returnsResponse.json());
            setComments(await commentsResponse.json());
            setUpdates(await updatesResponse.json());
            setBookings(await bookingsResponse.json());
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

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

    // -------------------------------- My Top Ups ----------------------------------------------------------
    const fetchTopUps = async () => {
        try {
            const response = await fetch(`http://localhost:3001/topups/${userId}`, {
                method: "GET",
            });

            const data = await response.json();
            setTopups(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching topups:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopUps();
    }, [userId]);

    const filteredTopUps = useMemo(() => {
        return topups.filter((topup) => {
            if (filter === "all") return true;
            return topup.status === filter;
        });
    }, [topups, filter]);

    // ----------- My Withdrawals -----------------------------------------------------------------------------
    const fetchWithdrawals = async () => {
        try {
            const response = await fetch(`http://localhost:3001/withdrawals/${userId}`, {
                method: "GET",
            });

            const data = await response.json();
            setWithdrawals(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching withdrawals:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [userId]);

    const filteredWithdrawals = useMemo(() => {
        return withdrawals.filter((withdrawal) => {
            if (filter === "all") return true;
            return withdrawal.status === filter;
        });
    }, [withdrawals, filter]);

    // ---------- My Projects Bids --------------------------------------------------------------------------
    const getReservationList = async () => {
        try {
            const response = await fetch(
                `http://localhost:3001/users/${userId}/reservations`,
                {
                    method: "GET",
                }
            );

            const data = await response.json();
            dispatch(setReservationList(data));
            setLoading(false);
        } catch (err) {
            console.log("Fetch Reservation List failed!", err.message);
        }
    };

    useEffect(() => {
        getReservationList();
    }, []);

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/bookings/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: "approved" }),
            });

            if (response.ok) {
                const updatedReservationList = reservationList.map((reservation) =>
                    reservation._id === id ? { ...reservation, status: "approved" } : reservation
                );
                dispatch(setReservationList(updatedReservationList));
            } else {
                console.error("Failed to update booking status");
            }
        } catch (err) {
            console.error("Error updating booking status:", err);
        }
    };

    const filteredReservationList = useMemo(() => {
        return reservationList.filter((reservation) => {
            if (filter === "all") return true;
            return reservation.status === filter;
        });
    }, [reservationList, filter]);

    const totalPayout = useMemo(() => {
        return filteredReservationList.reduce((sum, reservation) => {
            return sum + (reservation.customerReturns / 100) * reservation.totalPrice;
        }, 0);
    }, [filteredReservationList]);

    const totalBids = useMemo(() => {
        return filteredReservationList.reduce((sum, reservation) => sum + reservation.totalPrice, 0);
    }, [filteredReservationList]);

    // -------- Return Logs ------------------------------------------------
    const fetchReturnLogs = async () => {
        try {
            const response = await fetch(`http://localhost:3001/returns/user/${user._id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            const data = await response.json();
            setReturnLogs(data);
        } catch (error) {
            console.error('Error fetching return logs:', error);
        }
    };

    useEffect(() => {
        fetchReturnLogs();
    }, [user._id, user.token]); // Add user._id and user.token as dependencies

    // Renders 
    const renderTopUp = () => (
        <>
            <h1 style={{ margin: "40px" }}>Top Up Shares</h1>

            <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', backgroundColor: '#fff', borderRadius: '7px', boxShadow: '0 3px 10px 2px rgba(0, 0, 0, 0.2)' }}>
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
                </select> <br />
                {selectedBooking && (
                    <div className="basics" >
                        <h2>Shares To Add</h2>

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
                                onClick={() => setSharesToAdd(sharesToAdd + 1)}
                                sx={{
                                    fontSize: '25px',
                                    cursor: 'pointer',
                                    "&:hover": { color: 'grey' },
                                }}
                            />
                        </div>
                        <button onClick={handleTopUp} style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgb(161, 64, 255)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        </>
    );

    const renderWithdraw = () => (
        <>
            <h1 style={{ margin: "40px" }}>Withdraw Shares</h1>
            <div style={{ maxWidth: '600px', height: 'auto', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '7px', boxShadow: '0 3px 10px 2px rgba(0, 0, 0, 0.2)' }}>
                <h2>Withdraw</h2><br />

                <p>If you want to take out some shares from an already existing bid, select the desired bid from the dropdown below.</p> <br />
                <p>After Selecting the bid to withdraw from, you can specify the number of shares you want to withdraw.</p> <br /><hr /><br />
                <select onChange={e => setSelectedBooking(bookings.find(b => b._id === e.target.value))} style={{ width: '100%', height: '30px', marginBottom: '20px', borderRadius: '5px' }}>
                    <option value="">Select the bid you want to withdraw from</option>
                    {bookings.map(booking => (
                        <option key={booking._id} value={booking._id}>
                            {booking.listingId.title} - Your shares: {booking.guestCount}
                        </option>
                    ))}
                </select>

                {selectedBooking && (
                    <div className="basics">
                        <h2>Withdraw </h2>
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
                        <button onClick={handleWithdraw} style={{ marginTop: '20px', padding: '10px', backgroundColor: 'rgb(161, 64, 255)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Withdraw
                        </button>
                    </div>
                )}
            </div>
        </>
    );

    const renderFileReturn = () => (
        <>
            <h1 style={{ margin: "40px" }}>File Return </h1>
            <div style={{ maxWidth: '600px', height: 'auto', margin: '0 auto', padding: '20px', backgroundColor: '#fff', borderRadius: '7px', boxShadow: '0 3px 10px 2px rgba(0, 0, 0, 0.2)' }}>
                <h2>Filing Return</h2><br />
                <p>To file returns for a funding project, select the listing from the dropdown below and follow through to complete the payment.</p>  <br /><hr /><br />
                <select onChange={handleListingSelect} style={{ width: '100%', height: '30px', marginBottom: '20px', borderRadius: '5px' }}>
                    <option value="">Select the listing you want to file returns for</option>
                    {unfiledListings.map(listing => (
                        <option key={listing._id} value={listing._id}>
                            {listing.title} - Amount Due: {listing.target * 0.012}
                        </option>
                    ))}
                </select>

                {selectedListing && (
                    <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                        <h3>Payment Details</h3>
                        <div>
                            <label>(Amount Due: {paymentDue})</label>
                        </div><br />
                        <div>
                            <label>Payment Method:</label>
                            <div>
                                <button type="button" onClick={() => handlePaymentMethodSelect('mpesa')}>
                                    Mpesa
                                </button>
                                <button type="button" onClick={() => handlePaymentMethodSelect('bank')}>
                                    Bank Transfer
                                </button>
                            </div> <br />
                            {paymentMethod && <p>Selected Method: {paymentMethod}</p>}
                        </div>
                        <div>
                            <label>Reference Code:</label>
                            <input
                                type="text"
                                value={returnDetails.referenceCode}
                                onChange={(e) => setReturnDetails({ ...returnDetails, referenceCode: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Payment Date:</label>
                            <input
                                type="date"
                                value={returnDetails.paymentDate}
                                onChange={(e) => setReturnDetails({ ...returnDetails, paymentDate: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Payment Time:</label>
                            <input
                                type="time"
                                value={returnDetails.paymentTime}
                                onChange={(e) => setReturnDetails({ ...returnDetails, paymentTime: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Amount Paid:</label>
                            <p>{paymentDue}</p>
                        </div>
                        <button type="submit" style={{ marginTop: '20px', padding: '10px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Submit Return
                        </button>
                    </form>
                )}
            </div>
        </>
    );

    const renderMyProjectTopUps = () => (
        <>
            <div style={{ justifyContent: "center", width: "500px", textAlign: "center", margin: "20px auto" }}>
                <h1 className="title-list">My Project Top Ups</h1>
            </div>

            <div className="filter-buttons" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <button
                    onClick={() => setFilter("all")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter("approved")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "approved" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Approved
                </button>
            </div>

            <div className="tableContent">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">No</th>
                            <th className="text-center">Project Name</th>
                            <th className="text-center">Bidder's name</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Shares</th>
                            <th className="text-center">Amount</th>
                            <th className="text-center">Date Requested</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTopupList.map((topup, index) => (
                            <tr key={topup._id} className="h-8">
                                <td className="border-slate-700 text-center">{index + 1}</td>
                                <td className="border-slate-700 text-center">{topup.listingId.title}</td>
                                <td className='border-slate-700 text-center'>{topup.customerName}</td>
                                <td className='border-slate-700 text-center'><Link to={`/${topup.customerId._id}/details`}>{topup.customerEmail}</Link> </td>
                                <td className='border-slate-700 text-center'>{topup.guestCount}</td>
                                <td className="border-slate-700 text-center">ksh. {topup.totalPrice}</td>
                                <td className="border-slate-700 text-center">{new Date(topup.createdAt).toLocaleDateString()}</td>
                                <td className="border-slate-700 text-center">{topup.status || "pending"}</td>
                                <td className="border-slate-700 text-center">
                                    {topup.status === "pending" ? (
                                        <button
                                            onClick={() => handleApproveTopup(topup._id)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <button disabled className="bg-gray-400 text-white font-bold py-2 px-4 rounded opacity-50">
                                            Approved
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderMyProjectWithdrawals = () => (
        <>
            <div style={{ justifyContent: "center", width: "600px", textAlign: "center", margin: "20px auto" }}>
                <h1 className="title-list">My Project Withdrawals</h1>
            </div>

            <div className="filter-buttons" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <button
                    onClick={() => setFilter("all")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter("approved")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "approved" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Approved
                </button>
            </div>

            <div className="tableContent">
                <table className="table">
                    <thead>
                        <tr>
                            <th className="text-center">No</th>
                            <th className="text-center">Project Name</th>
                            <th className="text-center">Bidder's name</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Shares</th>
                            <th className="text-center">Amount</th>
                            <th className="text-center">Date Requested</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWithdrawalList.map((withdrawal, index) => (
                            <tr key={withdrawal._id} className="h-8">
                                <td className="border-slate-700 text-center">{index + 1}</td>
                                <td className="border-slate-700 text-center">{withdrawal.listingId.title}</td>
                                <td className='border-slate-700 text-center'>{withdrawal.customerName}</td>
                                <td className='border-slate-700 text-center'><Link to={`/${withdrawal.customerId._id}/details`}>{withdrawal.customerEmail}</Link> </td>
                                <td className='border-slate-700 text-center'>{withdrawal.guestCount}</td>
                                <td className="border-slate-700 text-center">
                                    ksh. {withdrawal.totalPrice}
                                </td>
                                <td className="border-slate-700 text-center">{new Date(withdrawal.createdAt).toLocaleDateString()}</td>
                                <td className="border-slate-700 text-center">{withdrawal.status || "pending"}</td>
                                <td className="border-slate-700 text-center">
                                    {withdrawal.status === "pending" ? (
                                        <button
                                            onClick={() => handleApproveWithdrawal(withdrawal._id)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <button disabled className="bg-gray-400 text-white font-bold py-2 px-4 rounded opacity-50">
                                            Approved
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderMyBids = () => (
        <>
            <div style={{ justifyContent: "center", width: "500px", textAlign: "center", margin: "20px auto" }}>
                <h1 className="title-list"> Bids you Placed</h1>
            </div>
            <div className="filter-buttons" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <button
                    onClick={() => setFilter("all")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white selectedz" : "bg-gray-200"}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white selectedz" : "bg-gray-700"}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter("approved")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "approved" ? "bg-blue-500 text-white selectedz" : "bg-gray-200"}`}
                >
                    Approved
                </button>
            </div>

            <div className="totals" style={{ display: "flex", justifyContent: "space-between", margin: "20px 40px" }}>
                <div>
                    <strong>Total Bids:</strong> ksh. {totalBidsMyBids.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                <div>
                    <strong>Total Payout:</strong> ksh. {totalPayoutMyBids.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
            </div>

            <div className="tableContent">
                <table className='table'>
                    <thead>
                        <tr>
                            <th className="text-center">No</th>
                            <th className="text-center">Project Name</th>
                            <th className="text-center">Shares</th>
                            <th className="text-center">My Bid Price</th>
                            <th className="text-center">Returns (%)</th>
                            <th className="text-center">Payout</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="tbod">
                        {filteredTripList.map((reservation, index) => (
                            <tr key={reservation._id} className='h-8'>
                                <td className='border-slate-700 text-center'>{index + 1}</td>
                                <td className='border-slate-700 text-center'>{reservation.listingTitle}</td>
                                <td className='border-slate-700 text-center'>{reservation.guestCount}</td>

                                <td className='border-slate-700 text-center'>
                                    ksh. {reservation.totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className='border-slate-700 text-center'>{reservation.customerReturns}</td>
                                <td className='border-slate-700 text-center'>
                                    {((reservation.customerReturns / 100) * reservation.totalPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className='border-slate-700 text-center'>{reservation.status || 'pending'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderMyTopUps = () => (
        <>
            <div style={{ justifyContent: "center", width: "500px", textAlign: "center", margin: "20px auto" }}>
                <h1 className="title-list">My Top Ups</h1>
            </div>

            <div className="filter-buttons" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <button
                    onClick={() => setFilter("all")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    All Top Ups
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-700"}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter("approved")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "approved" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Approved
                </button>
            </div>

            <div className="tableContent">
                <table className='table'>
                    <thead>
                        <tr>
                            <th className="text-center">No</th>
                            <th className="text-center">Project Name</th>
                            <th className="text-center">Shares</th>
                            <th className="text-center">Top Up Amount</th>
                            <th className="text-center">Returns (%)</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="tbod">
                        {filteredTopUps.map((topup, index) => (
                            <tr key={topup._id} className='h-8'>
                                <td className='border-slate-700 text-center'>{index + 1}</td>
                                <td className='border-slate-700 text-center'>{topup.listingId?.title || "N/A"}</td>
                                <td className='border-slate-700 text-center'>{topup.guestCount}</td>
                                <td className='border-slate-700 text-center'>
                                    Ksh. {topup.totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className='border-slate-700 text-center'>{topup.customerReturns}</td>
                                <td className='border-slate-700 text-center'>{topup.status || 'pending'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderMyWithdrawals = () => (
        <>
            <div style={{ justifyContent: "center", width: "500px", textAlign: "center", margin: "20px auto" }}>
                <h1 className="title-list">My Withdrawals</h1>
            </div>

            <div className="filter-buttons" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <button
                    onClick={() => setFilter("all")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-700"}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setFilter("approved")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "approved" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                    Approved
                </button>
            </div>

            <div className="tableContent">
                <table className='table'>
                    <thead>
                        <tr>
                            <th className="text-center">No</th>
                            <th className="text-center">Project Name</th>
                            <th className="text-center">Shares</th>
                            <th className="text-center">My Bid Price</th>
                            <th className="text-center">Returns (%)</th>
                            <th className="text-center">Payout</th>
                            <th className="text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="tbod">
                        {filteredWithdrawals.map((withdrawal, index) => (
                            <tr key={withdrawal._id} className='h-8'>
                                <td className='border-slate-700 text-center'>{index + 1}</td>
                                <td className='border-slate-700 text-center'>{withdrawal.listingId?.title || "N/A"}</td>
                                <td className='border-slate-700 text-center'>{withdrawal.guestCount}</td>
                                <td className='border-slate-700 text-center'>
                                    ksh. {withdrawal.totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className='border-slate-700 text-center'>{withdrawal.customerReturns}</td>
                                <td className='border-slate-700 text-center'>
                                    {((withdrawal.customerReturns / 100) * withdrawal.totalPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className='border-slate-700 text-center'>{withdrawal.status || 'pending'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderMyProjectsBids = () => (
        <>
            <div style={{ justifyContent: "center", width: "500px", textAlign: "center", margin: "20px auto" }}>
                <h1 className="title-list" >Your Projects' Bids</h1>
            </div>
            <div className="filter-buttons" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <button
                    onClick={() => setFilter("all")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white selectedz" : "bg-gray-200"}`}
                >
                    All Bids
                </button>
                <button
                    onClick={() => setFilter("pending")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white selectedz" : "bg-gray-200"}`}
                >
                    Pending Bids
                </button>
                <button
                    onClick={() => setFilter("approved")}
                    className={`mx-2 px-4 py-2 rounded ${filter === "approved" ? "bg-blue-500 text-white selectedz" : "bg-gray-200"}`}
                >
                    Approved Bids
                </button>
            </div>

            <div className="totals" style={{ display: "flex", justifyContent: "space-between", margin: "20px 40px" }}>
                <div>
                    <strong>Total Bids:</strong> ksh. {totalBids.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
                <div>
                    <strong>Total Payout:</strong> ksh. {totalPayout.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
            </div>

            <div className="tableContent">
                <table className='table'>
                    <thead>
                        <tr>
                            <th className="text-center">No</th>
                            <th className="text-center">Project Name</th>
                            <th className="text-center">Bidder's name</th>
                            <th className="text-center">Email</th>
                            <th className="text-center">Shares</th>
                            <th className="text-center">Bid Price</th>
                            <th className="text-center">Returns (%)</th>
                            <th className="text-center">Payout</th>
                            <th className="text-center">Status</th>
                            <th className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="tbod">
                        {filteredReservationList.map((reservation, index) => (
                            <tr key={reservation._id} className='h-8'>
                                <td className='border-slate-700 text-center'>{index + 1}</td>
                                <td className='border-slate-700 text-center'>{reservation.listingTitle}</td>
                                <td className='border-slate-700 text-center'>{reservation.customerName}</td>
                                <td className='border-slate-700 text-center'><Link to={`/${reservation.customerId._id}/details`}>{reservation.customerEmail}</Link> </td>
                                <td className='border-slate-700 text-center'>{reservation.guestCount}</td>
                                <td className='border-slate-700 text-center'>
                                    ksh. {reservation.totalPrice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className='border-slate-700 text-center'>{reservation.customerReturns}</td>

                                <td className='border-slate-700 text-center'>
                                    {((reservation.customerReturns / 100) * reservation.totalPrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className='border-slate-700 text-center'>{reservation.status || 'pending'}</td>
                                <td className='border-slate-700 text-center'>
                                    {(!reservation.status || reservation.status === 'pending') ? (
                                        <button
                                            onClick={() => handleApprove(reservation._id)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
                                            style={{ width: "70px", fontSize: "medium", fontWeight: "bold" }}
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="bg-gray-400 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
                                        >
                                            Approved
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderMyReturnLogs = () => (
        <div>
            <div style={{ justifyContent: "center", width: "500px", textAlign: "center", margin: "20px auto" }}>
                <h1 className="title-list">My Returns Logs</h1>
            </div>            
            {returnLogs.length > 0 ? (
                <table className='table' style={{ width: '80%' }}>
                    <thead>
                        <tr>
                            <th className="text-center">No</th>
                            <th className="text-center">Project Name</th>
                            <th className="text-center">Paid Amount</th>
                            <th className="text-center">Payment Method</th>
                            <th className="text-center">Date</th>
                            <th className="text-center">Time</th>
                        </tr>
                    </thead>
                    <tbody className="tbod">
                        {returnLogs.map((log, index) => (
                            <tr key={log._id} className='h-8'>
                                <td className='border-slate-700 text-center'>{index + 1}</td>
                                <td className='border-slate-700 text-center'>{log.listing.title}</td>
                                <td className='border-slate-700 text-center'>
                                    ksh. {((log.dueAmount) || (log.listing.target * 0.012)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </td>
                                <td className='border-slate-700 text-center'>{log.paymentMethod}</td>
                                <td className='border-slate-700 text-center'>{new Date(log.paymentDate).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                })}</td>
                                <td className='border-slate-700 text-center'>{log.paymentTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No return logs found.</p>
            )}
        </div>
    )

    const renderContent = () => {
        switch (activeView) {
            case 'topUp':
                return renderTopUp();
            case 'withdraw':
                return renderWithdraw();
            case 'fileReturn':
                return renderFileReturn();
            case 'myProjectTopups':
                return renderMyProjectTopUps();
            case 'myProjectWithdrawals':
                return renderMyProjectWithdrawals();
            case 'myBids':
                return renderMyBids();
            case 'myTopups':
                return renderMyTopUps();
            case 'myWithdrawals':
                return renderMyWithdrawals();
            case 'myProjectBids':
                return renderMyProjectsBids();
            case 'myReturnLogs':
                return renderMyReturnLogs();
            default:
                return null;
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ display: 'flex', height: '100vh' }}>
                <div style={{ width: '20%', background: '#f8f9fa', padding: '20px' }}>
                    <h2 style={{ textAlign: 'center', color: '#333', borderBottom: '1px solid black' }}> Dashboard</h2> <br />
                    <h2>Actions</h2>
                    <div className="opt">

                    <button onClick={() => setActiveView('topUp')} style={buttonStyle}>Top Up</button>
                    </div>
                    <button onClick={() => setActiveView('withdraw')} style={buttonStyle}>Withdraw</button>
                    <button onClick={() => setActiveView('myProjectTopups')} style={buttonStyle}>Approve Top-Ups</button>
                    <button onClick={() => setActiveView('myProjectWithdrawals')} style={buttonStyle}>Approve Withdrawals</button>
                    <button onClick={() => setActiveView('fileReturn')} style={buttonStyle}>File Return</button><br />
                    <h2>Reports</h2>
                    <button onClick={() => setActiveView('myBids')} style={buttonStyle}>My Bids</button>
                    <button onClick={() => setActiveView('myProjectBids')} style={buttonStyle}>My Projects Bids</button>
                    <button onClick={() => setActiveView('myTopups')} style={buttonStyle}>My Top-Ups</button>
                    <button onClick={() => setActiveView('myWithdrawals')} style={buttonStyle}>My Withdrawals</button>
                    <button onClick={() => setActiveView('myReturnLogs')} style={buttonStyle}>My Returns Logs</button>

                </div>
                <div style={{ width: '80%', padding: '20px', overflowY: 'auto' }}>
                    {renderContent()}
                </div>
            </div>
        </>
    );
};

const buttonStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: 'rgb(161, 64, 255)',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: 'medium',
    fontWeight: 'bold'
};

export default MyDashboard;
