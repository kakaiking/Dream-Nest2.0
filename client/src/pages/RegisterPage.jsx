import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import "../styles/Register.scss";
import { LuUpload } from "react-icons/lu";


const RegisterPage = () => {
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
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const [passwordMatch, setPasswordMatch] = useState(true);

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword || formData.confirmPassword === "");
  }, [formData.password, formData.confirmPassword]);

  const navigate = useNavigate();

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
      console.log(err.message);
    }
  };

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

          <input
            placeholder="Firm Name"
            name="firmName"
            type="text"
            value={formData.firmName}
            onChange={handleChange}
            required
          />
          <label htmlFor="krapin">
          <LuUpload  />
            Upload your KRA Pin
          </label>
          <input id='krapin' type="file" name="kraPin" placeholder="KRA Pin" onChange={handleChange} required />

          <label htmlFor="businessCert">
          <LuUpload  />
            Upload your Business Certificate
          </label>
          <input id='businessCert' type="file" name="businessCertificate" placeholder="Business Certificate" onChange={handleChange} required />

          <input
            placeholder="Year Started"
            name="yearStarted"
            type="number"
            value={formData.yearStarted}
            onChange={handleChange}
            required
          />
          <input
            placeholder="CMA Lisence"
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
          {/* <input
            placeholder="Physical Address(P.O BOX 25749-00603, Nairobi)"
            name="physicalAddress"
            value={formData.physicalAddress}
            onChange={handleChange}
            type="text"
          /> */}
          <button type="submit" disabled={!passwordMatch}>REGISTER</button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default RegisterPage;
