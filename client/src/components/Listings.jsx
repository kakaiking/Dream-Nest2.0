import { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/Listings.scss";
import ListingCard from "./ListingCard";
import Loader from "./Loader";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";

const Listings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [targetImg, setTargetImg] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("All");

  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        selectedCategory !== "All"
          ? `http://localhost:3001/properties?category=${selectedCategory}`
          : "http://localhost:3001/properties",
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setListings({ listings: data }));
      setLoading(false);
      // console.log(data)
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  return (
    <>
      <div className="category-listt">
        <div className="category-list">
          {categories?.map((category, index) => (
            <div
              className={`category ${category.label === selectedCategory ? "selected" : ""}`}
              key={index}
              onClick={() => setSelectedCategory(category.label)}
            >
              <div className="category_icon">{category.icon}</div>
              <p className="categoryP">{category.label}</p>
            </div>
          ))}
        </div>
      </div>


      {loading ? (
        <Loader />
      ) : (
        <div className="listings">


          {listings.map(
            ({
              _id,
              creator,
              title,
              bidExpiry,
              financialInstruments,
              returns,
              category,
              type,
              target,
              highlightDesc,
              booking = false
            }) => (
              <ListingCard
              key={_id}
                listingId={_id}
                title={title}
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
            )
          )}

        </div>
      )}
    </>
  );
};

export default Listings;
