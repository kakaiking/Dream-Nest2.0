import React, { useEffect, useState, useMemo } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const MyProjectTopUps = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [topupList, setTopupList] = useState([]);
  const user = useSelector((state) => state.user); // Assuming Redux is handling user state.

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

  const handleApprove = async (id) => {
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

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div style={{ justifyContent: "center", width: "500px", textAlign: "center", margin: "20px auto" }}>
        <h1 className="title-list">My Project Top Ups</h1>
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
          className={`mx-2 px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Pending Top Ups
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`mx-2 px-4 py-2 rounded ${filter === "approved" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Approved Top Ups
        </button>
      </div>

      <div className="tableContent">
        <table className="table">
          <thead>
            <tr>
              <th className="text-center">No</th>
              <th className="text-center">Project Name</th>
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
                <td className="border-slate-700 text-center">ksh. {topup.totalPrice}</td>
                <td className="border-slate-700 text-center">{new Date(topup.createdAt).toLocaleDateString()}</td>
                <td className="border-slate-700 text-center">{topup.status || "pending"}</td>
                <td className="border-slate-700 text-center">
                  {topup.status === "pending" ? (
                    <button
                      onClick={() => handleApprove(topup._id)}
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
      <Footer />
    </>
  );
};

export default MyProjectTopUps;
