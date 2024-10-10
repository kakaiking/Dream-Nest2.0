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
    const [propertyList, setPropertyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userId } = useParams();
    const dispatch = useDispatch();


    const getUserDetails = async () => {
        try {
            console.log('Fetching details for ID:', userId);
            const response = await fetch(`http://localhost:3001/users/${userId}/details`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                dispatch(setProfileDetails(data));
                setUser(data);
                setPropertyList(data.propertyList || []);
                console.log(data);
                console.log(propertyList);
            } else {
                console.error('Error fetching user details:', response.status);
            }

            setLoading(false);
        } catch (error) {
            console.error('Fetch user details failed:', error);
            setLoading(false);
        }
    };



    useEffect(() => {
        getUserDetails();
    }, [userId]);

    const [activeTab, setActiveTab] = useState('one');


    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
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
                                <div className="shopimg">
                                    <img src={`http://localhost:3001/${user.profileImagePath.replace("public", "")}`} alt="profile photo" />
                                </div>
                                {/* <p>{user.profileImagePath}</p> */}
                            </div>

                            <div className="shopAbout">
                                <div className="aboutBlock">
                                    <div className="aboutIcon">
                                    <FaPeoplePulling style={{ width: '70%', minWidth: '35px', height: '70%', margin: '8%', borderRadius: '7px', objectFit: 'cover' }}/>
                                    </div>

                                    <div className="aboutDesciption">
                                        <div className="title">
                                            <h2>Owner</h2>
                                        </div>

                                        <div className="igPage">
                                            <a href="">{user.firstName} {user.lastName}</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="aboutBlock">
                                    <div className="aboutIcon">
                                    <FaBuildingColumns style={{ width: '70%', minWidth: '35px', height: '70%', margin: '8%', borderRadius: '7px', objectFit: 'cover' }}/>
                                    </div>

                                    <div className="aboutDesciption">
                                        <div className="title">
                                            <h2>Firm Name</h2>
                                        </div>

                                        <div className="igPage">
                                            <a href="">{user.firmName}</a>
                                        </div>
                                    </div>
                                </div>

                                <div className="aboutBlock">
                                    <div className="aboutIcon">
                                    <IoIosMail style={{ width: '70%', minWidth: '35px', height: '70%', margin: '8%', borderRadius: '7px', objectFit: 'cover' }}/>
                                    </div>

                                    <div className="aboutDesciption">
                                        <div className="title">
                                            <h2>Email</h2>
                                        </div>

                                        <div className="igPage">
                                            <a href="">{user.email}</a>
                                        </div>
                                    </div>
                                </div>



                                <div className="aboutBlock">
                                    <div className="aboutIcon">
                                    <LuPhone style={{ width: '70%', minWidth: '35px', height: '70%', margin: '8%', borderRadius: '7px', objectFit: 'cover' }}/>
                                    </div>

                                    <div className="aboutDesciption">
                                        <div className="title">
                                            <h2>Phone Number</h2>
                                        </div>

                                        <div className="igPage">
                                            <a href="">{user.phoneNumber}</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className={`tab`} style={{marginTop: '30px'}}>
                    {/* Profile Tab */}
                    <section id="profile" > {/* Changed hidden to inline style */}
                        <div className="profileContent">
                            <div className="verifiedProfile">
                                <div className="verifiedProfileHeader">
                                    <h1>Professional Details:</h1>
                                </div>
                                
                                <div className="verifiedProfileData">
                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">Company / Firm Name</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.firmName}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">Been A Fund Manager Since:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.yearStarted}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">CMA License Number:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.cmaLicenseNumber}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">LinkedIn Profile / Professional Website:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.website}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country"> Hosted Funding Projects:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.propertyList.length}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>


                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">Assets Under Management:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.assetsUnderManagement}</h3>
                                        </div>
                                    </div>
                                    <div className="separator"></div>

                                    <div className="verifiedDatum">
                                        <div className="verifiedDatumTitle">
                                            <h2 className="country">Physical Address:</h2>
                                        </div>
                                        <div className="verifiedDatumData">
                                            <h3 className="countryName">{user.physical}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>


                {/* <p>Hello, {user.firstName || 'User'}!</p> Display a fallback if firstName is not available */}
                <Footer /> {/* Assuming you have a Footer component */}
            </div>
        )}
        </div>
    );
};

export default MyProfile;
