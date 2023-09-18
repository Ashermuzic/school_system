import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const { currentUserRole, logout } = useContext(AuthContext);

  const navigate = useState();

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/dashboard" style={{ textDecoration: "none" }}>
          <span className="logo">
            {currentUserRole.charAt(0).toUpperCase() + currentUserRole.slice(1)}{" "}
            dashboard
          </span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">LISTS</p>
          <Link to="/admins" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Admins</span>
            </li>
          </Link>
          {currentUserRole === "admin" && (
            <div>
              <Link to="/students" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Students</span>
                </li>
              </Link>
              <Link to="/teachers" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Teachers</span>
                </li>
              </Link>
            </div>
          )}

          {currentUserRole === "admin" && (
            <div>
              <p className="title">USEFUL</p>
              <Link to="/stats" style={{ textDecoration: "none" }}>
                <li>
                  <InsertChartIcon className="icon" />
                  <span>Stats</span>
                </li>
              </Link>

              <Link
                to="/adminAttendanceView"
                style={{ textDecoration: "none" }}
              >
                <li>
                  <InsertChartIcon className="icon" />
                  <span>Admin Attendance</span>
                </li>
              </Link>
            </div>
          )}

          <p className="title">SERVICE</p>

          {currentUserRole === "admin" && (
            <Link to="/write" style={{ textDecoration: "none" }}>
              <li>
                <ComputerOutlinedIcon className="icon" />
                <span>Publish News</span>
              </li>
            </Link>
          )}

          {currentUserRole === "teacher" && (
            <Link to="/attachFile" style={{ textDecoration: "none" }}>
              <li>
                <LibraryBooksOutlinedIcon className="icon" />
                <span>Attach files</span>
              </li>
            </Link>
          )}

          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>

          {currentUserRole === "teacher" && (
            <div>
              <p className="title">STUDENTS</p>

              <Link to="/myStudents" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>My Students</span>
                </li>
              </Link>

              <Link to="/attendance" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Attendance</span>
                </li>
              </Link>

              <Link to="/attendanceView" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Attendance Details</span>
                </li>
              </Link>
            </div>
          )}
          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          <Link to="/" style={{ textDecoration: "none" }}>
            <li onClick={logout}>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
