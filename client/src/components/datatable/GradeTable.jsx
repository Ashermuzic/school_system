import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { gradeColumns } from "../../datatablesource"; // Remove userRows import
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const GradeTable = () => {
  const [data, setData] = useState([]);
  const { currentUserId } = useContext(AuthContext);

  const passFailThreshold = 60;

  useEffect(() => {
    axios
      .get(`http://localhost:8081/students/teacher/${currentUserId}`)
      .then((res) => {
        if (res.status === 200) {
          // Calculate "Total" and "Pass / Fail" for each student
          const processedData = res.data.map((student) => ({
            ...student,
            total:
              student.continuous_assessment +
              student.midterm +
              student.final_exam,
            pass_fail:
              student.continuous_assessment +
                student.midterm +
                student.final_exam >=
              passFailThreshold
                ? "Pass"
                : "Fail", // Adjust passFailThreshold as needed
          }));

          setData(processedData);
        } else {
          console.log("error");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const GradeProcessed = [
    {
      field: "total",
      headerName: "Total",
      width: 120,
    },
    {
      field: "pass_fail",
      headerName: "Pass / Fail",
      width: 110,
      renderCell: (params) => {
        const isPass = params.value === "Pass";
        const cellClass = isPass ? "active" : "passive";

        return (
          <div className={`cellWithStatus ${cellClass}`}>{params.value}</div>
        );
      },
    },
  ];

  // Function to handle PUT request
  const handlePutGrade = (id, gradeType, value) => {
    console.log(`Updating grade for row ID ${id}:`);
    console.log(`Grade Type: ${gradeType}`);
    console.log(`New Value: ${value}`);
    // Send a PUT request to your /grades/:id endpoint with the updated grade data
    axios
      .put(`http://localhost:8081/studentGrades/${id}`, {
        [gradeType]: value,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("Grade updated successfully.");
        } else {
          console.log("Error updating grade.");
        }
      })
      .catch((error) => {
        console.error("An error occurred while updating grade:", error);
      });
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">Manage Student</div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={gradeColumns.concat(GradeProcessed)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        // Add an event handler to trigger PUT requests when grades change
        onCellEditCommit={(params) => {
          const { id, field, value } = params;
          if (
            ["continuous_assessment", "midterm", "final_exam"].includes(field)
          ) {
            handlePutGrade(id, field, value);
          }
        }}
      />
    </div>
  );
};
export default GradeTable;
