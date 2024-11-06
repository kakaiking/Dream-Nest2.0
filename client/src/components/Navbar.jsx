import { Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link } from "react-router-dom";
import { setLogout } from "../redux/state";
import { jwtDecode } from "jwt-decode";
import { HiOutlineBellAlert } from "react-icons/hi2";


const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();


  // Check if user is admin
  const token = useSelector((state) => state.token);
  const decodedUser = token ? jwtDecode(token) : null;
  const isAdmin = decodedUser && decodedUser.isAdmin;

  return (
    <div className="navbar">
      <a href="/" style={{ textDecoration: 'none', color: '#24355A' }} >
        {/* <img src="/assets/muamanaLogo.jpg" alt="logo" style={{borderRadius: '7px', height: '50px', width: '50px'}}/> */}
        <h1>Muamana</h1>
      </a>

      <div className="navbar_right">
        {user ? (
          <>
            <a href="/create-listing" className="host">
              Start A Funding Project
            </a>
            <div className="notiButton" style={{width: '50px'}}>
            <Link to={`/${user._id}/notifications`}>
              <HiOutlineBellAlert style={{width: '35%', minWidth: '35px', height: '35%', margin: '8% 20%', borderRadius: '7px', objectFit: 'cover' , color: '#24355A'}}/>
            </Link>
            </div>
            
          </>
        ) : (
          <a href="/login" className="host">
            Start A Funding Project
          </a>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: variables.darkgrey }} />
          {!user ? (
            <Person sx={{ color: variables.darkgrey }} />
          ) : (
            <img
              src={`http://localhost:3001/${user.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="profile photo"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link to={`/${user._id}/details`}>My Profile</Link>
            <Link to={`/${user._id}/insights`}>Insights</Link>
            <Link to={`/${user._id}/dashboard`}>Dashboard</Link>
            <Link to="/create-listing">Host A Project</Link>
            <hr />

            <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout());
                localStorage.removeItem("token"); // Clear token on logout
              }}
            >
              Log Out
            </Link>
            

            {isAdmin && (
              <><hr />
                <Link to="/admin">Admin Dashboard</Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
