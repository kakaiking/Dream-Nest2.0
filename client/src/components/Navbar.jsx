import { IconButton } from "@mui/material";
import { Search, Person, Menu } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../styles/Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import {jwtDecode} from "jwt-decode";


const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Check if user is admin
  const token = useSelector((state) => state.token);
  const decodedUser = token ? jwtDecode(token) : null;
  const isAdmin = decodedUser && decodedUser.isAdmin;

  return (
    <div className="navbar">
      <a href="/">
        <img src="/assets/logo.png" alt="logo" />
      </a>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""}>
          <Search
            sx={{ color: variables.pinkred }}
            onClick={() => {
              navigate(`/properties/search/${search}`);
            }}
          />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user ? (
          <a href="/create-listing" className="host">
            Start A Funding Project
          </a>
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
            
            {isAdmin && (
              <>
                <Link to="/admin">Admin Dashboard</Link>
              </>
            )}

            <Link to={`/${user._id}/trips`}>My Bids</Link>
            <Link to={`/${user._id}/reservations`}>My Project Updates</Link>
            <Link to={`/${user._id}/properties`}>My Hosted Projects</Link>
            <Link to={`/${user._id}/wishList`}>Wish List</Link>
            <Link to={`/${user._id}/details`}>My Profile</Link>
            <Link to="/create-listing">Host A Project</Link> 
            <hr />
            <Link to={`/${user._id}/fileReturns`}>File Returns</Link>
            <Link to={`/${user._id}/return-logs`}>Returns Logs</Link>

            <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout());
                localStorage.removeItem("token"); // Clear token on logout
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
