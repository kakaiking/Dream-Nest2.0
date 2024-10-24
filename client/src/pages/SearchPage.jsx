import { useParams } from "react-router-dom";
import "../styles/List.scss";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../redux/state";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

const SearchPage = () => {
  const [loading, setLoading] = useState(true);
  const { search } = useParams();
  const listings = useSelector((state) => state.listings);

  const dispatch = useDispatch();

  const getSearchListings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/search/${search}`,
        { method: "GET" }
      );
      const data = await response.json();
      dispatch(setListings({ listings: data }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Search List failed!", err.message);
    }
  };

  useEffect(() => {
    getSearchListings();
  }, [search]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{search}</h1>
      <div className="list">
        {listings?.map(
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
            booking = false,
          }) => (
            <ListingCard
              key={_id} // Add key here to avoid the warning
              listingId={_id}
              title={title}
              creator={creator}
              bidExpiry={bidExpiry}
              financialInstruments={financialInstruments}
              returns={returns}
              category={category}
              type={type}
              target={target}
              booking={booking}
            />
          )
        )}
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
