import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AttendanceViewColumns } from "../../datatablesource";
import { AuthContext } from "../../context/authContext";
import { DataGrid } from "@mui/x-data-grid";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const AdminAttendanceViewTable = () => {
  const [students, setStudents] = useState([]);
  const [teacherName, setTeacherName] = useState(""); // State to store the entered teacher name
  const [currentTeacherId, setCurrentTeacherId] = useState(null); // State to store the current teacher's ID

  useEffect(() => {
    // Fetch the students' data when the component mounts
    axios
      .get(`http://localhost:8081/attendance/${currentTeacherId}`)
      .then((res) => {
        if (res.status === 200) {
          setStudents(res.data);
        } else {
          console.error("Error fetching students' data.");
        }
      });
  }, [currentTeacherId]);

  // Define a function to conditionally style the status cell
  const renderStatusCell = (params) => {
    const isPresent = params.value === "present";
    const cellClass = isPresent ? "active" : "passive";

    return <div className={`cellWithStatus ${cellClass}`}>{params.value}</div>;
  };

  const searchTeacherByName = () => {
    // Make a GET request to search for the teacher by name
    axios
      .get(`http://localhost:8081/teacher/search?name=${teacherName}`)
      .then((res) => {
        if (res.status === 200 && res.data.id) {
          setCurrentTeacherId(res.data.id);
        } else {
          console.error("Teacher not found.");
        }
      })
      .catch((error) => {
        console.error("Error searching for teacher:", error);
      });
  };

  return (
    <div className="datatable">
      <div className="wrapper">
        <div className="datatableTitle">
          Student's Attendance Details Per Teacher
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="Search by teacher ..."
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
          />
          <SearchOutlinedIcon
            style={{ cursor: "pointer" }}
            onClick={searchTeacherByName}
          />
        </div>
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={students}
          columns={[
            ...AttendanceViewColumns, // Include other columns
            {
              field: "status",
              headerName: "Status",
              width: 150,
              renderCell: renderStatusCell, // Use the custom render function
            },
          ]}
          pageSize={10}
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default AdminAttendanceViewTable;
