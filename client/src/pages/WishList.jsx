import "../styles/List.scss";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer"

const WishList = () => {
  const wishList = useSelector((state) => state.user.wishList);
  console.log(wishList)

  return (
    <>
      <Navbar />
      <h1 className="title-list" style={{marginLeft: "40vw "}}>Your Wish List</h1>
      <div className="list">
      {wishList?.map((item, index) => {
          console.log(`Rendering item ${index}:`, item);
          
          if (!item) {
            console.warn(`Item at index ${index} is null or undefined`);
            return null;
          }

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
              key={_id || index}
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
      </div>
      <Footer />

    </>
  );
};

export default WishList;