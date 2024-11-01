import { useEffect, useState, useMemo } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { setTripList } from "../redux/state";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"

const TripList = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const userId = useSelector((state) => state.user._id);
  const tripList = useSelector((state) => state.user.tripList);

  const dispatch = useDispatch();

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

  const totalPayout = useMemo(() => {
    return filteredTripList.reduce((sum, trip) => {
      return sum + (trip.customerReturns / 100) * trip.totalPrice;
    }, 0);
  }, [filteredTripList]);

  const totalBids = useMemo(() => {
    return filteredTripList.reduce((sum, trip) => sum + trip.totalPrice, 0);
  }, [filteredTripList]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div style={{justifyContent: "center", width: "500px",textAlign: "center", margin: "20px auto"}}>
        <h1 className="title-list"> Bids you Placed</h1>
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
          className={`mx-2 px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white selectedz" : "bg-gray-700"}`}
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
      <Footer />
    </>
  );
};

export default TripList;
