import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { gradeColumns } from "../../datatablesource"; // Remove userRows import
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";

const GradeTable = () => {
  const [data, setData] = useState([]);
  const { currentTeacherId } = useContext(AuthContext);

  const passFailThreshold = 60;

  useEffect(() => {
    axios
      .get(`http://localhost:8081/students/teacher/${currentTeacherId}`)
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

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Manage Student
        <Link to="/students/new" className="link">
          Add Student
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={gradeColumns.concat(GradeProcessed)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default GradeTable;
