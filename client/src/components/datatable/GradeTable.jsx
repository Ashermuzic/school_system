import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { gradeColumns } from "../../datatablesource"; // Remove userRows import
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const GradeTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/students/teacher/2")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        } else {
          console.log("error");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const { teacherId } = useParams(); // Access the userId parameter from the URL
  // const handleDelete = (id) => {
  //   setData(data.filter((item) => item.id !== id));
  // };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {/* Use dynamic Link to navigate to Single component */}
            <Link
              to={`/students/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
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
        columns={gradeColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default GradeTable;
