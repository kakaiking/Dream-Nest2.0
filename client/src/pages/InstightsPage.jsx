import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Navbar from "../components/Navbar";

const InsightsPage = () => {
  const userId = useSelector((state) => state.user._id);
  const [insightListings, setInsightListings] = useState([]);
  const [selectedInsightListing, setSelectedInsightListing] = useState('');
  const [insightBookings, setInsightBookings] = useState([]);
  const [insightTopups, setInsightTopups] = useState([]);
  const [insightWithdrawals, setInsightWithdrawals] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [insightListingTarget, setInsightListingTarget] = useState(0);
  const [insightListingCreationDate, setInsightListingCreationDate] = useState(null);

  useEffect(() => {
    const fetchInsightListings = async () => {
      try {
        const response = await fetch(`http://localhost:3001/properties/all/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch Insight listings');
        const data = await response.json();
        setInsightListings(data);
      } catch (error) {
        console.error('Error fetching Insight listings:', error);
      }
    };
    fetchInsightListings();
  }, [userId]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!selectedInsightListing) return;
      try {
        const [insightBookingsRes, insightTopupsRes, withdrawalsRes, listingRes] = await Promise.all([
          fetch(`http://localhost:3001/bookings/${selectedInsightListing}/host`),
          fetch(`http://localhost:3001/topups/`),
          fetch(`http://localhost:3001/withdrawals/`),
          fetch(`http://localhost:3001/properties/${selectedInsightListing}`)
        ]);

        if (!insightBookingsRes.ok || !insightTopupsRes.ok || !withdrawalsRes.ok || !listingRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [insightBookingsData, insightTopupsData, insightWithdrawalsData, insightListingData] = await Promise.all([
          insightBookingsRes.json(),
          insightTopupsRes.json(),
          withdrawalsRes.json(),
          listingRes.json()
        ]);

        setInsightBookings(insightBookingsData);
        setInsightTopups(insightTopupsData.filter(t => t.listingId === selectedInsightListing && t.status === 'approved'));
        setInsightWithdrawals(insightWithdrawalsData.filter(w => w.listingId === selectedInsightListing && w.status === 'approved'));
        setInsightListingTarget(insightListingData.target);
        setInsightListingCreationDate(new Date(insightListingData.createdAt));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTransactions();
  }, [selectedInsightListing]);

  useEffect(() => {
    if (!insightListingCreationDate) return;

    const processTransactions = () => {
      const allTransactions = [
        ...insightBookings.map(b => ({
          date: new Date(b.createdAt).toLocaleDateString('en-CA'),
          amount: b.bookingPrice,
          type: 'booking'
        })),
        ...insightTopups.map(t => ({
          date: new Date(t.createdAt).toLocaleDateString('en-CA'),
          amount: t.totalPrice,
          type: 'topup'
        })),
        ...insightWithdrawals.map(w => ({
          date: new Date(w.createdAt).toLocaleDateString('en-CA'),
          amount: -w.totalPrice,
          type: 'withdrawal'
        }))
      ];

      const dailyTotals = new Map();
      allTransactions.forEach(transaction => {
        const currentTotal = dailyTotals.get(transaction.date) || 0;
        dailyTotals.set(transaction.date, currentTotal + transaction.amount);
      });

      const generateDateRange = () => {
        const dates = [];
        const startDate = new Date(insightListingCreationDate);
        startDate.setHours(0, 0, 0, 0);

        let cumulativeTotal = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 5);  // Add 5 extra days to the range

        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
          const dateStr = currentDate.toLocaleDateString('en-CA');
          const dayTotal = currentDate <= today ? dailyTotals.get(dateStr) || 0 : 0;
          cumulativeTotal += dayTotal;

          dates.push({
            date: dateStr,
            total: currentDate <= today ? cumulativeTotal : null, // Set total only for dates up to today
            target: insightListingTarget
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
      };

      return generateDateRange();
    };

    const chartData = processTransactions();
    setChartData(chartData);
  }, [insightBookings, insightTopups, insightWithdrawals, insightListingCreationDate, insightListingTarget]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Navbar />
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a funding project to view insights
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded-md"
          value={selectedInsightListing}
          onChange={(e) => setSelectedInsightListing(e.target.value)}
        >
          <option value="">Select a listing</option>
          {insightListings.map((listing) => (
            <option key={listing._id} value={listing._id}>
              {listing.title}
            </option>
          ))}
        </select>
      </div>

      {chartData.length > 0 && (
        <div className="w-full h-96 bg-white p-4 rounded-lg shadow">
          <LineChart
            width={800}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              interval={0}
              label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <YAxis
              label={{ value: 'Amount', angle: -90, position: 'insideLeft', offset: -20 }}
            />
            <Tooltip
              formatter={(value, name) => [
                `Ksh.${value?.toLocaleString()}` || "Pending",
                name === 'Target' ? 'Target' : 'Cumulative Total'
              ]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#4f46e5"
              name="Cumulative Total"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#ef4444"
              name="Target"
              strokeDasharray="5 5"
            />
          </LineChart>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
