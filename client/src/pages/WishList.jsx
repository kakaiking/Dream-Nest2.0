import "../styles/List.scss";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"

const WishList = () => {
  const user = useSelector((state) => state.user);
  const [followedListings, setFollowedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFollowedListings = async () => {
      if (!user?._id) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:3001/properties/followed/${user._id}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch followed listings');
        }

        const data = await response.json();
        setFollowedListings(data);
      } catch (err) {
        console.error('Error fetching followed listings:', err);
        setError('Failed to load followed listings. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowedListings();
  }, [user?._id]);

  return (
    <>
      <Navbar />
      <h1 className="title-list" style={{ marginLeft: "40vw" }}>Followed Listings</h1>
      
      {isLoading && (
        <div className="loading-message" style={{ textAlign: "center", padding: "2rem" }}>
          Loading your followed listings...
        </div>
      )}

      {error && (
        <div className="error-message" style={{ textAlign: "center", padding: "2rem", color: "red" }}>
          {error}
        </div>
      )}

      <div className="list">
        {followedListings.map((item) => {
          if (!item) return null;

          const {
            _id,
            creator,
            title,
            bidExpiry,
            financialInstruments,
            returns,
            category,
            type,
            target,
            highlightDesc = '',
            booking = false
          } = item;

          return (
            <ListingCard
              key={_id}
              listingId={_id}
              title={title || 'No Title'}
              creator={creator}
              bidExpiry={bidExpiry}
              financialInstruments={financialInstruments}
              returns={returns}
              category={category}
              type={type}
              target={target}
              highlightDesc={highlightDesc}
              booking={booking}
            />
          );
        })}

        {!isLoading && followedListings.length === 0 && (
          <div className="no-listings" style={{ textAlign: "center", padding: "2rem" }}>
            You haven't followed any listings yet.
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default WishList;