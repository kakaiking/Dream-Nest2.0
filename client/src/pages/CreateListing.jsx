import React, { useState, useEffect } from 'react';
import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import { categories, types } from "../data";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/QuillEditor.scss';

const CreateListing = () => {
  const [user, setUser] = useState({});
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const userId = useSelector((state) => state.user?._id); // Access user ID directly if possible
  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    if (!userId) return; // Ensure userId is available

    try {
      const response = await fetch(`http://localhost:3001/users/${userId}/details`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setCategory(data.category || ""); // Initialize category and type here
        setType(data.type || "");
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

  /* LOCATION */
  const [formLocation, setFormLocation] = useState({
    bidExpiry: "",
    financialInstruments: "",
    returns: "",
    paymentDates: "",
    target: "",
    shares: "",
  });

  const handleChangeLocation = (e) => {
    const { name, value } = e.target;
    setFormLocation({
      ...formLocation,
      [name]: value,
    });
  };

  /* DESCRIPTION */
  const [formDescription, setFormDescription] = useState({
    title: "",
    description: "",
    highlightDesc: "",
  });

  const handleChangeDescription = (e) => {
    const { name, value } = e.target;
    setFormDescription({
      ...formDescription,
      [name]: value,
    });
  };

  const handleChangeRichText = (content) => {
    setFormDescription({
      ...formDescription,
      description: content,
    });
  };

  const creatorId = useSelector((state) => state.user?._id);
  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      const listingForm = new FormData();
      listingForm.append("creator", creatorId);
      listingForm.append("category", category);
      listingForm.append("type", type);
      listingForm.append("bidExpiry", formLocation.bidExpiry);
      listingForm.append("financialInstruments", formLocation.financialInstruments);
      listingForm.append("returns", formLocation.returns);
      listingForm.append("paymentDates", formLocation.paymentDates);
      listingForm.append("target", formLocation.target);
      listingForm.append("totalShares", formLocation.shares);
      listingForm.append("shares", formLocation.shares);
      listingForm.append("title", formDescription.title);
      listingForm.append("description", formDescription.description);
      listingForm.append("highlightDesc", formDescription.highlightDesc);


      const response = await fetch("http://localhost:3001/properties/create", {
        method: "POST",
        body: listingForm,
      });

      if (response.ok) {
        navigate("/");
      }
    } catch (err) {
      console.log("Publish Listing failed", err.message);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <>
      <Navbar />

      <div className="create-listing">
        <h1>Create A Funding Proposal</h1>
        <form onSubmit={handlePost}>
          <div className="create-listing_step1">
            <h2>Step 1: Tell Us About Your Funding Project</h2>
            <hr />

            <div className="full">
              <div className="location">
                <p>What's Your Project Target?</p>
                <input
                  type="number"
                  placeholder="100,000"
                  name="target"
                  value={formLocation.target}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <div className="full">
              <div className="location">
                <p>How many shares do you want for this project?</p>
                <input
                  type="number"
                  placeholder="10000"
                  name="shares"
                  value={formLocation.shares}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <p>Bid Expiry (Date)</p>
                <input
                  type="date"
                  placeholder="13 Jun 2024"
                  name="bidExpiry"
                  value={formLocation.bidExpiry}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
              <div className="location">
                <p>Where Will This Money Be Used?</p>
                <input
                  type="text"
                  maxLength="21"
                  placeholder="Stocks, Bonds, Building A Church..."
                  name="financialInstruments"
                  value={formLocation.financialInstruments}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>

            <div className="half">
              <div className="location">
                <details >
                  <summary style={{ cursor: "pointer" }}><b>Returns On Investment (%)</b></summary>
                  <p>If there are no returns for this listing, put ROI as 0</p>
                </details>
                <input
                  type="number"
                  placeholder="12"
                  name="returns"
                  value={formLocation.returns}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
              <div className="location">
                <p>Payment Dates</p>
                <input
                  type="text"
                  placeholder="13 Aug 2024, 1 Nov 2024, 3 Jan 2025"
                  name="paymentDates"
                  value={formLocation.paymentDates}
                  onChange={handleChangeLocation}
                  required
                />
              </div>
            </div>
          </div>

          <div className="create-listing_step2">
            <h2>Step 2: Provide The Following Key Information About This Project</h2>
            <hr />

            <div className="description">
              <p>Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                maxLength="21"
                value={formDescription.title}
                onChange={handleChangeDescription}
                required
              />
              <p>Highlight Of Details</p>
              <textarea
                type="text"
                placeholder="Highlight details"
                name="highlightDesc"
                value={formDescription.highlightDesc}
                onChange={handleChangeDescription}
                required
              />
              <p>Indepth Description of How You Intend To Use The Funds Given To Achieve Your Goals</p>
              <ReactQuill
                value={formDescription.description}
                onChange={handleChangeRichText}
                modules={modules}
                formats={formats}
                style={{ height: "300px" }}
              />
            </div>
          </div>

          <button className="submit_btn" type="submit">
            CREATE YOUR LISTING
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default CreateListing;
