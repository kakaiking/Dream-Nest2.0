import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Navbar from '../components/Navbar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const InsightsPage = () => {
  const userId = useSelector((state) => state.user._id);
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState('');
  const [bookings, setBookings] = useState([]);
  const [topups, setTopups] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('Daily');  // Default to daily
  const [listingTarget, setListingTarget] = useState(0);
  const [listingCreationDate, setListingCreationDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(`http://localhost:3001/properties/all/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch listings');
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchListings();
  }, [userId]);

  useEffect(() => {
    const fetchTopups = async () => {
      try {
        const response = await fetch(`http://localhost:3001/topups/`);
        if (!response.ok) throw new Error('Failed to fetch topups');
        const data = await response.json();
        const filteredTopups = data.filter(topup => topup.listingId === selectedListing && topup.status === 'approved');
        setTopups(filteredTopups);
      } catch (err) {
        setError('Failed to fetch topups');
        console.error('Error fetching topups:', err);
      }
    };

    if (selectedListing) {
      fetchTopups();
    }
  }, [selectedListing]);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await fetch(`http://localhost:3001/withdrawals/`);
        if (!response.ok) throw new Error('Failed to fetch withdrawals');
        const data = await response.json();
        const filteredWithdrawals = data.filter(withdrawal => withdrawal.listingId === selectedListing && withdrawal.status === 'approved');
        setWithdrawals(filteredWithdrawals);
      } catch (err) {
        setError('Failed to fetch withdrawals');
        console.error('Error fetching withdrawals:', err);
      }
    };

    if (selectedListing) {
      fetchWithdrawals();
    }
  }, [selectedListing]);

  useEffect(() => {
    if (selectedListing) {
      const fetchData = async () => {
        try {
          const [bookingsResponse, listingResponse] = await Promise.all([
            fetch(`http://localhost:3001/bookings/${selectedListing}/host`),
            fetch(`http://localhost:3001/properties/${selectedListing}`)
          ]);
  
          if (!bookingsResponse.ok || !listingResponse.ok) {
            throw new Error('Failed to fetch data');
          }
  
          const [bookingsData, listingData] = await Promise.all([ 
            bookingsResponse.json(),
            listingResponse.json()
          ]);
  
          setBookings(bookingsData);
          setListingTarget(listingData.target);
          setListingCreationDate(new Date(listingData.createdAt));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }
  }, [selectedListing]);
  
  useEffect(() => {
    if (listingCreationDate) {
      const endDate = new Date();
      const labels = generateLabels(listingCreationDate, endDate);
    
      // Create separate arrays for bookings, topups, and withdrawals with their respective types
      const bookingsWithTypes = bookings.map((item) => ({
        date: new Date(item.createdAt).toISOString().split('T')[0], 
        amount: item.bookingPrice,
        type: 'booking',
      }));

      const topupsWithTypes = topups.map((item) => ({
        date: new Date(item.createdAt).toISOString().split('T')[0],
        amount: item.totalPrice,
        type: 'topup',
      }));

      const withdrawalsWithTypes = withdrawals.map((item) => ({
        date: new Date(item.createdAt).toISOString().split('T')[0],
        amount: -item.totalPrice,  // Withdrawal amounts are negative
        type: 'withdrawal',
      }));

      // Combine all arrays into one cumulative array
      const cumulativeArray = [...bookingsWithTypes, ...topupsWithTypes, ...withdrawalsWithTypes];
      console.log(cumulativeArray)
  
      // Sort cumulative array by date
      cumulativeArray.sort((a, b) => new Date(a.date) - new Date(b.date));
    
      let cumulativeTotal = 0;
      const dataPoints = labels.map((label) => {
        cumulativeArray.forEach((item) => {
          switch (timeframe) {
            case 'Daily':
              if (item.date === label) {
                cumulativeTotal += item.amount;
              }
              break;
            case 'Weekly':
              const weekNumber = Math.ceil((new Date(item.date).getDate() + new Date(item.date).getDay()) / 7);
              if (label === `Week ${weekNumber}`) {
                cumulativeTotal += item.amount;
              }
              break;
            case 'Monthly':
              if (label === `${new Date(item.date).getMonth() + 1}-${new Date(item.date).getFullYear()}`) {
                cumulativeTotal += item.amount;
              }
              break;
            case 'Yearly':
              if (label === new Date(item.date).getFullYear().toString()) {
                cumulativeTotal += item.amount;
              }
              break;
            default:
              break;
          }
        });
        return cumulativeTotal;
      });
    
      setChartData({
        labels,
        datasets: [
          {
            label: 'Cumulative Total',
            data: dataPoints,
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
            tension: 0.4,
            borderWidth: 2,
          },
          {
            label: 'Listing Target',
            data: Array(labels.length).fill(listingTarget),
            borderColor: 'rgba(255,99,132,0.6)',
            borderDash: [5, 5],
            fill: false,
          },
        ],
      });
    }
  }, [bookings, topups, withdrawals, timeframe, listingTarget, listingCreationDate]);

  const generateLabels = (startDate, endDate) => {
    const labels = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      switch (timeframe) {
        case 'Daily':
          labels.push(currentDate.toISOString().split('T')[0]);
          break;
        case 'Weekly':
          const weekNumber = Math.ceil((currentDate.getDate() + currentDate.getDay()) / 7);
          labels.push(`Week ${weekNumber}`);
          break;
        case 'Monthly':
          labels.push(`${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`);
          break;
        case 'Yearly':
          labels.push(currentDate.getFullYear().toString());
          break;
        default:
          break;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    // Limit labels to 10 and add overflow
    return labels.slice(0, 10);
  };

  return (
    <div>
      <Navbar />
      <p>Choose the funding project you want to see insights of</p>
      <select
        value={selectedListing}
        onChange={(e) => setSelectedListing(e.target.value)}
      >
        <option value="">Select a listing</option>
        {listings.map((listing) => (
          <option key={listing._id} value={listing._id}>
            {listing.title}
          </option>
        ))}
      </select>
      <div style={{ marginTop: '10px' }}>
        <button onClick={() => setTimeframe('Daily')}>Daily</button>
        <button onClick={() => setTimeframe('Weekly')}>Weekly</button>
        <button onClick={() => setTimeframe('Monthly')}>Monthly</button>
        <button onClick={() => setTimeframe('Yearly')}>Yearly</button>
      </div>
      {chartData && (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.raw.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default InsightsPage;
