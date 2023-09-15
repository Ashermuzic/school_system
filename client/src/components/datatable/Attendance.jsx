import "./datatable.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { DataGrid } from "@mui/x-data-grid";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const { currentTeacherId } = useContext(AuthContext);

  // Create state variables to track the selected status for each student
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    // Fetch the students' data when the component mounts
    axios
      .get(`http://localhost:8081/students/teacher/${currentTeacherId}`)
      .then((res) => {
        if (res.status === 200) {
          // Initialize attendanceData with the student data
          const initialAttendanceData = res.data.map((student) => ({
            student_id: student.student_id,
            status: "", // Initialize status as empty
          }));
          setAttendanceData(initialAttendanceData);
          setStudents(res.data);
        } else {
          console.error("Error fetching students' data.");
        }
      });
  }, [currentTeacherId]);

  const handleAttendanceChange = (studentId, status) => {
    // Update the selected status state variable for the given student
    setSelectedStatus((prevSelectedStatus) => ({
      ...prevSelectedStatus,
      [studentId]: status,
    }));

    const updatedAttendance = attendanceData.map((student) =>
      student.student_id === studentId ? { ...student, status } : student
    );
    setAttendanceData(updatedAttendance);
  };

  const handleAttendanceSubmit = () => {
    // Send an API request to update attendance for each student
    attendanceData.forEach((student) => {
      const formattedAttendanceData = {
        teacher_id: currentTeacherId,
        student_id: student.student_id,
        date: new Date().toISOString().slice(0, 10),
        status: student.status,
      };

      axios
        .post("http://localhost:8081/attendance", formattedAttendanceData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          if (res.status === 200) {
            console.log("Attendance for student updated successfully.");
          } else {
            console.error("Error updating attendance for student.");
          }
        })
        .catch((error) => {
          console.error("An error occurred while updating attendance:", error);
        });
    });
  };

  const columns = [
    { field: "student_id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Student Name",
      width: 260,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img
              className="cellImg"
              src={`http://localhost:8081/images/${params.row.img}`}
              alt="avatar"
            />
            {params.row.name}
          </div>
        );
      },
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 130,
    },
    {
      field: "status",
      headerName: "Attendance Status",
      flex: 1,
      renderCell: (params) => {
        const studentId = params.row.student_id;

        return (
          <div style={{ display: "flex" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "20px",
              }}
            >
              Present
              <input
                type="checkbox"
                style={{ marginLeft: "10px" }}
                checked={selectedStatus[studentId] === "present"}
                onChange={() => handleAttendanceChange(studentId, "present")}
              />
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "20px",
              }}
            >
              Absent
              <input
                type="checkbox"
                style={{ marginLeft: "10px" }}
                checked={selectedStatus[studentId] === "absent"}
                onChange={() => handleAttendanceChange(studentId, "absent")}
              />
            </label>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Mark Attendance{" "}
        <span style={{ fontSize: "17px" }}>
          {new Date().toISOString().slice(0, 10)}
        </span>
      </div>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={students}
          columns={columns}
          pageSize={10}
          checkboxSelection
        />
      </div>

      <button
        style={{
          marginTop: "20px",
          padding: "7px 15px",
          background: "#394dffe8",
          border: "none",
          color: "#fff",
          boxShadow: "2px 2px 3px #444",
        }}
        className="attendance-submit"
        onClick={handleAttendanceSubmit}
      >
        Submit Attendance
      </button>
      <style>
        {`
          button:active {
            transform: translateY(1px);
            box-shadow: 1px 1px 3px #444;
          }
        `}
      </style>
    </div>
  );
};

export default Attendance;
