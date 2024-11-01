import { useEffect, useState, useMemo } from "react";
import "../styles/List.scss";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Reservations.scss";
import { useSelector } from "react-redux";


const MyProjectWithdrawals = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [withdrawalList, setWithdrawalList] = useState([]);
  const user = useSelector((state) => state.user); // Assuming Redux is handling user state.

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

  const handleApprove = async (id) => {
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

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <div style={{ justifyContent: "center", width: "500px", textAlign: "center", margin: "20px auto" }}>
        <h1 className="title-list">My Project Withdrawals</h1>
      </div>

      <div className="filter-buttons" style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
        <button
          onClick={() => setFilter("all")}
          className={`mx-2 px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          All Withdrawals
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`mx-2 px-4 py-2 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Pending Withdrawals
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`mx-2 px-4 py-2 rounded ${filter === "approved" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Approved Withdrawals
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
            {filteredWithdrawalList.map((withdrawal, index) => (
              <tr key={withdrawal._id} className="h-8">
                <td className="border-slate-700 text-center">{index + 1}</td>
                <td className="border-slate-700 text-center">{withdrawal.listingId.title}</td>
                <td className="border-slate-700 text-center">
                  ksh. {withdrawal.totalPrice}
                </td>
                <td className="border-slate-700 text-center">{new Date(withdrawal.createdAt).toLocaleDateString()}</td>
                <td className="border-slate-700 text-center">{withdrawal.status || "pending"}</td>
                <td className="border-slate-700 text-center">
                  {withdrawal.status === "pending" ? (
                    <button
                      onClick={() => handleApprove(withdrawal._id)}
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

export default MyProjectWithdrawals;
