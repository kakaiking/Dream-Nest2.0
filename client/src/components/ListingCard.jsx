import { useState, useEffect } from "react";
import "../styles/ListingCard.scss";
import { ArrowForwardIos, ArrowBackIosNew, Favorite } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setWishList } from "../redux/state";

const ListingCard = ({
  listingId,
  creator,
  bidExpiry,
  financialInstruments,
  category,
  type,
  title,
  returns,
  paymentDates,
  target,
  customerEmail,
  customerName,
  totalPrice,
  listingTitle,
  customerReturns,
  booking,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const isLiked = wishList?.find((item) => item?._id === listingId);

  useEffect(() => {
    if (user && listingId) {
      checkFollowStatus();
    }
  }, [user, listingId]);

  const checkFollowStatus = async () => {
    if (!user?._id || !listingId) return;

    try {
      const response = await fetch(
        `http://localhost:3001/properties/follow-status/${user._id}/${listingId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check follow status');
      }

      const data = await response.json();
      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
    } catch (error) {
      console.error('Failed to check follow status:', error);
    }
  };

  const toggleFollow = async (e) => {
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (user?._id === creator._id) {
      return; // Prevent following own listing
    }

    try {
      const response = await fetch(
        `http://localhost:3001/properties/follow/${user._id}/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update follow status');
      }

      const data = await response.json();
      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
    } catch (error) {
      console.error('Failed to toggle follow status:', error);
    }
  };


  // Function to determine the background gradient based on category
  const getBackgroundGradient = () => {
    switch (category) {
      case "Fund Manager":
        return "linear-gradient(to left, #6441a5, #2a0855)";
      case "Enterprise":
        return "linear-gradient(to left, #c33764, #500040)";
      case "Non-Profit":
        return "linear-gradient(to right, #004000, #0f9b0f)";
      default:
        return "linear-gradient(330deg, #c33764, #1d2671)"; // Default gradient
    }
  };
  

  return (
    <div
      className="listing-card"
      onClick={() => {
        // Restrict non-logged-in users
        if (!user) {
          navigate('/login');
          return;
        }
        navigate(`/properties/${listingId}`);
      }}
    >
      <div className="slider-container">
        <div className="slider" style={{ background: getBackgroundGradient() }}>
          {/* <img src="../assets/target.jpg" alt="project pic" /> */}
        </div>
      </div>

      {!booking ? (
        <>
          <h2>{title}</h2>

          <h3>
            {returns}%, {financialInstruments}
          </h3>
          <p>{creator ? creator.firmName : 'Loading...'}</p>

          <p>{category}</p>
          {/* <p>{type}</p> */}
          <p>
            <span>
              Target:{" "}
              <span style={{ color: "#c33764" }}>
                {target}
              </span>
            </span>
          </p>
        </>
      ) : (
        <>
          <h2>{listingTitle}</h2>
          <p>
            {customerName} / {customerEmail}
          </p>
          <p>
            Bid: <span>Ksh{totalPrice}</span>
          </p>
        </>
      )}

      <div className="card-actions">
        {/* <button
          className="favorite"
          onClick={(e) => {
            e.stopPropagation();
            patchWishList();
          }}
          disabled={!user}
        >
          <Favorite sx={{ color: isLiked ? "red" : "white" }} />
        </button> */}

        {user?._id !== creator?._id && (
          <button
            className="follow-button"
            onClick={toggleFollow}
            disabled={!user}
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListingCard;
