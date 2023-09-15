import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Stats = () => {
  const [searchSubject, setSearchSubject] = useState(""); // State for search bar value

  const handleSearchInputChange = (event) => {
    setSearchSubject(event.target.value); // Update the state with the input value
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="charts">
          <Featured />
          <Chart title="Average Points per Subject" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="wrapper">
            <div className="listTitle">Top Scoring Students</div>
            <div className="search">
              <input
                type="text"
                placeholder="Search by subject ..."
                value={searchSubject}
                onChange={handleSearchInputChange}
              />
              <SearchOutlinedIcon style={{ cursor: "pointer" }} />
            </div>
          </div>
          <Table searchSubject={searchSubject} />{" "}
          {/* Pass the searchSubject as a prop */}
        </div>
      </div>
    </div>
  );
};

export default Stats;
