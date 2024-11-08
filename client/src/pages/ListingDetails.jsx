import { useEffect, useState, useRef } from "react";
import "../styles/ListingDetails.scss";
import { useNavigate, useParams, Link } from "react-router-dom";
import { RemoveCircleOutline, AddCircleOutline, AddCircle } from "@mui/icons-material";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer"
import { grey } from "@mui/material/colors";
import { LuGoal } from "react-icons/lu";
import { FcBullish } from "react-icons/fc";
import { FcExpired } from "react-icons/fc";

import { AiOutlineClose } from "react-icons/ai"; // Close icon
import QRCode from "react-qr-code";
import html2canvas from "html2canvas"; // For QR download
import {
  FacebookShareButton, WhatsappShareButton, TwitterShareButton,
  LinkedinShareButton, TelegramShareButton
} from "react-share";
import {
  FaFacebook, FaWhatsapp, FaLinkedin, FaTelegram
} from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import { SlUserFollow } from "react-icons/sl";

import { FiShare2 } from "react-icons/fi";


import DOMPurify from 'dompurify';

const ListingDetails = () => {
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setCustomerEmail(user.email);
    setCustomerName(`${user.firmName} `);
  }, [user]);

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const qrRef = useRef(null); // Ref for QR code to download
  const url = window.location.href;

  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [pricePerShare, setPricePerShare] = useState(0);
  const [listingTitle, setListingTitle] = useState('')
  const [customerEmail, setCustomerEmail] = useState("")
  const [hostEmail, setHostEmail] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [customerReturns, setCustomerReturns] = useState("")
  const [updates, setUpdates] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const navigate = useNavigate()



  const getListingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3001/properties/${listingId}`);
      const data = await response.json();
      setListing(data);
      setPricePerShare(data.target / data.totalShares);
      setLoading(false);
    } catch (err) {
      console.error("Fetch Listing Details Failed", err);
      navigate(`/`);
      setLoading(false);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, [listingId]);


  const checkUserBooking = async () => {
    try {
      const response = await fetch(`http://localhost:3001/bookings/has-booking/${user._id}/${listingId}`);
      if (response.ok) {
        const data = await response.json();
        return data.hasBooking; // Return the booking status from the response
      }
      return false; // No booking found or error
    } catch (err) {
      console.error("Failed to check user bookings:", err);
      return false;
    }
  };

  const handleSubmit = async () => {
    const hasBooking = await checkUserBooking();
    
    if (hasBooking) {
      // User has a booking, navigate to the TopUpPage
      navigate(`/${user._id}/topup`);
    } else {
      // User does not have a booking, proceed with booking creation
      const bookingForm = {
        customerId: user._id,
        listingId,
        hostId: listing.creator._id,
        customerEmail,
        customerName,
        bookingPrice: pricePerShare * guestCount,
        totalPrice: pricePerShare * guestCount,
        guestCount,
        listingTitle: listing.title, 
        customerReturns: listing.returns 
      };

      try {
        const response = await fetch("http://localhost:3001/bookings/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingForm),
        });

        if (response.ok) {
          navigate(`/${user._id}/trips`);
        }
      } catch (err) {
        console.log("Submit Booking Failed.", err.message);
      }
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/follow-status/${user._id}/${listingId}`
      );
      const data = await response.json();
      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
    } catch (err) {
      console.error("Failed to fetch follow status:", err);
    }
  };

  const toggleFollow = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/properties/follow/${user._id}/${listingId}`,
        { method: "PATCH" }
      );
      const data = await response.json();
      setIsFollowing(data.isFollowing);
      setFollowersCount(data.followersCount);
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
    }
  };


  useEffect(() => {
    if (user && listingId) {
      checkFollowStatus();
    }
  }, [user, listingId]);


  const downloadQRCode = async () => {
    const canvas = await html2canvas(qrRef.current);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "qr-code.png";
    link.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const [guestCount, setGuestCount] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  /* SUBMIT BOOKING */
  const customerId = useSelector((state) => state?.user?._id)



  const [timeLeft, setTimeLeft] = useState('');
  // Set the date we're counting down to

  useEffect(() => {
    if (!listing?.bidExpiry) return;

    const updateTimer = () => {
      // Get today's date and time

      const countDownDate = new Date(listing.bidExpiry).getTime();

      const now = new Date().getTime();

      // Find the distance between now and the count down date
      const distance = countDownDate - now;

      // Time calculations for days, hours, minutes, and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Format the time left
      const formattedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      setTimeLeft(formattedTime);

      // If the count down is over, update with a message
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('EXPIRED');
      }
    };


    // Update the timer every second
    const interval = setInterval(updateTimer, 1000);
    updateTimer();
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);


  }, [listing?.bidExpiry]);

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const YouTubeThumbnail = ({ videoLink }) => {
    const videoId = getYouTubeVideoId(videoLink);
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;

    if (!thumbnailUrl) {
      return <div className="update-iconz"></div>;
    }

    return (
      <img
        src={thumbnailUrl}
        alt="Video thumbnail"
        className="update-iconz"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/path/to/fallback/image.jpg'; // Replace with your fallback image path
        }}
      />
    );
  };

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch(`http://localhost:3001/updates/listing/${listingId}`);
        const data = await response.json();
        setUpdates(data);
      } catch (err) {
        console.error("Failed to fetch updates", err);
      }
    };

    fetchUpdates();
  }, [listingId]);

  const handleCreateUpdate = () => {
    navigate(`/create-update/${listingId}`);
  };

  const stripHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />

      {/* <!-- Shop Info --> */}
      <section id="shopInfo">
        {/* Share Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AiOutlineClose
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              />

              {/* QR Code */}
              <div ref={qrRef} className="qr-code-container">
                <QRCode value={url} size={256} />
              </div>
              <button className="downloadBtnnn" onClick={downloadQRCode}>Download QR Code</button>

              {/* Link with Copy Button */}
              <div className="link-container">
                <input
                  type="text"
                  value={url}
                  readOnly
                  style={{ width: "80%" }}
                />

                <div className="vertical-divider"></div> {/* Vertical Divider */}
                <button className="copyBtnnn" onClick={copyToClipboard}>Copy Link</button>
              </div>

              {/* Share Buttons */}
              <div className="share-buttons">
                <FacebookShareButton url={url}><FaFacebook size={44} /></FacebookShareButton>
                <WhatsappShareButton url={url}><FaWhatsapp size={44} /></WhatsappShareButton>
                <TwitterShareButton url={url}><FaSquareXTwitter size={44} /></TwitterShareButton>
                <LinkedinShareButton url={url}><FaLinkedin size={44} /></LinkedinShareButton>
                <TelegramShareButton url={url}><FaTelegram size={44} /></TelegramShareButton>
              </div>
            </div>
          </div>
        )}

        <div className="infoCard">
          <div className="shopPhoto_Description">
            <div className="shopProfileImage">
              <img src="../assets/glossy_golden_coin.png" alt="Shop Profile Image" />
            </div>

            <div className="shopDescription">
              <div className="shopDescriptionText">
                <p>{listing.highlightDesc}</p>
              </div>
            </div>
          </div>

          <div className="shopAbout">
            <div className="aboutBlock">
              <div className="aboutIcon">
                <LuGoal style={{ width: '70%', minWidth: '35px', height: '70%', maxHeight: '50px', maxWidth: '50px', margin: '8% 30%', borderRadius: '7px', objectFit: 'cover' }} />
              </div>

              <div className="aboutDesciption">
                <div className="title">
                  <h2>Target</h2>
                </div>

                <div className="igPage">
                  <a href="">{listing.target.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</a>
                </div>
              </div>
            </div>

            <div className="aboutBlock">
              <div className="aboutIcon">
                <FcBullish style={{ width: '70%', minWidth: '35px', height: '70%', maxHeight: '50px', maxWidth: '50px', margin: '8% 30%', borderRadius: '7px', objectFit: 'cover' }} />

              </div>

              <div className="aboutDesciption">
                <div className="title">
                  <h2>Returns (%)</h2>
                </div>

                <div className="igPage">
                  <a href="">{listing.returns}</a>
                </div>
              </div>
            </div>

            <div className="aboutBlock">
              <div className="aboutIcon">
                <FcExpired style={{ width: '70%', minWidth: '35px', height: '70%', maxHeight: '50px', maxWidth: '50px', margin: '8% 30%', borderRadius: '7px', objectFit: 'cover' }} />

              </div>

              <div className="aboutDesciption">
                <div className="title">
                  <h2>Bid Expiry Date</h2>
                </div>

                <div className="igPage">
                  <a href="">{new Date(listing.bidExpiry).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}</a>
                </div>
              </div>
            </div>

            <div className="aboutBlock">
              <div className="aboutIcon" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <img src={`http://localhost:3001/${listing.creator.profileImagePath.replace("public", "")}`} style={{ width: '70%', minWidth: '35px', maxWidth: '50px', height: '70%', maxHeight: '50px', margin: '8% 30%', borderRadius: '7px', objectFit: 'cover' }} />
              </div>

              <div className="aboutDesciption">
                <div className="title">
                  <h2>Host</h2>
                </div>

                <div className="igPage">
                  <a href="">{listing.creator.firmName}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Follow and Share Buttons */}
      <div className="btnnns"
        style={{
          display: 'flex',
          flexDirection: 'row'
        }}
      >
        {/* Follow Button */}
        {user?._id !== listing.creator._id && (
          <div
            className="btnnn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '200px',
              padding: '10px',
              border: '1px solid black',
              borderRadius: '5px',
              marginTop: '25px',
              marginRight: '15px',
              backgroundColor: '#fff',
              cursor: 'pointer'
            }}
            onClick={toggleFollow}
          >
            <SlUserFollow
              className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`}
              style={{
                minWidth: '20px',
                height: '20px',
                marginRight: '8px'
              }}
            />

            <h3>{isFollowing ? 'Unfollow' : 'Follow'} [{followersCount}]</h3>
          </div>
        )}

        {/* Share Button */}
        <div
          className="btnnn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '200px',
            padding: '10px',
            border: '1px solid black',
            borderRadius: '5px',
            marginTop: '25px',
            backgroundColor: '#fff',
            cursor: 'pointer'
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <FiShare2
            className="shareBtn"
            style={{
              minWidth: '20px',
              height: '20px',
              marginRight: '8px'
            }}
          />
          <h3 style={{ margin: 0 }}>Share Listing</h3>
        </div>
      </div>


      <div className="listing-details">
        <div className="title">
          <h1>{listing.title}</h1>
          <div></div>
        </div>

        {listing.category != "Non-Profit" && (
          <>
            <h2>
              Earn up to {listing.returns}% from {listing.financialInstruments}
              <br />
            </h2>
            <h4>Bid payout dates: {listing.paymentDates}</h4>
          </>
        )}
        <h4>{listing.financialInstruments}</h4>
        <h4> {listing.type}</h4>
        <h4>Status: {timeLeft}</h4>
      </div>

      {/* <!-- Toggle Shop nav --> */}
      <section id="toggleShop">
        <div className="toggleBtns">
          <button
            id="ProductsHeader"
            className={`header-btn toggleHeaderProducts ${activeTab === 'description' ? 'toggleHeaderBorder' : ''}`}
            onClick={() => handleTabChange('description')}
          >Description</button>

          <button
            id="ProductsHeader"
            className={`header-btn toggleHeaderProducts ${activeTab === 'host' ? 'toggleHeaderBorder' : ''}`}
            onClick={() => handleTabChange('host')}
          >Host</button>

          <button
            className={`header-btn toggleHeaderProducts ${activeTab === 'updates' ? 'toggleHeaderBorder' : ''}`}
            onClick={() => handleTabChange('updates')}
          >Updates</button>

        </div>

      </section>


      <div className={`tab ${activeTab === 'description' ? 'description' : 'hidden'}`}>
        <h2 style={{ paddingLeft: '-40px' }}>Description:</h2>

        <div className="tabb">
          <div className='descriptionText'>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(listing.description) }} />
          </div>

          <div className='bidInfo'>
            <h2 style={{textAlign: 'center'}}>Select The Number Of <u>Shares Of Interest</u> You Want For This Project </h2><br /><hr /> <br />
            <div className="date-range-calendar">
              <h3>
                {'Target: ksh. ' + listing.target.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h3>
              <h3>Total Listing Shares: {listing.totalShares}</h3>
              <h3>Remaining Shares Of Interest: {listing.shares - guestCount}</h3>
              <h3 style={{ marginTop: '10px' }}>
                Price Per Share: {pricePerShare.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h3>

              <div className="basic">
                <div className="basic_count">
                  <RemoveCircleOutline
                    onClick={() => {
                      guestCount > 1 && setGuestCount(guestCount - 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: grey },
                    }}
                  />
                  <p>{guestCount}</p>
                  <AddCircleOutline
                    onClick={() => {
                      setGuestCount(guestCount + 1);
                    }}
                    sx={{
                      fontSize: "25px",
                      cursor: "pointer",
                      "&:hover": { color: grey },
                    }}
                  />
                </div>
              </div>

              <div className="totalPrice">
                {guestCount > 1 ? (
                  <h2>
                    {pricePerShare.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/= x {guestCount} Shares
                  </h2>
                ) : (
                  <h2>
                    {pricePerShare.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/= x {guestCount} Share
                  </h2>
                )}
                <h2>
                  Total Bid Price: ksh.{(pricePerShare * guestCount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </h2>
              </div>


              <button className="button" type="submit" onClick={handleSubmit}>
                PLACE BID
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className={`tab  ${activeTab === 'host' ? 'host' : 'hidden'}`}>
        {/* Profile Tab */}
        <h2 style={{ paddingLeft: '-120px', marginBottom: '30px' }}>Professional Details:</h2>
        <section id="profile" className="tabb"> {/* Changed hidden to inline style */}
          <div className="profileContent">
            <div className="verifiedProfile">
              <div className="verifiedProfileData">
                <div className="verifiedDatum">
                  <div className="verifiedDatumTitle">
                    <h2 className="country">Company / Firm Name:</h2>
                  </div>
                  <div className="verifiedDatumData">
                    <h3 className="countryName">{listing.creator.firmName}</h3>
                  </div>
                </div>
                <div className="separator"></div>

                <div className="verifiedDatum">
                  <div className="verifiedDatumTitle">
                    <h2 className="country">Been A Fund Manager Since:</h2>
                  </div>
                  <div className="verifiedDatumData">
                    <h3 className="countryName">{listing.creator.yearStarted}</h3>
                  </div>
                </div>
                <div className="separator"></div>

                <div className="verifiedDatum">
                  <div className="verifiedDatumTitle">
                    <h2 className="country">CMA License Number:</h2>
                  </div>
                  <div className="verifiedDatumData">
                    <h3 className="countryName">{listing.creator.cmaLicenseNumber}</h3>
                  </div>
                </div>
                <div className="separator"></div>

                <div className="verifiedDatum">
                  <div className="verifiedDatumTitle">
                    <h2 className="country">LinkedIn Profile / Professional Website:</h2>
                  </div>
                  <div className="verifiedDatumData">
                    <h3 className="countryName">{listing.creator.website}</h3>
                  </div>
                </div>
                <div className="separator"></div>

                <div className="verifiedDatum">
                  <div className="verifiedDatumTitle">
                    <h2 className="country"> Hosted Funding Projects:</h2>
                  </div>
                  <div className="verifiedDatumData">
                    <h3 className="countryName">{listing.creator.propertyList.length}</h3>
                  </div>
                </div>
                <div className="separator"></div>


                <div className="verifiedDatum">
                  <div className="verifiedDatumTitle">
                    <h2 className="country">Assets Under Management:</h2>
                  </div>
                  <div className="verifiedDatumData">
                    <h3 className="countryName">{listing.creator.assetsUnderManagement.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h3>
                  </div>
                </div>
                <div className="separator"></div>

                <div className="verifiedDatum">
                  <div className="verifiedDatumTitle">
                    <h2 className="country">Physical Address:</h2>
                  </div>
                  <div className="verifiedDatumData">
                    <h3 className="countryName">{listing.creator.physical}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="moreDetailsBtn">
              <div className="moreDetailsBt" style={{ width: '220px', margin: '0 auto' }}>
                <Link to={`/${listing.creator._id}/details`} className= "moreDetailsBtnn" style={{textDecoration: 'none', color: 'white' , height: '100%', width: '100%'}}> Show More Details</Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className={`tab ${activeTab === 'updates' ? 'updates' : 'hidden'}`}>
        <h2 style={{ paddingLeft: '40px' }}>Project Updates:</h2>
        <div className="tabbU">

          {updates.map((update) => (
            <div key={update._id} className="update-item" onClick={() => navigate(`/update/${update._id}`)}>
              <div className="update-itemm">
                <div className="update-icon">
                  <YouTubeThumbnail videoLink={update.videoLink} />
                </div>

                <div className="update-description">
                  <div className="update-descriptionTitle">
                    <h3>{update.title}:</h3>
                  </div>

                  <div className="update-descriptionP">
                    <p>
                      {stripHtmlTags(update.description).split(' ').slice(0, 6).join(' ')}
                      {stripHtmlTags(update.description).split(' ').length > 6 ? '...' : ''}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          ))}
          {listing.creator._id === user._id && (
            <button
              className="floating-add-btn"
              onClick={handleCreateUpdate}
              style={{ justifyContent: 'center', textAlign: 'center', fontSize: 'larger', fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0)', width: '80px', height: '80px', borderRadius: '50%' }}
            >

              <AddCircle style={{ fontSize: '80px', color: '#24355A', width: '100%', }} />
            </button>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ListingDetails;
