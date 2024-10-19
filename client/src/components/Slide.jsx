import "../styles/Slide.scss"
import { IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import variables from "../styles/variables.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Slide = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  return (
    <div className="slide">
      <h1>
        Fund a dream or invest in one. <br />
        Collaborate and transform visions into reality.
      </h1>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search For A Listing"
          value={search}
          style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""} >
          <Search
            sx={{ color: variables.pinkred }}
            onClick={() => {
              navigate(`/properties/search/${search}`);
            }}
            className="searchIcon"
          />
        </IconButton>
      </div>
    </div>
  );
};

export default Slide;
