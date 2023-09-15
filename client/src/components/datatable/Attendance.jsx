import "./datatable.scss";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext"; // Import your AuthContext

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const { currentTeacherId } = useContext(AuthContext); // Get the teacherId from AuthContext

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
          console.table(initialAttendanceData);
          setStudents(res.data);
        } else {
          console.error("Error fetching students' data.");
        }
      });
  }, []);

  const handleAttendanceChange = (studentId, status) => {
    console.log("Updating attendance for studentId:", studentId);
    console.log("New status:", status);

    const updatedAttendance = attendanceData.map((student) =>
      student.student_id === studentId ? { ...student, status } : student
    );
    setAttendanceData(updatedAttendance);
    console.table(updatedAttendance);
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

      console.table(formattedAttendanceData);

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

  return (
    <div className="attendance-container">
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <h2>Mark Attendance</h2> <p>{new Date().toISOString().slice(0, 10)}</p>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Attendance Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>
                <label>
                  Present
                  <input
                    type="checkbox"
                    name={`attendance-${student.student_id}-present`}
                    value="present"
                    onChange={() =>
                      handleAttendanceChange(student.student_id, "present")
                    }
                  />
                </label>
                <label>
                  Absent
                  <input
                    type="checkbox"
                    name={`attendance-${student.student_id}-absent`}
                    value="absent"
                    onChange={() =>
                      handleAttendanceChange(student.student_id, "absent")
                    }
                  />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="attendance-submit" onClick={handleAttendanceSubmit}>
        Submit
      </button>
    </div>
  );
};

export default Attendance;
