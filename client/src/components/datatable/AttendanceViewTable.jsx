import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AttendanceViewColumns } from "../../datatablesource";
import { AuthContext } from "../../context/authContext";
import { DataGrid } from "@mui/x-data-grid";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const { currentTeacherId } = useContext(AuthContext);

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

  return (
    <div className="datatable">
      <div className="datatableTitle">Student's Attendance Details</div>

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

export default Attendance;
