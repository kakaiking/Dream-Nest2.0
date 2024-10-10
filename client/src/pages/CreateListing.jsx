import "../styles/CreateListing.scss";
import Navbar from "../components/Navbar";
import { categories, types } from "../data";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/QuillEditor.scss';





const CreateListing = () => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  /* LOCATION */
  const [formLocation, setFormLocation] = useState({
    bidExpiry: "",
    financialInstruments: "",
    returns: "",
    paymentDates: "",
    target: "",
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

  const creatorId = useSelector((state) => state.user._id);

  const navigate = useNavigate();

  const handlePost = async (e) => {
    e.preventDefault();

    try {
      /* Create a new FormData onject to handle file uploads */
      const listingForm = new FormData();
      listingForm.append("creator", creatorId);
      listingForm.append("category", category);
      listingForm.append("type", type);
      listingForm.append("bidExpiry", formLocation.bidExpiry);
      listingForm.append("financialInstruments", formLocation.financialInstruments);
      listingForm.append("returns", formLocation.returns);
      listingForm.append("paymentDates", formLocation.paymentDates);
      listingForm.append("target", formLocation.target);
      listingForm.append("title", formDescription.title);
      listingForm.append("description", formDescription.description);
      listingForm.append("highlightDesc", formDescription.highlightDesc);

      console.log(FormData)
      /* Send a POST request to server */
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
      [{ 'header': '1' }, { 'header': '2' }],  // Add this line
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
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
        <h1>Publish Your Place</h1>
        <form onSubmit={handlePost}>
          <div className="create-listing_step1">
            <h2>Step 1: Tell Us About Your Funding Project</h2>
            <hr />
            <h3>Which Of These Categories Best Describes Your Organization?</h3>
            <div className="category-list">
              {categories?.slice(1, 5).map((item, index) => (
                <div
                  className={`category ${category === item.label ? "selected" : ""
                    }`}
                  key={index}
                  onClick={() => setCategory(item.label)}
                >
                  <div className="category_icon">{item.icon}</div>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>

            <h3>Are you Certified by the Capital Markets Authority(CMA) of Kenya?</h3>
            <div className="type-list">
              {types?.map((item, index) => (
                <div
                  className={`type ${type === item.name ? "selected" : ""}`}
                  key={index}
                  onClick={() => setType(item.name)}
                >
                  <div className="type_text">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="type_icon">{item.icon}</div>
                </div>
              ))}
            </div>

            <h3>Now, What Are Your Project's Details?</h3>
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
                  maxlength="21"
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
                {/* <p>Return (%)</p> */}
                <details >
                  <summary style={{cursor: "pointer"}}><b>Returns On Investment (%)</b></summary>
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
            <h3>Finally, Provide The Following Key Information About This Project?</h3>
            <div className="description">
              <p>Title</p>
              <input
                type="text"
                placeholder="Title"
                name="title"
                maxlength="21"
                value={formDescription.title}
                onChange={handleChangeDescription}
                required
              />
              <p>Highlight Details</p>
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
                style={{height: "300px"}}
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
