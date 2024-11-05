import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";
import { AiFillFileText } from "react-icons/ai";
import { categories, types } from "../data";

const RegisterPage = () => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    owners: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
    kraPin: null,
    businessCertificate: null,
    firmName: "",
    yearStarted: "",
    cmaLicenseNumber: "",
    assetsUnderManagement: "",
    physical: "",
    website: "",
    phoneNumber: "",
    category: "",
    type: "",
  });

  useEffect(() => {
    setFormData((prevData) => ({ ...prevData, category, type }));
  }, [category, type]);

  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword || formData.confirmPassword === ""
    );
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registerForm = new FormData();
      for (let key in formData) {
        registerForm.append(key, formData[key]);
      }

      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: registerForm,
      });

      if (response.ok) {
        navigate("/login");
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  console.log(formData)

  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="Owners"
            name="owners"
            value={formData.owners}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}
          <div className="create-listing_step1">

            <h3 >Which Of These Categories Best Describes Your Organization?</h3>
            <div className="category-list" style={{ color: '#fff' }}>
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

            <h3 >Are you Certified by the Capital Markets Authority(CMA) of Kenya?</h3>
            <div className="type-list" >
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
          </div>

          

          <input
            placeholder="Firm Name"
            name="firmName"
            type="text"
            value={formData.firmName}
            onChange={handleChange}
            required
          />

          <input
            placeholder="Year Started"
            name="yearStarted"
            type="number"
            value={formData.yearStarted}
            onChange={handleChange}
            required
          />
          <input
            placeholder="CMA License"
            name="cmaLicenseNumber"
            value={formData.cmaLicenseNumber}
            onChange={handleChange}
            type="number"
            required
          />
          <input
            placeholder="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />

<input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile pic" />
            <p>Upload a Profile Photo</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile pic"
              style={{ maxWidth: "80px" }}
            />
          )}

          <div className="document-upload">
            <label htmlFor="krapin">
              <AiFillFileText size={50} />
              <p>{formData.kraPin ? formData.kraPin.name : "Upload your KRA Pin"}</p>
            </label>
            <input
              id="krapin"
              type="file"
              name="kraPin"
              style={{ display: "none" }}
              onChange={handleChange}
              required
            />
          </div>

          <div className="document-upload">
            <label htmlFor="businessCert">
              <AiFillFileText size={50} />
              <p>{formData.businessCertificate ? formData.businessCertificate.name : "Upload your Business Certificate"}</p>
            </label>
            <input
              id="businessCert"
              type="file"
              name="businessCertificate"
              style={{ display: "none" }}
              onChange={handleChange}
              required
            />
          </div>
          
          <input
            placeholder="Assets Under Management (ksh)"
            name="assetsUnderManagement"
            value={formData.assetsUnderManagement}
            onChange={handleChange}
            type="number"
          />
          <input
            type="text"
            placeholder="Address (P.O BOX 25749-00603, Nairobi)"
            name="physical"
            value={formData.physical}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          <button type="submit" disabled={!passwordMatch}>
            REGISTER
          </button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
