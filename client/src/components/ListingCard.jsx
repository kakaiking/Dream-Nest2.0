import { useState } from "react";
import "../styles/ListingCard.scss";
import {
  ArrowForwardIos,
  ArrowBackIosNew,
  Favorite,
} from "@mui/icons-material";
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

  /* ADD TO WISHLIST */
  const user = useSelector((state) => state.user);
  const wishList = user?.wishList || [];

  const isLiked = wishList?.find((item) => item?._id === listingId);

  const patchWishList = async () => {
    if (user?._id !== creator._id) {
      const response = await fetch(
        `http://localhost:3001/users/${user?._id}/${listingId}`,
        {
          method: "PATCH",
          header: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(setWishList(data.wishList));
    } else {
      return;
    }
  };

  // Function to determine the background gradient based on category
  const getBackgroundGradient = () => {
    switch (category) {
      case "Fund Manager":
        return "linear-gradient(330deg, #c33764, #1d2671)";
      case "Enterprise":
        return "linear-gradient(330deg, #43cea2, #185a9d)";
      case "Non-Profit":
        return "linear-gradient(330deg, #ff9966, #ff5e62)";
      default:
        return "linear-gradient(330deg, #c33764, #1d2671)"; // Default gradient
    }
  };

  return (
    <div
      className="listing-card"
      onClick={() => {
        navigate(`/properties/${listingId}`);
      }}
    >
      <div className="slider-container">
        <div className="slider" style={{ background: getBackgroundGradient() }}>
          {/* <img src="../assets/target.jpg" alt="project pic`" /> */}
        </div>
      </div>

      {!booking ? (
        <>
          <h2>{title}</h2>
          <h3>
            {returns}%, {financialInstruments}
          </h3>
          <p>{category}</p>
          <p>{type}</p>
          <p>
            <span>
              Target:{" "}
              <span style={{ color: "#c33764" }}>
                {target.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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

      <button
        className="favorite"
        onClick={(e) => {
          e.stopPropagation();
          patchWishList();
        }}
        disabled={!user}
      >
        {isLiked ? (
          <Favorite sx={{ color: "red" }} />
        ) : (
          <Favorite sx={{ color: "white" }} />
        )}
      </button>
    </div>
  );
};

export default ListingCard;