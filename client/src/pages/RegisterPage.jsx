import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Register.scss";
import { AiFillFileText } from "react-icons/ai";
import { categories, types } from "../data";

const RegisterPage = () => {
  const [category, setCategory] = useState("");
  const [type, setType] = useState("N/A");
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
    firmName: "_",
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
        <form className="register_content_form" onSubmit={handleSubmit} >

        <div className="create-listing_step1">
            <h3 >Which Of These Categories Best Describes Your Organization?</h3>
            <div className="category-list" style={{ color: '#fff' }}>
              {categories?.slice(1, 4).map((item, index) => (
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

            {formData.category !== "Investor" && (
            <>
            <h3 >Are you Certified by the Capital Markets Authority(CMA) of Kenya?</h3>
            <div className="type-list" >
              {types?.map((item, index) => (
                <div
                  className={`type ${type === item.name ? "selected" : ""}`}
                  key={index}
                  onClick={() => setType(item?.name || '')}
                >
                  <div className="type_text">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                  </div>
                  <div className="type_icon">{item.icon}</div>
                </div>
              ))}
            </div>
            </>
            )}
          </div>

          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>Email Address:</p>
          </div>
          <input
            placeholder="example@gmail.com"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>Enter Password:</p>
          </div>
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
          />

          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>Confirm Password:</p>
          </div>
          <input
            placeholder="Re-write the above password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

<div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>{formData.category == "Investor" ? 'Your Username' : "Organization Username"}: </p>
          </div>
          <input
            placeholder={`${formData.category == 'Investor' ? 'Your username' : "Organization's username"} `}
            name="firmName"
            type="text"
            value={formData.firmName}
            onChange={handleChange}
            required
          />

          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>Phone Number:</p>
          </div>
          <input
            type="number"
            placeholder="07XX-XXX-XXX"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}

          

          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>Upload Your Profile Photo:</p>
          </div>
          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile pic"
              style={{ maxWidth: "80px" }}
            />
          )}
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile pic" />
          </label>


          

{formData.category !== "Investor" && (
            <>
          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>Names Of Owner/s:</p>
          </div>
          <input
            placeholder="Owners"
            name="owners"
            value={formData.owners}
            onChange={handleChange}
            
          />
          </>
)}

{formData.category !== "Investor" && (
            <>
          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>The Year Your Organization Started:</p>
          </div>
          <input
            placeholder="Year Started"
            name="yearStarted"
            type="number"
            value={formData.yearStarted}
            onChange={handleChange}
            
          />
          </>
)}

{formData.category !== "Investor" && (
            <>
          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>CMA License Number:</p>
          </div>
          <input
            placeholder="CMA License No."
            name="cmaLicenseNumber"
            value={formData.cmaLicenseNumber}
            onChange={handleChange}
            type="number"
          />
          </>
)}

{formData.category !== "Investor" && (
            <>
          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>Organization Website:</p>
          </div>
          <input
            placeholder="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
          </>
)}




          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>{formData.kraPin ? formData.kraPin.name : "Upload your KRA Pin"}:</p>
          </div>
          <div className="document-upload">
            <label htmlFor="krapin">
              <AiFillFileText size={50} />
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

          {formData.category !== "Investor" && (
            <>
          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>{formData.businessCertificate ? formData.businessCertificate.name : "Upload your Business Certificate"}:</p>
          </div>
          
          <div className="document-upload">
            <label htmlFor="businessCert">
              <AiFillFileText size={50} />
            </label>
            <input
              id="businessCert"
              type="file"
              name="businessCertificate"
              style={{ display: "none" }}
              onChange={handleChange}
              
            />
          </div>
          </>
          )}

{formData.category !== "Investor" && (
            <>
          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>Assets Under Management:</p>
          </div>
          <input
            placeholder="Assets Under Management (ksh)"
            name="assetsUnderManagement"
            value={formData.assetsUnderManagement}
            onChange={handleChange}
            type="number"
          />
          </>
          )}

          <div style={{ width: '100%', height: '22px' }}>
            <p style={{ textAlign: 'left', color: '#fff' }}>Address Code:</p>
          </div>
          <input
            type="text"
            placeholder="Address (P.O BOX 25749-00603, Nairobi)"
            name="physical"
            value={formData.physical}
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
