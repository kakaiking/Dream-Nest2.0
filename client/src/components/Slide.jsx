import "../styles/Slide.scss";
import { IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import variables from "../styles/variables.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Slide = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search.trim() !== "") {
      navigate(`/properties/search/${search}`);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="slide">
      <h1>
        Fund a dream or invest in one. <br />
        Collaborate and transform visions into reality.
      </h1>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search For A Funding Project"
          value={search}
          style={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown} // Trigger search on Enter
        />
        <IconButton 
          disabled={search === ""} 
          onClick={handleSearch} // Trigger search on click
        >
          <Search 
            sx={{ color: variables.pinkred }} 
            className="searchIcon" 
          />
        </IconButton>
      </div>
    </div>
  );
};

export default Slide;
