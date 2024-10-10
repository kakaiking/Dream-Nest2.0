import { useEffect, useState, useMemo } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setReservationList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"
import "../styles/Reservations.scss"

const ReservationList = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const userId = useSelector((state) => state.user._id);
  const reservationList = useSelector((state) => state.user.reservationList);

  const dispatch = useDispatch();

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

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div style={{justifyContent: "center", width: "500px",textAlign: "center", margin: "20px auto"}}>
        <h1 className="title-list" >Your Projects' Bids</h1>
      </div>
      <div className="filter-buttons" style={{display: "flex", justifyContent: "center", margin: "20px 0"}}>
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

      <div className="totals" style={{display: "flex", justifyContent: "space-between", margin: "20px 40px"}}>
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
              <th className="text-center">Full name</th>
              <th className="text-center">Email</th>
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
                <td className='border-slate-700 text-center'>{reservation.customerEmail}</td>
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
                      style={{width: "70px", fontSize: "medium", fontWeight: "bold"}}
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
      <Footer />
    </>
  );
};

export default ReservationList;
