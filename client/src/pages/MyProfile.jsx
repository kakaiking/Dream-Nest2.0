import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/MyProfile.scss"
import { useParams, Link } from 'react-router-dom';
import { setProfileDetails, setPropertyList } from '../redux/state';
import ListingCard from '../components/ListingCard';
import { FaPeoplePulling } from "react-icons/fa6";
import { FaBuildingColumns } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { LuPhone } from "react-icons/lu";




const MyProfile = () => {
    const [user, setUser] = useState({});
    const [localPropertyList, setLocalPropertyList] = useState([]);
    const [followedListings, setFollowedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();
    const dispatch = useDispatch();


    const getUserDetails = async () => {
        try {
            // console.log('Fetching details for ID:', userId);
            const response = await fetch(`http://localhost:3001/users/${userId}/details`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(setProfileDetails(data));
                setUser(data);
                // console.log(data);
                // console.log(propertyList);
            } else {
                console.error('Error fetching user details:', response.status);
            }

            setLoading(false);
        } catch (error) {
            console.error('Fetch user details failed:', error);
            setLoading(false);
        }
    };

    const getPropertyList = async () => {
        try {
            const response = await fetch(`http://localhost:3001/users/${userId}/properties`, {
                method: "GET"
            })

            if (response.ok) {
                const data = await response.json()
                setLocalPropertyList(data);
                // console.log(data)
                dispatch(setPropertyList(data))
            } else {
                console.error('Error fetching Property Listings :', response.status);
            }
            setLoading(false)
        } catch (err) {
            console.log(err.message);
            setLoading(false);

        }
    }

    useEffect(() => {
        getPropertyList()
    }, [])

    useEffect(() => {
        getUserDetails();
    }, [userId]);

    const [activeTab, setActiveTab] = useState('description');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchFollowedListings = async () => {
            if (!user?._id) return;

            try {
                setLoading(true);
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
            } finally {
                setLoading(false);
            }
        };

        fetchFollowedListings();
    }, [user?._id]);


    // Helper function to remove 'public' from the path
    const getDocumentPath = (path) => path?.replace(/^\/?public/, '') || '';

    return (
        <div>{loading ? (
            <Loader /> // Replace with your loading spinner or message
        ) : (
            <div>
                <Navbar />

                {/* <!-- Shop Info --> */}
                <section id="shopInfo">
                    <div className="infoCards">
                        <div className="shopPhoto_Descriptions">
                            <div className="shopProfileImages">
                            <img
          src={`http://localhost:3001/${getDocumentPath(user.profileImagePath)}`}
          alt={`${user.firmName} Profile`}
          className="user-image"
        />
                                {/* <p>{user.profileImagePath}</p> */}
                            </div>

                            <div className="shopAbout">
                                <div className="aboutBlock">
                                    <div className="aboutIcon">
                                        <FaPeoplePulling style={{ width: '70%', minWidth: '35px', height: '70%', margin: '8%', borderRadius: '7px', objectFit: 'cover' }} />
                                    </div>

                                    <div className="aboutDesciption">
                                        <div className="title">
                                            <h2>Owner/s</h2>
                                        </div>

                                        <div className="igPage">
                                            <a href="">{user.owners || 'N/A'}</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="aboutBlock">
                                    <div className="aboutIcon">
                                        <FaBuildingColumns style={{ width: '70%', minWidth: '35px', height: '70%', margin: '8%', borderRadius: '7px', objectFit: 'cover' }} />
                                    </div>

                                    <div className="aboutDesciption">
                                        <div className="title">
                                            <h2>Firm Name</h2>
                                        </div>

                                        <div className="igPage">
                                            <a href="">{user.firmName || 'N/A'}</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="aboutBlock">
                                    <div className="aboutIcon">
                                        <IoIosMail style={{ width: '70%', minWidth: '35px', height: '70%', margin: '8%', borderRadius: '7px', objectFit: 'cover' }} />
                                    </div>

                                    <div className="aboutDesciption">
                                        <div className="title">
                                            <h2>Email</h2>
                                        </div>

                                        <div className="igPage">
                                            <a href="">{user.email || 'N/A'}</a>
                                        </div>
                                    </div>
                                </div>



                                <div className="aboutBlock">
                                    <div className="aboutIcon">
                                        <LuPhone style={{ width: '70%', minWidth: '35px', height: '70%', margin: '8%', borderRadius: '7px', objectFit: 'cover' }} />
                                    </div>

                                    <div className="aboutDesciption">
                                        <div className="title">
                                            <h2>Phone Number</h2>
                                        </div>

                                        <div className="igPage">
                                            <a href="">+254 {user.phoneNumber || 'N/A'}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* <!-- Toggle Shop nav --> */}
                <section id="toggleShop">
                    <div className="toggleBtns">
                        <button
                            id="ProductsHeader"
                            className={`header-btn toggleHeaderProducts ${activeTab === 'description' ? 'toggleHeaderBorder' : ''}`}
                            onClick={() => handleTabChange('description')}
                        >Info</button>

                        <button
                            id="ProductsHeader"
                            className={`header-btn toggleHeaderProducts ${activeTab === 'projects' ? 'toggleHeaderBorder' : ''}`}
                            onClick={() => handleTabChange('projects')}
                        >Listings</button>

                        <button
                            className={`header-btn toggleHeaderProducts ${activeTab === 'following' ? 'toggleHeaderBorder' : ''}`}
                            onClick={() => handleTabChange('following')}
                        >Following</button>

                    </div>

                </section>

                <div className={`tabProfile ${activeTab === 'description' ? 'description' : 'hidden'}`} >
                    {/* Profile Tab */}
                    <section id="profileMy" > {/* Changed hidden to inline style */}
                        <div className="profileContentMy">
                            <div className="verifiedProfileMy">
                                <div className="verifiedProfileHeader">
                                    <h1>{user.verified}</h1>
                                </div>

                                <div className="verifiedProfileData">
                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">Company / Firm Name</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.firmName || 'N/A'}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">Category</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.category || 'N/A'}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">CMA Certified</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.type || 'N/A'}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">Been A Fund Manager Since:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.yearStarted || 'N/A'}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">CMA License Number:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.cmaLicenseNumber || 'N/A'}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">LinkedIn Profile / Professional Website:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.website || 'N/A'}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country"> Hosted Funding Projects:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user?.propertyList?.length || '0'}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>


                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">Assets Under Management:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.assetsUnderManagement || 'N/A'}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">Physical Address:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.physical || 'N/A'}</h3>
                                        </div>
                                    </div>

                                </div>

                                <div className="supportDocs">
                                    <div className="supportTitle" style={{ width: '65%', margin: '0 auto 20px auto', textAlign: 'center' }}>
                                        <h3><u>User Documents:</u></h3>
                                    </div>
                                    <div className="doc-cards">
                                        <div className="doc-card">
                                            <a
                                                href={`http://localhost:3001${getDocumentPath(user.kraPinPath)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div className="doc-icon">📄</div>
                                                <div className="doc-name">KRA PIN</div>
                                            </a>
                                        </div>
                                        <div className="doc-card">
                                            <a
                                                href={`http://localhost:3001${getDocumentPath(user.businessCertificatePath)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <div className="doc-icon">📄</div>
                                                <div className="doc-name">Business Certificate</div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className={`tab ${activeTab === 'projects' ? 'projects' : 'hidden'}`}>
                    <div className="list">
                        {localPropertyList.map(
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
                </div>

                <div className={`tab ${activeTab === 'following' ? 'projects' : 'hidden'}`}>
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

                        {!loading && followedListings.length === 0 && (
                            <div className="no-listings" style={{ textAlign: "center", padding: "2rem" }}>
                                No Listings Followed Yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* <p>Hello, {user.firstName || 'User'}!</p> Display a fallback if firstName is not available */}
                <Footer /> {/* Assuming you have a Footer component */}
            </div>
        )}
        </div>
    );
};

export default MyProfile;
