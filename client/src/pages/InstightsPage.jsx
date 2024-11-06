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
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('Daily');
  const [listingTarget, setListingTarget] = useState(0);
  const [listingCreationDate, setListingCreationDate] = useState(null);

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
    if (selectedListing) {
      const fetchBookings = async () => {
        try {
          const [bookingsResponse, listingResponse] = await Promise.all([ 
            fetch(`http://localhost:3001/bookings/${selectedListing}/host`),
            fetch(`http://localhost:3001/properties/${selectedListing}`)
          ]);
          if (!bookingsResponse.ok || !listingResponse.ok) {
            throw new Error('Failed to fetch bookings or listing details');
          }
          const bookingsData = await bookingsResponse.json();
          const listingData = await listingResponse.json();
          setBookings(bookingsData);
          setListingTarget(listingData.target);
          setListingCreationDate(new Date(listingData.createdAt));
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchBookings();
    }
  }, [selectedListing]);

  const generateLabels = (startDate, endDate, interval) => {
    const labels = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      labels.push(
        interval === 'Hourly'
          ? currentDate.toLocaleString('en-US', { hour: 'numeric', hour12: true })
          : currentDate.toLocaleDateString()
      );
      if (interval === 'Hourly') {
        currentDate.setHours(currentDate.getHours() + 1);
      } else if (interval === 'Daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (interval === 'Weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (interval === 'Monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (interval === 'Yearly') {
        currentDate.setFullYear(currentDate.getFullYear() + 1);
      }
    }
    return labels;
  };

  useEffect(() => {
    if (bookings.length > 0 && listingTarget && listingCreationDate) {
      const endDate = new Date();
      const labels = generateLabels(listingCreationDate, endDate, timeframe);
      
      const bookingMap = {};
      bookings.forEach((booking) => {
        const bookingDate = new Date(booking.updatedAt);
        let label = timeframe === 'Hourly'
          ? bookingDate.toLocaleString('en-US', { hour: 'numeric', hour12: true })
          : bookingDate.toLocaleDateString();
        bookingMap[label] = (bookingMap[label] || 0) + booking.totalPrice;
      });

      let cumulativeTotal = 0;
      const dataPoints = labels.map((label) => {
        cumulativeTotal += bookingMap[label] || 0;
        return cumulativeTotal;
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Total Price (Cumulative)',
            data: dataPoints,
            borderColor: 'rgba(75,192,192,1)',
            fill: false,
            tension: 0.4, // This makes the line curved
            borderWidth: 2, // Thicker line
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
  }, [bookings, timeframe, listingTarget, listingCreationDate]);

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
        <button onClick={() => setTimeframe('Hourly')}>Hourly</button>
        <button onClick={() => setTimeframe('Daily')}>Daily</button>
        <button onClick={() => setTimeframe('Weekly')}>Weekly</button>
        <button onClick={() => setTimeframe('Monthly')}>Monthly</button>
        <button onClick={() => setTimeframe('Yearly')}>Yearly</button>
      </div>
      {chartData && (
        <div style={{ marginTop: '20px' }}>
          <Line
            data={chartData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Total Price',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: `Date (${timeframe})`,
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
