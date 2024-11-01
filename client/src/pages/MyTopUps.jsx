import React, { useEffect, useState, useMemo } from 'react';
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const MyTopUps = () => {
  const [loading, setLoading] = useState(true);
  const [topups, setTopups] = useState([]);
  const [filter, setFilter] = useState("all");

  const userId = useSelector((state) => state.user._id);

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

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
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
      <Footer />
    </>
  );
};

export default MyTopUps;
