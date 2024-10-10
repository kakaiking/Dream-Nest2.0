import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

const ReturnLogs = () => {
  const user = useSelector((state) => state.user); // Get the logged-in user
  const [returnLogs, setReturnLogs] = useState([]);

  useEffect(() => {
    fetchReturnLogs();
  }, [user._id, user.token]); // Add user._id and user.token as dependencies

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

  return (
    <>
    <Navbar />
    <div>
      <h1>Return Logs</h1>
      {returnLogs.length > 0 ? (
        <table className='table'>
          <thead>
            <tr>
              <th className="text-center">No</th>
              <th className="text-center">Project Name</th>
              <th className="text-center">Amount (1.2% of target)</th>
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
                <td className='border-slate-700 text-center'>{log.paymentDate}</td>
                <td className='border-slate-700 text-center'>{log.paymentTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No return logs found.</p>
      )}
    </div>
    </>
  );
};

export default ReturnLogs;
